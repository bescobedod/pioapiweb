const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class DevolucionEstadoModel extends Model {}

DevolucionEstadoModel.init({
  id_devolucion_estado: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  userCreatedAt: { type: DataTypes.BIGINT, allowNull: false },
  userUpdatedAt: { type: DataTypes.BIGINT, allowNull: false }
}, {
  sequelize,
  tableName: 'devolucion_estado',
  schema: 'app',
  timestamps: true,
});

module.exports = DevolucionEstadoModel;