const NotaCreditoModel = require('../../models/pioapp/tables/nota_credito.model');
const NotaCreditoDetalleModel = require('../../models/pioapp/tables/nota_credito_detalle.model');
const VwNotaCredito = require('../../models/pioapp/views/vw_nota_credito.view');
const VwNotaCreditoDetalle = require('../../models/pioapp/views/vw_nota_credito_detalle.view');
const DevolucionMotivoModel = require('../../models/pioapp/tables/devolucion_motivo.model');
const { Op, fn, col, where: sequelizeWhere, where } = require('sequelize');
const { sequelize } = require('../../configuration/db');

DevolucionMotivoModel.hasMany(NotaCreditoDetalleModel, { 
    foreignKey: 'id_devolucion_motivo',
});

NotaCreditoDetalleModel.belongsTo(DevolucionMotivoModel, { 
    foreignKey: 'id_devolucion_motivo' 
});

async function getNotasCredito(req, res) {
    const { mes, anio, division } = req.params;

    try {
        const whereConditions = [];

        if (anio) {
            whereConditions.push(
                sequelize.where(
                    sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM fecha_creacion')),
                    anio
                )
            );
        }

        // Filtro por mes
        if (mes) {
            whereConditions.push(
                sequelize.where(
                    sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM fecha_creacion')),
                    mes
                )
            );
        }

        // Filtro por división
        if (division && division !== "0") {
            whereConditions.push({
                division: division
            });
        }

        const notas = await VwNotaCredito.findAll({
            where: whereConditions.length > 0 ? { [Op.and]: whereConditions } : {},
            order: [['fecha_creacion', 'DESC']],
            raw: true
        });

        if (!notas || notas.length === 0) {
            return res.status(404).json({
                error: 'No se encontraron notas de crédito'
            });
        }

        return res.json(notas);

    } catch (err) {
        console.error("Error en getNotasCredito:", err);
        return res.status(500).json({
            error: 'Error al obtener las notas de crédito',
            details: err.message
        });
    }
}

async function getDetalleNotaCreditoByNota(req, res) {
    const { id_nota } = req.params;

    try {
        const detalle = await VwNotaCreditoDetalle.findAll({
            where: {
                id_nota
            }
        });

        if(!detalle || detalle.length === 0) {
            return res.status(404).json({ error: "No se encontró el detalle de la nota de crédito" })
        }

        const respuestaAgrupada = {
            Pollo: [],
            Menudo: []
        };

        detalle.forEach(item => {
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
        console.error("Error en getDetalleNotaCreditoByNota", err)
        return res.status(500).json({
            error: "Error al obtener detalle de nota de crédito",
            details: err.message
        });
    }
}

async function changeStatus(req, res) {
    const { id_nota } = req.params;
    const nuevo_estado = 2;

    try {
        const nota = await NotaCreditoModel.findByPk(id_nota);

        if(!nota || nota.length === 0) {
            return res.status(404).json({ error: "No se encontró la nota de crédito a actualizar" });
        }

        await nota.update({ estado: nuevo_estado });
        return res.json({ message: 'Nota de Crédito procesada exitosamente' });
    } catch (err) {
        return res.status(500).json({
            error: "Error al intentar procesar nota de crédito",
            details: err.message
        });
    }
}

module.exports = {
    getNotasCredito,
    getDetalleNotaCreditoByNota,
    changeStatus
}