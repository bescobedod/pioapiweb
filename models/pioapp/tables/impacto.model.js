const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class ImpactoModel extends Model {}

ImpactoModel.init({
    id_impacto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true }
}, {
    sequelize,
    tableName: 'tbl_impacto',
    schema: 'web',
    timestamps: false
});

module.exports = ImpactoModel;