const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class PublicacionModel extends Model {}

PublicacionModel.init({
  id_publicacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  id_categoria_publicacion: { type: DataTypes.INTEGER, allowNull: false },
  titulo: { type: DataTypes.STRING(150), allowNull: false },
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  estado: { type: DataTypes.BOOLEAN, defaultValue: true },
  user_created: { type: DataTypes.INTEGER, allowNull: true },
  user_updated: { type: DataTypes.INTEGER, allowNull: true },
  createdAt: { type: DataTypes.DATE, field: 'createdAt', defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, field: 'updatedAt', defaultValue: DataTypes.NOW },
  id_roles: { type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: [] }
}, {
  sequelize,
  tableName: 'tbl_publicacion',
  schema: 'web',
  timestamps: true,
});

module.exports = PublicacionModel;