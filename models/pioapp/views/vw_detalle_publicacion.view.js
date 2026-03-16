const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class vw_detalle_publicacion extends Model {}

vw_detalle_publicacion.init({
    id_categoria_publicacion: { type: DataTypes.INTEGER, allowNull: false },
    id_publicacion: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    color: { type: DataTypes.STRING(20), allowNull: false },
    categoria_nombre: { type: DataTypes.STRING(100), allowNull: false },
    titulo: { type: DataTypes.STRING(150), allowNull: false },
    mensaje: { type: DataTypes.TEXT, allowNull: false },
    publicacion_estado: { type: DataTypes.BOOLEAN, allowNull: false },
    categoria_estado: { type: DataTypes.BOOLEAN, allowNull: false },
    id_roles: { type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: [] },
    roles: { type: DataTypes.STRING },
    creado_por: { type: DataTypes.STRING }
}, {
    sequelize: sequelize,
    tableName: 'vw_detalle_publicacion',
    schema: 'web',
    timestamps: true,
}
);

module.exports = vw_detalle_publicacion;