const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class vw_nota_credito_detalle extends Model {}

vw_nota_credito_detalle.init({
    id_fila_unica: { type: DataTypes.STRING, primaryKey: true },
    id_nota: { type: DataTypes.UUID, allowNull: false },
    id_nota_detalle: { type: DataTypes.UUID, allowNull: false },
    nombreProducto: { type: DataTypes.STRING(500), allowNull: false, field: "nombreProducto" },
    cantidad: { type: DataTypes.NUMBER, allowNull: false },
    unidadMedida: { type: DataTypes.STRING(100), allowNull: false, field: "unidadMedida" },
    variante: { type: DataTypes.STRING, allowNull: false },
    motivo: { type: DataTypes.STRING(250), allowNull: false }
}, {
    sequelize: sequelize,
    tableName: 'vw_nota_credito_detalle',
    schema: 'web',
    timestamps: false,
    freezeTableName: true
});

module.exports = vw_nota_credito_detalle;