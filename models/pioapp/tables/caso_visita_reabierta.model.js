const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class CasoVisitaReabiertaModel extends Model {}

CasoVisitaReabiertaModel.init({
    id_reapertura: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    id_caso: { type: DataTypes.UUID, allowNull: false },
    id_visita: { type: DataTypes.INTEGER, allowNull: false },
    motivo_reapertura: { type: DataTypes.TEXT, allowNull: false },
    fecha_reapertura: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    userCreatedAt: { type: DataTypes.BIGINT, allowNull: true },
}, {
    sequelize,
    tableName: 'tbl_caso_visita_reabierta',
    schema: 'web',
    timestamps: false
});

module.exports = CasoVisitaReabiertaModel;