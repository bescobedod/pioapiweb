const VisitaModel = require('../../models/pioapp/tables/visita.model');
const Vw_visita_pioapp = require('../../models/pioapp/views/vw_visita_pioapp.view');
const UserModel = require('../../models/pioapp/tables/users.model');
const TipoVisitaModel = require('../../models/pioapp/tables/tipo_visita.model');
const { sequelizeInit } = require('../../configuration/db');
const { Op } = require('sequelize');
const VisitaEmergenciaModel = require('../../models/pioapp/tables/visita_emergencia.model');
const EstadoVisitaEmergenciaModel = require('../../models/pioapp/tables/estado_visita_emergencia.model');
const Vw_detalle_visita_emergencia = require("../../models/pioapp/views/vw_detalle_visita_emergencia.view");
require('dotenv').config();

VisitaModel.belongsTo(UserModel, { foreignKey: '"userCreatedAt"' })
UserModel.hasMany(VisitaModel, { foreignKey: 'id_users' });
EstadoVisitaEmergenciaModel.hasMany(VisitaEmergenciaModel, { foreignKey: 'id_estado' });
VisitaEmergenciaModel.belongsTo(EstadoVisitaEmergenciaModel, { foreignKey: 'id_estado' })

async function getAllVisitas(req, res) {
    try {
        const visitas = await VisitaModel.findAll({ raw: true });
        return res.json(visitas);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al obtener las visitas', details: err.message });
    }
}

async function getVisitaBySupervisor(req, res){
    const { id_users } = req.params;
    const { startDate, endDate } = req.query;
    try {
        const sequelizePioApp = await sequelizeInit('PIOAPP');
        const vw_visita_pioapp = Vw_visita_pioapp(sequelizePioApp);
        const visitas = await vw_visita_pioapp.findAll({
            attributes: [
                'codigo_usuario_visita',
                'nombre_usuario_visita',
                'nombre_tienda',
                'direccion_tienda',
                'fecha_hora_visita',
                'comentario_visita'
            ],
            where: {
                codigo_usuario_visita: id_users,
                fecha_hora_visita: {
                    [Op.between]: [
                        new Date(`${startDate}T00:00:00`),
                        new Date(`${endDate}T23:59:59`)]
                }

            },
            order: [["fecha_hora_visita", "DESC"]],
            raw: true
        });
        return res.json(visitas);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener visitas',
            details: err.message
        });
    }
}

async function getUltimaVisitaBySupervisor(req, res) {
    const { id_users } = req.params;

    try {
        const sequelizePioApp = await sequelizeInit('PIOAPP');
        const vw_visita_pioapp = Vw_visita_pioapp(sequelizePioApp);
        const visitas = await vw_visita_pioapp.findOne({
            attributes: [
                'codigo_usuario_visita',
                'nombre_usuario_visita',
                'codigo_empresa',
                'codigo_tienda',
                'nombre_tienda',
                'direccion_tienda',
                'fecha_hora_visita',
                'comentario_visita',
                'gps_longitud_visita',
                'gps_latitud_visita'
            ],
            where: {
                codigo_usuario_visita: id_users,
            },
            order: [["fecha_hora_visita", "DESC"]],
            raw: true
        });
        return res.json(visitas);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener visitas',
            details: err.message
        });
    }
}

async function getTiposVisita(req, res) {
    try {
        const tipos = await TipoVisitaModel.findAll({ raw: true });
        return res.json(tipos);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener tipos de visitas',
            details: err.message
        });
    }
}

async function createVisitaEmergencia(req, res) {
    try {
        const {
            empresa,
            tienda,
            tienda_nombre,
            tienda_direccion,
            id_tipo_visita,
            last_gps_longitude,
            last_gps_latitude,
            new_gps_longitude,
            new_gps_latitude,
            comentario,
            fecha_programacion,
            user_asignado,
            nombre_user_asignado,
            id_caso
        } = req.body;
        
        const visitaActual = await VisitaEmergenciaModel.findOne({
            where: {
                user_asignado: req.body.user_asignado,
                id_estado:  {
                    [Op.ne]: 3
                }
            },
            raw: true 
        });

        if(visitaActual){
            return res.json({
                message: 'No se puede asignar visita de emergencia, supervisor ya cuenta con una en curso'
            })
        } else{
            const nuevaVisita = await VisitaEmergenciaModel.create({
                empresa,
                tienda,
                tienda_nombre,
                tienda_direccion,
                id_tipo_visita,
                last_gps_longitude,
                last_gps_latitude,
                new_gps_longitude,
                new_gps_latitude,
                comentario,
                id_estado: 1,
                fecha_programacion,
                user_asignado,
                nombre_user_asignado,
                id_caso
            });
            const notification = await fetch(`https://services.sistemaspinulito.com/pioapi/notificaciones/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${process.env.BASIC_AUTH_USER}:${process.env.BASIC_AUTH_PASS}`)}`,
                },
                body: JSON.stringify({
                    user: Number(user_asignado.substring(2)),
                    body: comentario,
                    title: tienda_nombre,
                    id_asunto_notificacion: 2,
                    data_payload: { idVisitaEmergencia:  nuevaVisita.id_visita}
                })
            })

            const dataNotification = await notification.json();
            console.log(dataNotification)
            if(!notification.ok){
                throw new Error(dataNotification.message);
                
            }
            return res.json({ nuevaVisita });
        }
    } catch (err) {
        return res.status(500).json({
            error: 'Error al asignar visita de emergencia',
            details: err.message
        });
    }
}

async function getVisitasEmergencia(req, res) {
    try {
        const sequelizePioApp = await sequelizeInit('PIOAPP');
        const vw_detalle_visita_emergencia = Vw_detalle_visita_emergencia(sequelizePioApp);
        const visitas = await vw_detalle_visita_emergencia.findAll({ raw: true });

        return res.json(visitas);
    } catch (err) {
        return res.status(500).json({
            error: "Error al obtener visitas de emergencia",
            details: err.message
        });
    }
}

async function getVisitasEmergenciaById(req, res) {
    const { id_visita } = req.params;
    try {
        const visita = await VisitaEmergenciaModel.findOne({
            where: { id_visita: id_visita },
            include: [{
                model: EstadoVisitaEmergenciaModel,
                required: true
            }]
        });
        
        if (!visita) {
            return res.status(404).json({ error: 'Visita no encontrada' });
        }

        return res.json(visita);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener visita de emergencia',
            details: err.message
        });
    }
}

async function getVisitasEmergenciaByCaso(req, res) {
    const { id_caso } = req.params;

    try {
        const sequelizePioApp = await sequelizeInit('PIOAPP');
        const vw_detalle_visita_emergencia = Vw_detalle_visita_emergencia(sequelizePioApp);
        const visita = await vw_detalle_visita_emergencia.findOne({
            where: { id_caso }
        });

        if (!visita) {
            return res.status(404).json({
                message: "No existe visita para este caso"
            });
        }

        return res.json(visita);

    } catch (err) {
        return res.status(500).json({
            error: "Error al obtener visita de emergencia",
            details: err.message
        });
    }
}

module.exports = {
    getAllVisitas,
    getVisitaBySupervisor,
    getUltimaVisitaBySupervisor,
    getTiposVisita,
    createVisitaEmergencia,
    getVisitasEmergencia,
    getVisitasEmergenciaById,
    getVisitasEmergenciaByCaso
};