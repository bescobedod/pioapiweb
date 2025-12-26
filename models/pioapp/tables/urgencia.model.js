const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class UrgenciaModel extends Model {}

UrgenciaModel.init({
    id_urgencia: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    nombre: { type: DataTypes.STRING(100), allowNull: false }
}, {
    sequelize,
    tableName: 'tbl_urgencia',
    schema: 'web',
    timestamps: false
});

module.exports = UrgenciaModel;