const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/pioapp/tables/users.model');
require('dotenv').config();

const SECRET = process.env.DB_SECRET_KEY;

//Servicio para inicio de sesión y autenticación por token
async function login(req, res) {
    const { cod_empleado, password } = req.body;

    try {
        if (!cod_empleado || !password) {
            return res.status(400).json({ error: "Código y contraseña requeridos" });
        }

        const userResult = await UserModel.findOne({
            where: {
                codigo_user: cod_empleado
            }
        });

        if (!userResult) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userResult.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        const payload = {
            id_user: userResult.id_users,
            nombre: `${userResult.first_name} ${userResult.first_last_name}`,
            puesto: userResult.puesto_trabajo,
            rol: userResult.id_rol,
            email: userResult.email,
            division: userResult.division
        };
        const token = jwt.sign(payload, SECRET, { expiresIn: "24h" });

        return res.json({
            details: "Login exitoso",
            token,
            user: payload
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({
            error: "Error al iniciar sesión",
            details: err.message
        });
    }
}

module.exports = login;