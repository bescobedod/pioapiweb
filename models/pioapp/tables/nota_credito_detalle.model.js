const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class NotaCreditoDetalleModel extends Model {}

NotaCreditoDetalleModel.init({
  id_nota_detalle: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: sequelize.literal('gen_random_uuid()') },
  id_nota: { type: DataTypes.UUID, allowNull: false },
  ItemCode: { type: DataTypes.STRING(250), allowNull: false, field: 'ItemCode' },
  nombreProducto: { type: DataTypes.STRING(500), allowNull: false, field: 'nombreProducto' },
  cantidadDevolver: { type: DataTypes.NUMERIC(10, 2), allowNull: false, field: 'cantidadDevolver' },
  unidadMedida: { type: DataTypes.STRING(100), allowNull: false, field: 'unidadMedida' },
  id_devolucion_motivo: { type: DataTypes.INTEGER, allowNull: false },
  userCreatedAt: { type: DataTypes.INTEGER, allowNull: false, field: 'userCreatedAt' },
  userUpdatedAt: { type: DataTypes.INTEGER, allowNull: false, field: 'userUpdatedAt' },
  createdAt: { type: DataTypes.DATE, allowNull: true, field: 'createdAt' },
  updatedAt: { type: DataTypes.DATE, allowNull: true, field: 'updatedAt' }
}, {
  sequelize,
  tableName: 'tbl_nota_credito_detalle',
  schema: 'web',
  timestamps: true
});

module.exports = NotaCreditoDetalleModel;