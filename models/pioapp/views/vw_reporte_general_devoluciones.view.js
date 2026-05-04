const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class VwReporteGeneralDevoluciones extends Model {}

VwReporteGeneralDevoluciones.init({
    id_devolucion_detalle: { type: DataTypes.INTEGER, primaryKey: true },
    fecha_completa: { type: DataTypes.DATE },
    fecha_dia: { type: DataTypes.DATEONLY },
    dia_mes: { type: DataTypes.INTEGER },
    mes_numero: { type: DataTypes.INTEGER },
    anio: { type: DataTypes.INTEGER },
    id_devolucion: { type: DataTypes.INTEGER },
    division: { type: DataTypes.STRING },
    responsable_division: { type: DataTypes.STRING },
    nombre_empresa: { type: DataTypes.STRING },
    codigo_tienda: { type: DataTypes.STRING },
    nombre_tienda: { type: DataTypes.STRING },
    motivo_reclamo: { type: DataTypes.STRING },
    nombreProducto: { type: DataTypes.STRING },
    ItemCode: { type: DataTypes.STRING },
    nombre_pieza: { type: DataTypes.STRING, allowNull: true },
    cantidad_piezas: { type: DataTypes.INTEGER },
    estado_actual: { type: DataTypes.STRING },
    usuario_registra: { type: DataTypes.STRING }
}, {
    sequelize: sequelize,
    tableName: 'vw_reporte_general_devoluciones',
    schema: 'app',
    timestamps: false,
    freezeTableName: true
});

module.exports = VwReporteGeneralDevoluciones;