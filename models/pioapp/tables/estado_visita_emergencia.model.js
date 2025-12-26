const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class EstadoVisitaEmergenciaModel extends Model {}

EstadoVisitaEmergenciaModel.init({
    id_estado: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    nombre: { type: DataTypes.STRING(10), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true }
}, {
    sequelize,
    tableName: 'tbl_estado_visita_emergencia',
    schema: 'web',
    timestamps: false
});

module.exports = EstadoVisitaEmergenciaModel;