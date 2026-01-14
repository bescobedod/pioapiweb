const VisitaModel = require('../../models/pioapp/tables/visita.model');
const Vw_visita_pioapp = require('../../models/pioapp/views/vw_visita_pioapp.view');
const UserModel = require('../../models/pioapp/tables/users.model');
const TipoVisitaModel = require('../../models/pioapp/tables/tipo_visita.model');
const { sequelizeInit } = require('../../configuration/db');
const { Op } = require('sequelize');
const VisitaEmergenciaModel = require('../../models/pioapp/tables/visita_emergencia.model');
const EstadoVisitaEmergenciaModel = require('../../models/pioapp/tables/estado_visita_emergencia.model');
const Vw_detalle_visita_emergencia = require("../../models/pioapp/views/vw_detalle_visita_emergencia.view");
const CasoVisitaReabiertaModel = require('../../models/pioapp/tables/caso_visita_reabierta.model');
const CasoModel = require('../../models/pioapp/tables/caso.model');
const moment = require('moment-timezone');
require('dotenv').config();

//Relación entre tablas de visitas, usuarios, estados de visitas y visitas de emergencia
VisitaModel.belongsTo(UserModel, { foreignKey: '"userCreatedAt"' })
//UserModel.hasMany(VisitaModel, { foreignKey: 'id_users' });
//EstadoVisitaEmergenciaModel.hasMany(VisitaEmergenciaModel, { foreignKey: 'id_estado' });
VisitaEmergenciaModel.belongsTo(EstadoVisitaEmergenciaModel, { foreignKey: 'id_estado' })

//Obtener todas las visitas
async function getAllVisitas(req, res) {
    try {
        const visitas = await VisitaModel.findAll({ raw: true });
        return res.json(visitas);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al obtener las visitas', details: err.message });
    }
}

//Obtener todas las visitas de un supervisor
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
                        `${startDate}T00:00:00`,
                        `${endDate}T23:59:59`]
                }

            },
            order: [["fecha_hora_visita", "DESC"]],
            raw: true
        });

        const visitasFormateadas = visitas.map(v => ({
            ...v,
            fecha_hora_visita: moment(v.fecha_hora_visita)
                .tz('America/Guatemala')
                .format('YYYY-MM-DD HH:mm:ss')
        }));

        return res.json(visitasFormateadas);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener visitas',
            details: err.message
        });
    }
}

//Obtener la ultima visita realizada por un supervisor
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

//Obtener todos los tipos de visita disponibles
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

//Crear una visita de emergencia (tarea)
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
            id_caso,
            division
        } = req.body;
        
        //Buscar si el usuario ya tiene una visita de emergencia en curso, si tiene no puede crearse una nueva
        const visitaActual = await VisitaEmergenciaModel.findOne({
            where: {
                user_asignado: req.body.user_asignado,
                id_estado:  {
                    [Op.ne]: 3
                }
            },
            raw: true 
        });
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
                id_caso,
                division,
                userCreatedAt: req.user.id_user
            });

            const caso = await CasoModel.findByPk(id_caso);

            const usersEmail = await UserModel.findAll({
                where: {
                    [Op.or]: [
                        { id_users: req.user.id_user },
                        { division: division },
                        { id_users: caso.userCreatedAt}
                    ]
                },
                attributes: ['email'],
                raw: true
            });

            const emailsList = usersEmail.map(u => u.email).filter(Boolean).join(", ");

            const htmlBody = `
                <h1>SE HA ASIGNADO LA VISITA ${nuevaVisita.id_visita} PARA LA TIENDA: ${tienda_nombre}</h1>
                <p>${comentario}</p>
                <p style='color: red;'>Puedes ver el estado del la visita en: https://pioapp.pinulitogt.com/</p>`;

            const basicAuth = Buffer
                .from(`${process.env.BASIC_NOTI_AUTH_USER}:${process.env.BASIC_NOTI_AUTH_PASS}`)
                .toString('base64');

            const email = await fetch(`https://services.sistemaspinulito.com/notificaciones/mail/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${basicAuth}`,
                },
                body: JSON.stringify({
                    emisor: 'PIOAPP',
                    email_receptor: emailsList,
                    asunto: `AVISO VISITA ASIGNADA: ${tienda_nombre}`,
                    data_context: {
                        body: htmlBody
                    }
                })
            });

            const emailNotification = await email.json();
            
            if(!email.ok){
                throw new Error(emailNotification.message);    
            }

            //Envío de notificaciones al supervisor asignado
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
            if(!notification.ok){
                throw new Error(dataNotification.message);
                
            }
            return res.json({ nuevaVisita });
    } catch (err) {
        return res.status(500).json({
            error: 'Error al asignar visita de emergencia',
            details: err.message
        });
    }
}

//Obtener todas las visitas de emergencia
async function getVisitasEmergencia(req, res) {
    const { division } = req.params;

    try {
        const sequelizePioApp = await sequelizeInit('PIOAPP');
        const vw_detalle_visita_emergencia = Vw_detalle_visita_emergencia(sequelizePioApp);
        const visitas = await vw_detalle_visita_emergencia.findAll({
            where: {
                division: division
            },
            raw: true
        });

        return res.json(visitas);
    } catch (err) {
        return res.status(500).json({
            error: "Error al obtener visitas de emergencia",
            details: err.message
        });
    }
}

//Obtener detalle de una visita de emergencia
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

//Obtener visita de emergencia creada según un caso
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

async function getVisitaByVisitaEmergencia(req, res) {
    const { id_ve } = req.params;

    try {
        const visita = await VisitaModel.findOne({
            where: {
                id_visita_emergencia: id_ve
            },
            order: [['createdAt', 'DESC']]
        });
        return res.json(visita);
    } catch (err) {
        return res.status(500).json({
            error: "Error al obtener visita",
            details: err.message
        })
    }
}

async function getVisitasReabiertas(req, res) {
    const { id_v, id_c } = req.params;

    try {
        const visitas = await CasoVisitaReabiertaModel.findAll({
            where: {
                id_visita: id_v,
                id_caso: id_c
            },
            order: [["fecha_reapertura", "DESC"]]
        });

        return res.json(visitas); 
    } catch (err) {
        return res.status(500).json({
            error: "Error al obtener visitas reabiertas",
            details: err.message
        })
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
    getVisitasEmergenciaByCaso,
    getVisitaByVisitaEmergencia,
    getVisitasReabiertas
};