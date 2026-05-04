const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class vw_devolucion_detalle_pioapp extends Model {}

vw_devolucion_detalle_pioapp.init({
    id_fila_unica: { type: DataTypes.TEXT, allowNul: false, primaryKey: true },
    id_devolucion: { type: DataTypes.INTEGER },
    id_devolucion_detalle: { type: DataTypes.INTEGER },
    nombreProducto: { type: DataTypes.STRING(500) },
    cantidadReal: { type: DataTypes.INTEGER },
    unidadMedida: { type: DataTypes.STRING(100) },
    cantidadDevolver: { type: DataTypes.INTEGER },
    cantidad_pedida: { type: DataTypes.INTEGER },
    variante: { type: DataTypes.STRING },
    cantidadAceptada: { type: DataTypes.INTEGER },
    motivo: { type: DataTypes.STRING }
}, {
    sequelize: sequelize,
    tableName: 'vw_devolucion_detalle_pioapp',
    schema: 'app',
    timestamps: false,
    freezeTableName: true
});

module.exports = vw_devolucion_detalle_pioapp;