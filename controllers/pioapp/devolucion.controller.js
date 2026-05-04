const DevolucionModel = require('../../models/pioapp/tables/devolucion.model');
const DevolucionDetalleModel = require('../../models/pioapp/tables/devolucion_detalle.model');
const DevolucionEstadoModel = require('../../models/pioapp/tables/devolucion_estado.model');
const VwDevolucionPioApp = require('../../models/pioapp/views/vw_devolucion_pioapp.view');
const VwDevolucionDetallePioApp = require('../../models/pioapp/views/vw_devolucion_detalle_pioapp.view');
const VwReporteGeneralDevoluciones = require ('../../models/pioapp/views/vw_reporte_general_devoluciones.view');
const DevolucionDetallePiezasModel = require('../../models/pioapp/tables/devolucion_detalle_piezas.model');
const DevolucionMotivoModel = require('../../models/pioapp/tables/devolucion_motivo.model');
const NotaCreditoModel = require('../../models/pioapp/tables/nota_credito.model');
const NotaCreditoDetalleModel = require('../../models/pioapp/tables/nota_credito_detalle.model');
const NotaCreditoDetallePiezaModel = require('../../models/pioapp/tables/nota_credito_detalle_pieza.model');
const UserModel = require('../../models/pioapp/tables/users.model');
const { sequelize, sequelizeInit } = require('../../configuration/db');
const { Op, fn, col, where: sequelizeWhere, where } = require('sequelize');
const initTiendaModulo = require('../../models/pdv/views/vwTiendasModulo.view');

DevolucionMotivoModel.hasMany(DevolucionDetalleModel, { 
    foreignKey: 'id_devolucion_motivo', 
    as: 'detalles' 
});

DevolucionDetalleModel.belongsTo(DevolucionMotivoModel, { 
    foreignKey: 'id_devolucion_motivo' 
});

async function getAllDevoluciones(req, res) {
    const { fechaInicio, fechaFin, division } = req.params;
    console.log(req.user.rol);
    try {
        const whereConditions = {
            fecha_creacion: {
                [Op.between]: [fechaInicio, fechaFin]
            }
        };

        let estadosPermitidos = [];

        if (division && division !== "0") {
            whereConditions.division = division;
            estadosPermitidos.push(1,3,4);
        }

        if (req.user.rol === 14) {
            estadosPermitidos.push(2,3,4);
        }

        if (estadosPermitidos.length > 0) {
            whereConditions.id_devolucion_estado = {
                [Op.in]: estadosPermitidos
            };
        }

        const devoluciones = await VwDevolucionPioApp.findAll({
            where:  whereConditions,
            raw: true,
            order: [[ 'fecha_creacion', 'DESC' ]]
        });

        if(!devoluciones) {
            return res.status(404).json({ error: 'No se encontraron devoluciones' });
        }

        return res.json(devoluciones);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener las devoluciones',
            details: err.message
        });
    }
}

async function getDetalleDevolucionByDevolucion(req, res) {
    const { id_devolucion } = req.params;

    try {
        const detalles = await VwDevolucionDetallePioApp.findAll({
            where: {
                id_devolucion
            }
        });

        if (!detalles || detalles.length === 0) {
            return res.status(404).json({ error: 'No se encontraron detalles para la devolución' });
        }

        const respuestaAgrupada = {
            Pollo: [],
            Menudo: []
        };

        detalles.forEach(item => {
            const itemData = item.get({ plain: true });
            
            const um = (itemData.unidadMedida || "").toUpperCase();

            if (um === 'POLLO(S)') {
                respuestaAgrupada.Pollo.push(itemData);
            } else {
                respuestaAgrupada.Menudo.push(itemData);
            }
        });

        return res.json(respuestaAgrupada);

    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener el detalle de la devolución',
            details: err.message
        });
    }
}

async function getAllDevolucionesEstado(req, res) {
    try {
        const estados = await DevolucionEstadoModel.findAll({ raw: true });

        if(!estados) {{
            return res.status(404).json({ error: 'No se encontraron estados de devolución' });
        }}

        return res.json(estados);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener los estados de devolución',
            details: err.message
        });
    }
}

async function changeStatus(req, res) {
    const { id_devolucion } = req.params;
    const { newStatus, motivo_rechazo, items } = req.body;

    const t = await sequelize.transaction();

    try {
        // 1. Valida existencia
        const devolucion = await DevolucionModel.findByPk(id_devolucion);
        if (!devolucion) {
            await t.rollback();
            return res.status(404).json({ error: 'No se encontró la devolución' });
        }

        // 2. Actualiza Estado de la Devolución Cabecera
        const updateData = { id_devolucion_estado: newStatus };
        if (newStatus === 4) updateData.motivo_rechazo = motivo_rechazo;
        await devolucion.update(updateData, { transaction: t });

        // 3. Actualiza Cantidades (Detalle y Piezas) en la Devolución
        if (items && Array.isArray(items)) {
            const detallesPolloARecalcular = new Set();

            for (const item of items) {
                const partes = String(item.id_fila_unica).split('-');
                const idReal = parseInt(partes[partes.length - 1], 10);
                const valorAceptado = parseFloat(item.cantidadAceptada || 0);

                const um = (item.unidadMedida || "").trim().toUpperCase();

                if (um === 'POLLO(S)' || um === 'POLLO') {
                    // Actualiza la pieza individual en la devolución
                    await DevolucionDetallePiezasModel.update(
                        { cantidadAceptada: valorAceptado },
                        { where: { id_devolucion_detalle_pieza: idReal }, transaction: t }
                    );
                    if (item.id_devolucion_detalle) {
                        detallesPolloARecalcular.add(Number(item.id_devolucion_detalle));
                    }
                } else {
                    // Actualiza detalle directo (Menudo / Otros)
                    await DevolucionDetalleModel.update(
                        { cantidadAceptada: valorAceptado },
                        { where: { id_devolucion_detalle: idReal }, transaction: t }
                    );
                }
            }

            // 4. Recalcula totales de pollo
            for (const idPadre of detallesPolloARecalcular) {        
                const suma = await DevolucionDetallePiezasModel.sum('cantidadAceptada', {
                    where: { id_devolucion_detalle: idPadre },
                    transaction: t
                });

                await DevolucionDetalleModel.update(
                    { cantidadAceptada: suma || 0 },
                    { where: { id_devolucion_detalle: idPadre }, transaction: t }
                );
            }
        }

        // 5. Si el estado es 3, Crear Nota de Crédito completa
        if (newStatus === 3) {
            const notaCreada = await NotaCreditoModel.create({
                id_empresa: devolucion.empresa,
                empresa_nombre: devolucion.nombre_empresa,
                id_tienda: devolucion.tienda,
                tienda_nombre: devolucion.nombre_tienda,
                division: parseInt(devolucion.division),
                estado: 1,
                id_devolucion: devolucion.id_devolucion,
                idEntradaInventario: devolucion.idEntradaInventario,
                serieEntradaInventario: devolucion.serieEntradaInventario,
                userCreatedAt: devolucion.userCreatedAt,
                userUpdatedAt: req.user.id_user
            }, { transaction: t });

            // Obtiene los detalles actualizados
            const detallesActualizados = await DevolucionDetalleModel.findAll({
                where: { id_devolucion: devolucion.id_devolucion },
                transaction: t
            });

            for (const det of detallesActualizados) {
                // Inserta Detalle de Nota de Crédito
                const detalleNota = await NotaCreditoDetalleModel.create({
                    id_nota: notaCreada.id_nota,
                    ItemCode: det.ItemCode,
                    nombreProducto: det.nombreProducto,
                    cantidadDevolver: det.cantidadAceptada, 
                    unidadMedida: det.unidadMedida,
                    id_devolucion_motivo: det.id_devolucion_motivo,
                    userCreatedAt: req.user.id_user,
                    userUpdatedAt: req.user.id_user
                }, { transaction: t });

                const um = (det.unidadMedida || "").trim().toUpperCase();
                if (um === 'POLLO(S)' || um === 'POLLO') {
                    // Busca las piezas que acaba de actualizar en la devolución
                    const piezasDevolucion = await DevolucionDetallePiezasModel.findAll({
                        where: { id_devolucion_detalle: det.id_devolucion_detalle },
                        transaction: t
                    });

                    // Inserta cada pieza en la tabla de piezas de la nota de crédito
                    for (const pieza of piezasDevolucion) {
                        await NotaCreditoDetallePiezaModel.create({
                            id_nota_detalle: detalleNota.id_nota_detalle,
                            id_pieza: pieza.id_pieza,
                            nombrePieza: pieza.nombrePieza,
                            cantidad: pieza.cantidadAceptada,
                            userCreatedAt: req.user.id_user,
                            userUpdatedAt: req.user.id_user
                        }, { transaction: t });
                    }
                }
            }
        }

        if(newStatus === 3 || newStatus === 4) {
            const sequelizePDV = await sequelizeInit('PDV');
            const TiendaModuloModel = initTiendaModulo(sequelizePDV);
            const infoTienda = await TiendaModuloModel.findOne({
                where: {
                    codigo_empresa: devolucion.empresa,
                    codigo_tienda: devolucion.tienda
                },
                raw: true
            });

            const usuariosDestino = await UserModel.findAll({
                where: {
                    id_users: {
                        [Op.in]: [devolucion.userCreatedAt, infoTienda.codigo_administrador]
                    }
                },
                attributes: ['id_users'],
                transaction: t
            });

            const usersNotificacion = usuariosDestino.map(u => Number(u.id_users))
            let mensaje = "";
            if(newStatus === 3) mensaje = "Tu Solicitud de Devolución y Reclamo ha sido autorizada"
            if(newStatus === 4) mensaje = "Tu Solicitud de Devolución y Reclamo ha sido rechazada: " + motivo_rechazo
            
            const movilNotification = await fetch(`https://services.sistemaspinulito.com/pioapi/notificaciones/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                      Authorization: `Basic ${Buffer.from(
                        `${process.env.BASIC_AUTH_USER}:${process.env.BASIC_AUTH_PASS}`
                      ).toString('base64')}`
                    },
                    body: JSON.stringify({
                        user: usersNotificacion,
                        body: mensaje,
                        title: `Cambio en el estado de tu solicitud de devolución y reclamo`,
                        id_asunto_notificacion: 5,
                        data_payload: { id_devolucion:  devolucion.id_devolucion}
                    })
                })
                
                const movil = await movilNotification.json();
                if(!movilNotification.ok){
                    throw new Error(movil.message);
                    
                }
        }



        await t.commit();
        return res.status(200).json({ message: 'Estado, cantidades y Nota de Crédito procesados exitosamente' });

    } catch (err) {
        if (t) await t.rollback();
        console.error("Error detallado en changeStatus:", err);
        return res.status(500).json({ error: err.message });
    }
}

async function getAllDevolucionesMotivo(req, res) {
    try {
        const motivos = await DevolucionMotivoModel.findAll({ raw: true });

        if(!motivos) {
            return res.status(404).json({ error: 'No se encontraron motivos de devolución existentes' });
        }

        return res.json(motivos);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener los motivos de devolución',
            details: err.message
        });
    }
}

async function getReporteGeneralDevoluciones(req, res) {
    const { fechaInicio, fechaFin } = req.params;

    try {
        const whereConditions = {
            fecha_completa: {
                [Op.between]: [
                    `${fechaInicio} 00:00:00`, 
                    `${fechaFin} 23:59:59`
                ]
            }
        }

        const datosReporte = await VwReporteGeneralDevoluciones.findAll({
            where: whereConditions,
            raw: true,
            order: [
                ['fecha_completa', 'DESC'],
                ['id_devolucion', 'ASC']
            ]
        });

        if(!datosReporte || datosReporte.length === 0) {
            return res.status(404).json({ error: 'No se encontraron devoluciones para los filtros seleccionados' });
        }

        return res.json(datosReporte);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener el reporte de devoluciones',
            details: err.message
        });
    }
}

module.exports = {
    getAllDevoluciones,
    getDetalleDevolucionByDevolucion,
    getAllDevolucionesEstado,
    changeStatus,
    getAllDevolucionesMotivo,
    getReporteGeneralDevoluciones
}