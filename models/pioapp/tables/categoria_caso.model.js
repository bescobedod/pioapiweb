const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class CategoriaModel extends Model {}

CategoriaModel.init({
    id_categoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    nombre: { type: DataTypes.STRING(100), allowNull: false }
}, {
    sequelize,
    tableName: 'tbl_categoria_caso',
    schema: 'web',
    timestamps: false
});

module.exports = CategoriaModel;