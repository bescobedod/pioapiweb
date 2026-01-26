const UserModel = require('../../models/pioapp/tables/users.model');
const PermisoEstadoModel = require('../../models/pioapp/tables/permiso_estado.model');
const InitVw_users = require('../../models/pioapp/views/vw_users.view');
const initVw_visita_pioapp = require('../../models/pioapp/views/vw_visita_pioapp.view');
const { sequelize } = require('../../configuration/db');
const Vw_visita_pioapp = initVw_visita_pioapp(sequelize);
const vw_supervisores = InitVw_users(sequelize);
const { Op } = require('sequelize');
const { error } = require('console');
const initVw_detalle_permisos = require('../../models/pioapp/views/vw_detalle_permisos.view');
const { sequelizeInit } = require('../../configuration/db');
const moment = require('moment-timezone');

//Relación de uno a muchos entre vista de supervisores y vista de visitas
vw_supervisores.hasMany(Vw_visita_pioapp, {
    foreignKey: 'codigo_usuario_visita',
    sourceKey: 'codsupervisor'
});
//Relación de uno a muchos entre vista de supervisores y vista de visitas
Vw_visita_pioapp.belongsTo(vw_supervisores, {
    foreignKey: 'codigo_usuario_visita',
    targetKey: 'codsupervisor'
});

//Obtener todos los usuarios que tienen acceso a PioApp
async function getAllUsers(req, res) {
    try {
        const users = await UserModel.findAll({ raw: true });
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ error: 'Error al obtener los usuarios', details: err.message });
    }
}

//Obtener todos los supervisores
async function getAllSupervisors(req, res) {
    try {
        const users = await vw_supervisores.findAll({
            order: [
                ['nomsupervisor', 'ASC']
            ],
            raw: true
        });

        return res.json(users);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener los supervisores',
            details: err.message
        });
    }
}

//Obtener usuarios por rol
async function getUsersByRole(req, res) {
    const { role } = req.params;

    try {
        const users = await UserModel.findAll({
            where: {
                id_rol: role,
                id_users: {
                    [Op.ne]: req.user.id_user
                }
            },
            raw: true
        });

        return res.json(users);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener los usuarios por rol',
            details: err.message
        });
    }
}

async function updateUser(req, res) {
    const { email } = req.body;

    try {
        const user = await UserModel.findByPk(req.user.id_user);
        
        if(user) {
            await user.update({
                email
            })

            return res.json({
                message: 'Datos de usuario actualizados',
                user
            })
        } else {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            })
        }
    } catch (err) {
        return res.status(500).json({
            error: 'Error al intentar actualizar datos del usuario',
            details: err.message
        })
    }
}

async function createPermisoCaso(req, res) {
    const { id_user } = req.params;

    try {
        const usuarioExistente = await PermisoEstadoModel.findOne({
            where: {
                id_user: id_user,
                puede_modificar: true
            }
        });

        if(usuarioExistente) {
            return res.status(400).json({
                message: 'El usuario ya tiene permiso para modificar casos'
            });
        } else {
            const permiso = await PermisoEstadoModel.create({
                id_user: id_user,
                puede_modificar: true,
                userCreatedAt: req.user.id_user
            });

            return res.json({
                message: 'Permiso de caso creado',
                permiso
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: 'Error al intentar crear permiso de casos para el usuario',
            details: err.message
        });
    }
}

async function quitPermisoCaso(req, res) {
    const { id_user } = req.params;

    try {
        const permiso = await PermisoEstadoModel.findOne({
            where: {
                id_user: id_user,
                puede_modificar: true
            }
        });

        if(permiso) {
            await permiso.update({
                puede_modificar: false,
                userUpdatedAt: req.user.id_user
            });

            return res.json({
                message: 'Permiso de caso quitado',
                permiso
            });
        } else {
            return res.status(404).json({
                message: 'El usuario no tiene permiso para modificar casos'
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: 'Error al intentar quitar permiso de casos para el usuario',
            details: err.message
        });
    }
}

async function getUsersPermisosEstados(req, res) {
    try {
        const sequelizePioApp = await sequelizeInit('PIOAPP');
        const vw_detalle_permisos = initVw_detalle_permisos(sequelizePioApp);
        const permisos = await vw_detalle_permisos.findAll({
            where: {
                id_user: {
                    [Op.ne]: req.user.id_user
                }
            },
            order: [["fecha", "DESC"]],
            raw: true
        });

        const permisosFormateados = permisos.map(p => ({
            ...p,
            fecha: moment(p.fecha)
                .tz('America/Guatemala')
                .format('YYYY-MM-DD HH:mm:ss')
        }));

        return res.json(permisosFormateados);
    } catch (err) {
        return res.status(500).json({
            error: 'Error al obtener los usuarios con permisos para casos',
            details: err.message
        });
    }
}

module.exports = {
    getAllUsers,
    getAllSupervisors,
    getUsersByRole,
    updateUser,
    createPermisoCaso,
    quitPermisoCaso,
    getUsersPermisosEstados
}