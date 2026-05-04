const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class DevolucionDetalleModel extends Model {}

DevolucionDetalleModel.init({
  id_devolucion_detalle: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  id_devolucion: { type: DataTypes.INTEGER, allowNull: false },
  ItemCode: { type: DataTypes.STRING(250), allowNull: false },
  nombreProducto: { type: DataTypes.STRING(500), allowNull: false },
  cantidadReal: { type: DataTypes.FLOAT(10,2), allowNull: false },
  cantidadDevolver: { type: DataTypes.FLOAT(10,2), allowNull: false },
  userCreatedAt: { type: DataTypes.BIGINT, allowNull: false },
  userUpdatedAt: { type: DataTypes.BIGINT, allowNull: false },
  unidadMedida: { type: DataTypes.STRING(100), allowNull: true },
  id_devolucion_motivo: { type: DataTypes.INTEGER, allowNull: true },
  unidadMedidaDevolucion: { type: DataTypes.STRING(100), allowNull: true },
  cantidadAceptada: { type: DataTypes.INTEGER, allowNull: true, field: 'cantidadAceptada' },
  nota_reclamo: { type: DataTypes.STRING(255), allowNull: true },
  cantidad_pedida: { type: DataTypes.FLOAT(10,2), allowNull: true},
  accion_tipo: { type: DataTypes.STRING(20), allowNull: true },
  createdAt: { type: DataTypes.DATE, field: 'createdAt' },
  updatedAt: { type: DataTypes.DATE, field: 'updatedAt' }
}, {
  sequelize,
  tableName: 'devolucion_detalle',
  schema: 'app',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = DevolucionDetalleModel;