const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class NotaCreditoDetallePiezaModel extends Model {}

NotaCreditoDetallePiezaModel.init({
  id_nota_detalle_pieza: { 
    type: DataTypes.UUID, 
    primaryKey: true, 
    defaultValue: sequelize.literal('gen_random_uuid()') 
  },
  id_nota_detalle: { type: DataTypes.UUID, allowNull: false },
  id_pieza: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  userCreatedAt: { type: DataTypes.INTEGER, allowNull: false },
  userUpdatedAt: { type: DataTypes.INTEGER, allowNull: false }
}, {
  sequelize,
  tableName: 'tbl_nota_credito_detalle_piezas',
  schema: 'web',
  timestamps: true
});

module.exports = NotaCreditoDetallePiezaModel;