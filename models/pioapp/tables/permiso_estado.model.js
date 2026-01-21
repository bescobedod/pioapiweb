
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class PermisosEstadoModel extends Model {}

PermisosEstadoModel.init({
    id_permiso: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
    id_user: { type: DataTypes.BIGINT, allowNull: true, unique: true },
    puede_modificar: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    userCreatedAt: { type: DataTypes.BIGINT, allowNull: true },
    userUpdatedAt: { type: DataTypes.BIGINT, allowNull: true }
}, {
    sequelize,
    tableName: 'tbl_permisos_estado',
    schema: 'web',
    timestamps: true
});

module.exports = PermisosEstadoModel;
