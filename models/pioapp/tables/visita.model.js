const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class VisitaModel extends Model {}

VisitaModel.init({
    id_visita: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    empresa: { type: DataTypes.STRING(10), allowNull: false },
    tienda: { type: DataTypes.STRING(10), allowNull: false },
    tienda_nombre: { type: DataTypes.STRING(500), allowNull: false },
    tienda_direccion: { type: DataTypes.TEXT, allowNull: true },
    id_tipo_visita: { type: DataTypes.INTEGER, allowNull: false },
    photo_gps_longitude: { type: DataTypes.TEXT, allowNull: true },
    photo_gps_latitude: { type: DataTypes.TEXT, allowNull: true },
    phone_gps_longitude: { type: DataTypes.TEXT, allowNull: false },
    phone_gps_latitude: { type: DataTypes.TEXT, allowNull: false },
    name_original_image: { type: DataTypes.TEXT, allowNull: true },
    url_image: { type: DataTypes.TEXT, allowNull: false },
    id_form_supervision: { type: DataTypes.INTEGER, allowNull: true },
    comentario: { type: DataTypes.STRING(500), allowNull: true },
    google_maps_url: { type: DataTypes.TEXT, allowNull: false },
    userCreatedAt: { type: DataTypes.BIGINT, allowNull: true },
    userUpdatedAt: { type: DataTypes.BIGINT, allowNull: true },
    id_visita_emergencia: { type: DataTypes.INTEGER, allowNull: true }
}, {
    sequelize,
    tableName: 'visita',
    schema: 'app',
    timestamps: true
});

module.exports = VisitaModel;