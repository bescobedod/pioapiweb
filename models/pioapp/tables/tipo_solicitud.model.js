const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class TipoSolicitudModel extends Model {}

TipoSolicitudModel.init({
    id_tipo_solicitud: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    nombre: { type: DataTypes.STRING(100), allowNull: false }
}, {
    sequelize,
    tableName: 'tbl_tipo_solicitud',
    schema: 'web',
    timestamps: false
});

module.exports = TipoSolicitudModel;