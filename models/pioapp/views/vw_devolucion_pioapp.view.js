const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class vw_devolucion_pioapp extends Model {}

vw_devolucion_pioapp.init({
    id_devolucion: { type: DataTypes.INTEGER, primaryKey: true },
    nombre_empresa: { type: DataTypes.STRING },
    nombre_tienda: { type: DataTypes.STRING },
    fecha_creacion: { type: DataTypes.DATE,field: 'fecha_creacion' },
    idEntradaInventario: { type: DataTypes.INTEGER,field: 'idEntradaInventario' },
    id_devolucion_estado: { type: DataTypes.INTEGER },
    estado: { type: DataTypes.STRING(100) },
    anulado: { type: DataTypes.BOOLEAN },
    usuario: { type: DataTypes.STRING },
    cantidad_devolucion: { type: DataTypes.BIGINT },
    detalle: { type: DataTypes.TEXT },
    url_video_comprobante: { type: DataTypes.TEXT, allowNull: true },
    fotografia_temperatura: { type: DataTypes.TEXT, allowNull: true },
    motivo_rechazo: { type: DataTypes.STRING(500), allowNull: true },
    tipo_balanza: { type: DataTypes.STRING(50), allowNul: true },
    division: { type: DataTypes.INTEGER, allowNull: true }
}, {
    sequelize: sequelize,
    tableName: 'vw_devolucion_pioapp',
    schema: 'app',
    timestamps: false,
    freezeTableName: true
});

module.exports = vw_devolucion_pioapp;