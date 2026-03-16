const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class UsuarioPublicacionesVistasModel extends Model {}

UsuarioPublicacionesVistasModel.init({
  id_vista: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  id_publicacion: { type: DataTypes.INTEGER, allowNull: false },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false },
  fecha_leido: { type: DataTypes.DATE, allowNull: false },
  estado: { type: DataTypes.INTEGER, defaultValue: true },
  fecha_entendido: { type: DataTypes.DATE }
}, {
  sequelize,
  tableName: 'usuario_publicaciones_vistas',
  schema: 'app',
  timestamps: true,
});

module.exports = UsuarioPublicacionesVistasModel;