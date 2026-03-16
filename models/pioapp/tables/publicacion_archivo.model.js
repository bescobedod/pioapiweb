const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class PublicacionArchivoModel extends Model {}

PublicacionArchivoModel.init({
  id_archivo_pub: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  id_publicacion: { type: DataTypes.INTEGER, allowNull: false },
  s3_bucket: { type: DataTypes.TEXT, allowNull: false },
  s3_key: { type: DataTypes.TEXT, allowNull: false },
  nombre_archivo: { type: DataTypes.STRING(255), allowNull: true },
  tipo: { type: DataTypes.STRING(50), allowNull: true },
  bytes: { type: DataTypes.BIGINT, allowNull: true },
  userCreatedAt: { type: DataTypes.INTEGER, field: 'userCreatedAt', allowNull: true },
  url_archivo: { type: DataTypes.TEXT, allowNull: true }
}, {
  sequelize,
  tableName: 'tbl_publicacion_archivo',
  schema: 'web',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

module.exports = PublicacionArchivoModel;