const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class DevolucionDetallePiezasModel extends Model {}

DevolucionDetallePiezasModel.init({
  id_devolucion_detalle_pieza: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  id_devolucion_detalle: { type: DataTypes.INTEGER, allowNull: false },
  id_pieza: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  cantidadAceptada: { type: DataTypes.INTEGER, allowNull: true, field: 'cantidadAceptada' }
}, {
  sequelize,
  tableName: 'devolucion_detalle_piezas',
  schema: 'app',
  timestamps: false,
});

module.exports = DevolucionDetallePiezasModel;