const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class vw_usuario_publicacion extends Model {}

vw_usuario_publicacion.init({
    id_vista: { type: DataTypes.INTEGER, primaryKey: true },
    id_publicacion: { type: DataTypes.INTEGER },
    id_usuario: { type: DataTypes.INTEGER },
    usuario: { type: DataTypes.STRING },
    fecha_leido: { type: DataTypes.DATE, },
    fecha_entendido: { type: DataTypes.DATE },
    estado: { type: DataTypes.INTEGER },
    rol: { type: DataTypes.STRING(250) }
}, {
    sequelize: sequelize,
    tableName: 'vw_usuario_publicacion',
    schema: 'app',
    timestamps: false,
    freezeTableName: true
});

module.exports = vw_usuario_publicacion;