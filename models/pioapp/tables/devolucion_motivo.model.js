const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class DevolucionMotivoModel extends Model {}

DevolucionMotivoModel.init({
    id_devolucion_motivo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    motivo: { type: DataTypes.STRING(250), allowNull: false },
    tipo_reclamo: { type: DataTypes.INTEGER, allowNull: false },
    activo: { type: DataTypes.BOOLEAN, allowNull: false },
    createdAt: { type: DataTypes.DATE, field: 'createdAt' },
    updatedAt: { type: DataTypes.DATE, field: 'updatedAt' }
}, {

    sequelize,
    tableName: 'devolucion_motivo',
    schema: 'app',
    timestamps: true,
})

module.exports = DevolucionMotivoModel;