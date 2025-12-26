const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class SubcategoriaModel extends Model {}

SubcategoriaModel.init({
    id_subcategoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    id_categoria: { type: DataTypes.INTEGER, allowNull: false }
}, {
    sequelize,
    tableName: 'tbl_subcategoria_caso',
    schema: 'web',
    timestamps: false
});

module.exports = SubcategoriaModel;