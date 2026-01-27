const { Model, DataTypes } = require('sequelize');
class vw_detalle_visita_emergencia extends Model {}

function initVw_detalle_visita_emergencia(sequelizeInstance) {
    vw_detalle_visita_emergencia.init({
        id_visita: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
        estado: { type: DataTypes.STRING(10), allowNull: false },
        nombre_user_asignado: { type: DataTypes.TEXT, allowNull: false },
        tienda_nombre: { type: DataTypes.STRING(500), allowNull: false },
        tipo_visita: { type: DataTypes.STRING(100), allowNull: false },
        fecha_programacion: { type: DataTypes.DATE, allowNull: false },
        comentario: { type: DataTypes.TEXT, allowNull: false },
        last_gps_longitude: { type: DataTypes.TEXT, allowNull: true },
        last_gps_latitude: { type: DataTypes.TEXT, allowNull: true },
        new_gps_longitude: { type: DataTypes.TEXT, allowNull: false },
        new_gps_latitude: { type: DataTypes.TEXT, allowNull: false },
        division: { type: DataTypes.INTEGER, allowNull: true },
        id_caso: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
        fecha_proceso: { type: DataTypes.DATE, allowNull: true },
    }, {
        sequelize: sequelizeInstance,
        tableName: 'vw_detalle_visita_emergencia',
        schema: 'web',
        timestamps: true
    })
    return vw_detalle_visita_emergencia;
}

module.exports = initVw_detalle_visita_emergencia;