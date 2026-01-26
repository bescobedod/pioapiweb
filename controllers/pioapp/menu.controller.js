const MenuModel = require('../../models/pioapp/tables/menu.model');
const PermisoModel = require('../../models/pioapp/tables/permiso.model');
const InitVw_users = require('../../models/pioapp/views/vw_users.view');
const initVw_visita_pioapp = require('../../models/pioapp/views/vw_visita_pioapp.view');
const { sequelize } = require('../../configuration/db');
const Vw_visita_pioapp = initVw_visita_pioapp(sequelize);
const vw_supervisores = InitVw_users(sequelize);

//Obtener todos los usuarios que tienen acceso a PioApp
async function getMenuByRol(req, res) {
    try {
        const permisos = await PermisoModel.findAll({
            where: { id_rol: req.user.rol },
        });

        const menus = await MenuModel.findAll({
            where: {
                id_menu: permisos.map(permiso => permiso.id_menu)
            }
        });
        return res.json(menus);
    } catch (err) {
        return res.status(500).json({ error: 'Error al obtener los menús', details: err.message });
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

module.exports = {
    getMenuByRol,
    getAllSupervisors,
    updateUser
}