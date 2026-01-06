const TipoSolicitudModel = require('../../models/pioapp/tables/tipo_solicitud.model')
const ImpactoModel = require('../../models/pioapp/tables/impacto.model');
const UrgenciaModel = require('../../models/pioapp/tables/urgencia.model');
const CategoriaModel = require('../../models/pioapp/tables/categoria_caso.model');
const SubcategoriaModel = require('../../models/pioapp/tables/subcategoria_caso.model');
const CasoModel = require('../../models/pioapp/tables/caso.model');
const Vw_detalle_caso = require('../../models/pioapp/views/vw_detalle_caso.view');
const {sequelizeInit} = require('../../configuration/db');
const VisitaEmergenciaModel = require('../../models/pioapp/tables/visita_emergencia.model');
const CasoVisitaReabiertaModel = require('../../models/pioapp/tables/caso_visita_reabierta.model');

//Obtener todos los tipos de solicitudes para los casos
async function getAllTiposSolicitudes(req, res) {
    try {
        const tipos_solicitud = await TipoSolicitudModel.findAll({ raw: true });
        return res.json(tipos_solicitud);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Error al obtener los tipos de solicitud',
            details: err.message
        });
    }
}

//Obtener todos los impactos que tienen los casos
async function getAllImpactos(req, res) {
    try {
        const impactos = await ImpactoModel.findAll({ raw: true });
        return res.json(impactos);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Error al obtener los impactos',
            details: err.message
        });
    }
}

//Obtener todas las urgencias que pueden tener los casos
async function getAllUrgencias(req, res) {
    try {
        const urgencias = await UrgenciaModel.findAll({ raw: true });
        return res.json(urgencias);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Error al obtener los impactos',
            details: err.message
        });
    }
}

//Obtener todas las categorías en las que se puede colocar un caso
async function getAllCategorias(req, res) {
    try {
        const categorias = await CategoriaModel.findAll({ raw: true });
        return res.json(categorias);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Error al obtener caregorías',
            details: err.message
        })
    }
}

//Obtener todas las subcategorias según la categoría especificada en el parámetro
async function getSubcategoriaByCategoria(req, res) {
    const { id_categoria } = req.params;

    try {
        const subcategorias = await SubcategoriaModel.findAll({
            where: {
                id_categoria: id_categoria
            },
            raw: true
        });
        return res.json(subcategorias);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Error al obtener subcaregorías',
            details: err.message
        })
    }
}

//Crear el caso para iniciar una tarea
async function createCaso(req, res) {
    const {
            id_tienda,
            tienda_nombre,
            id_empresa,
            division,
            id_tipo_solicitud,
            id_estado,
            id_impacto,
            id_urgencia,
            id_categoria,
            id_subcategoria,
            mensaje
        } = req.body;

    try {        
        //Validar que no existe un caso ya creado con los mismos parámetros para evitar duplicidad
        const casoDuplicado = await CasoModel.findOne({
            where: {
                id_tienda: req.body.id_tienda,
                tienda_nombre: req.body.tienda_nombre,
                id_empresa: req.body.id_empresa,
                division: req.body.division,
                id_tipo_solicitud: req.body.id_tipo_solicitud,
                id_estado: req.body.id_estado,
                id_impacto: req.body.id_impacto,
                id_urgencia: req.body.id_urgencia,
                id_categoria: req.body.id_categoria,
                id_subcategoria: req.body.id_subcategoria
            },
            raw: true 
        });

        if(casoDuplicado){
            return res.json({
                message: 'No se puede crear el caso, ya se ha creado uno con la misma información'
            })
        } else{
            const nuevoCaso = await CasoModel.create({
                id_tienda,
                tienda_nombre,
                id_empresa,
                division,
                id_tipo_solicitud,
                id_estado,
                id_impacto,
                id_urgencia,
                id_categoria,
                id_subcategoria,
                mensaje
            });
            return res.json({ nuevoCaso });
        }
    } catch (err) {
        return res.status(500).json({
            error: 'Error al crear un nuevo caso',
            details: err.message
        });
    }
}

//Obtener todos los casos según la división de las tiendas
async function getCasosByDivision(req, res) {
    const { division } = req.params;
    try {
        const sequelizePioApp = await sequelizeInit('PIOAPP');
        const vw_detalle_caso = Vw_detalle_caso(sequelizePioApp);
        const casos = await vw_detalle_caso.findAll({
            where: {
                division: division
            },
            order: [
                ['estado', 'ASC'],
                ['correlativo', 'DESC']
            ],
            raw: true
        });

        return res.json(casos);
    } catch (err) {
        return res.status(500).json({
            error: "Error al obtener casos",
            details: err.message
        });
    }
}

//Obtener un caso según su id (uuid)
async function getCasoById(req, res) {
    const { id_caso } = req.params;

    try {
        const caso = await CasoModel.findByPk(id_caso);
        return res.json(caso)
    } catch (err) {
        return res.status(500).json({
            error: "Error al obtener caso",
            details: err.message
        });
    }
}

//Actualización de datos para un caso según su id (uuid)
async function updateCaso(req, res) {
    const { id_caso } = req.params;

    const {
        id_tienda,
        tienda_nombre,
        id_empresa,
        division,
        id_tipo_solicitud,
        id_impacto,
        id_urgencia,
        id_categoria,
        id_subcategoria,
        mensaje,
        id_estado
    } = req.body;

    try {
        const caso = await CasoModel.findByPk(id_caso);

        if (!caso) {
            return res.status(404).json({
                error: 'Caso no encontrado'
            });
        }

        await caso.update({
            id_tienda,
            tienda_nombre,
            id_empresa,
            division,
            id_tipo_solicitud,
            id_impacto,
            id_urgencia,
            id_categoria,
            id_subcategoria,
            mensaje,
            ...(id_estado && { id_estado })
        });

        return res.json({
            message: 'Caso actualizado correctamente',
            caso
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Error al actualizar el caso',
            details: err.message
        });
    }
}

async function cierreReaperturaCaso(req, res) {
    const { id_c, id_e } = req.params;
    const { motivo } = req.body;

    const estado = Number(id_e);
    const sequelizePioApp = await sequelizeInit('PIOAPP');
    const transaction = await sequelizePioApp.transaction();

    try {
        const caso = await CasoModel.findByPk(id_c, { transaction });

        if (!caso) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Caso no encontrado' });
        }

        // CIERRE DE CASO
        if (estado === 4) {
            await caso.update({ id_estado: 4 }, { transaction });
            await caso.reload({ transaction });

            await transaction.commit();

            return res.json({
              message: 'Caso cerrado correctamente',
              caso
            });
        }

        // REAPERTURA
        if (estado === 2) {
          await caso.update({ id_estado: 2 }, { transaction });

            const visitaEmergencia = await VisitaEmergenciaModel.findOne({
              where: { id_caso: id_c },
              transaction
            });

            if (!visitaEmergencia) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Visita no encontrada' });
            }

            await visitaEmergencia.update({ id_estado: 1 }, { transaction });
            const casoVisita = await CasoVisitaReabiertaModel.create({
              id_caso: id_c,
              id_visita: visitaEmergencia.id_visita,
              motivo_reapertura: motivo
            }, { transaction });

            await transaction.commit();

            try {
              await fetch(`https://services.sistemaspinulito.com/pioapi/notificaciones/send`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Basic ${Buffer.from(
                    `${process.env.BASIC_AUTH_USER}:${process.env.BASIC_AUTH_PASS}`
                  ).toString('base64')}`
                },
                body: JSON.stringify({
                  user: Number(visitaEmergencia.user_asignado.substring(2)),
                  body: visitaEmergencia.comentario,
                  title: `Visita reabierta: ${visitaEmergencia.tienda_nombre}`,
                  id_asunto_notificacion: 2,
                  data_payload: { idVisitaEmergencia: visitaEmergencia.id_visita }
                })
              });
            } catch (err) {
              console.warn('Notificación falló:', err.message);
            }

            return res.json({
              message: 'Caso reabierto correctamente',
              caso,
              casoVisita
            });
        }

    } catch (err) {
        await transaction.rollback();
        console.error(err);
        return res.status(500).json({
          error: 'Error al actualizar el caso',
          details: err.message
        });
    }
}

module.exports = {
    getAllTiposSolicitudes,
    getAllImpactos,
    getAllUrgencias,
    getAllCategorias,
    getSubcategoriaByCategoria,
    createCaso,
    getCasosByDivision,
    getCasoById,
    updateCaso,
    cierreReaperturaCaso
}