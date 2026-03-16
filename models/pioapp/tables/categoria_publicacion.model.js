const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class CategoriaPublicacionModel extends Model {}

CategoriaPublicacionModel.init({
  id_categoria_publicacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  color: { type: DataTypes.STRING(20), allowNull: false },
  estado: { type: DataTypes.BOOLEAN, allowNull: false },
  user_created: { type: DataTypes.INTEGER, allowNull: true },
  user_updated: { type: DataTypes.INTEGER, allowNull: true }
}, {
  sequelize,
  tableName: 'tbl_categoria_publicacion',
  schema: 'web',
  timestamps: true
});

module.exports = CategoriaPublicacionModel;