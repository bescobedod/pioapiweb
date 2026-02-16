const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class CasoArchivoModel extends Model {}

CasoArchivoModel.init({
  id_archivo: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  id_caso: { type: DataTypes.UUID, allowNull: false },
  s3_bucket: { type: DataTypes.TEXT, allowNull: false },
  s3_key: { type: DataTypes.TEXT, allowNull: false },
  nombre_original: { type: DataTypes.TEXT, allowNull: true },
  mime_type: { type: DataTypes.TEXT, allowNull: true },
  bytes: { type: DataTypes.BIGINT, allowNull: true },
  userCreatedAt: { type: DataTypes.BIGINT, allowNull: true }
}, {
  sequelize,
  tableName: 'tbl_caso_archivo',
  schema: 'web',
  timestamps: true
});

module.exports = CasoArchivoModel;