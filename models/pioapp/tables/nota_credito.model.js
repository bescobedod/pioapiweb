const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class NotaCreditoModel extends Model {}

NotaCreditoModel.init({
  id_nota: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: sequelize.literal('gen_random_uuid()') },
  id_tienda: { type: DataTypes.STRING(10), allowNull: false },
  tienda_nombre: { type: DataTypes.STRING(500), allowNull: false },
  id_empresa: { type: DataTypes.STRING(10), allowNull: false },
  empresa_nombre: { type: DataTypes.STRING(500), allowNull: false },
  division: { type: DataTypes.INTEGER, allowNull: false },
  estado: { type: DataTypes.INTEGER, allowNull: false },
  id_devolucion: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  idEntradaInventario: { type: DataTypes.BIGINT, allowNull: true, field: 'idEntradaInventario' },
  serieEntradaInventario: { type: DataTypes.STRING(10), allowNull: true, field: 'serieEntradaInventario' },
  userCreatedAt: { type: DataTypes.INTEGER, allowNull: false, field: 'userCreatedAt' },
  userUpdatedAt: { type: DataTypes.INTEGER, allowNull: false, field: 'userUpdatedAt' },
  createdAt: { type: DataTypes.DATE, allowNull: true, field: 'createdAt' },
  updatedAt: { type: DataTypes.DATE, allowNull: true, field: 'updatedAt' }
}, {
  sequelize,
  tableName: 'tbl_nota_credito',
  schema: 'web',
  timestamps: true
});

module.exports = NotaCreditoModel;