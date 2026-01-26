const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class PermisoModel extends Model {}

PermisoModel.init({
    id_permiso: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_rol: { type: DataTypes.INTEGER, allowNull: false },
    id_menu: { type: DataTypes.INTEGER, allowNull: false }
}, {
    sequelize,
    tableName: 'tbl_permiso',
    schema: 'web',
    timestamps: false
});

module.exports = PermisoModel;