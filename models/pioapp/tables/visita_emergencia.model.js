const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class VisitaEmergenciaModel extends Model {}

VisitaEmergenciaModel.init({
    id_visita: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    empresa: { type: DataTypes.STRING(10), allowNull: false },
    tienda: { type: DataTypes.STRING(10), allowNull: false },
    tienda_nombre: { type: DataTypes.STRING(500), allowNull: false },
    tienda_direccion: { type: DataTypes.TEXT, allowNull: true },
    id_tipo_visita: { type: DataTypes.INTEGER, allowNull: false },
    last_gps_longitude: { type: DataTypes.TEXT, allowNull: true },
    last_gps_latitude: { type: DataTypes.TEXT, allowNull: true },
    new_gps_longitude: { type: DataTypes.TEXT, allowNull: false },
    new_gps_latitude: { type: DataTypes.TEXT, allowNull: false },
    comentario: { type: DataTypes.TEXT, allowNull: true },
    id_estado: {type: DataTypes.INTEGER},
    fecha_programacion: {type: DataTypes.DATE, allowNull: false},
    user_asignado: {type: DataTypes.STRING(100), allowNull: false},
    nombre_user_asignado: {type: DataTypes.TEXT, allowNull: false},
    userCreatedAt: { type: DataTypes.BIGINT, allowNull: true },
    userUpdatedAt: { type: DataTypes.BIGINT, allowNull: true },
    id_caso: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false }
}, {
    sequelize,
    tableName: 'tbl_visita_emergencia',
    schema: 'web',
    timestamps: true
});

module.exports = VisitaEmergenciaModel;