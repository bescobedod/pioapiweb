const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class DevolucionModel extends Model {}

DevolucionModel.init({
  id_devolucion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  empresa: { type: DataTypes.STRING(100), allowNull: false },
  tienda: { type: DataTypes.STRING(100), allowNull: false },
  idEntradaInventario: { type: DataTypes.BIGINT, allowNull: false, field: 'idEntradaInventario' },
  id_devolucion_estado: { type: DataTypes.INTEGER, allowNull: false },
  url_video_comprobante: { type: DataTypes.TEXT, allowNull: false },
  fotografia_temperatura: { type: DataTypes.TEXT, allowNull: false },
  anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  userCreatedAt: { type: DataTypes.BIGINT, allowNull: true, field: 'userCreatedAt' },
  userUpdatedAt: { type: DataTypes.BIGINT, allowNull: true, field: 'userUpdatedAt' },
  createdAt: { type: DataTypes.DATE, allowNull: true, field: 'createdAt' },
  updatedAt: { type: DataTypes.DATE, allowNull: true, field: 'updatedAt' },
  nombre_tienda: { type: DataTypes.STRING(100), allowNull: true },
  nombre_empresa: { type: DataTypes.STRING(100), allowNull: true },
  detalle: { type: DataTypes.TEXT, allowNull: true },
  tipo_balanza: { type: DataTypes.STRING(50), allowNull: true },
  motivo_rechazo: { type: DataTypes.STRING(500), allowNull: true },
  serieEntradaInventario: { type: DataTypes.STRING(10), allowNull: true, field: 'serieEntradaInventario' },
  division: { type: DataTypes.STRING(100), allowNull: true },
  divisionNombre: { type: DataTypes.STRING(100), allowNull: true, field: 'divisionNombre'}
}, {
  sequelize,
  tableName: 'devolucion',
  schema: 'app',
  timestamps: true
});

module.exports = DevolucionModel;