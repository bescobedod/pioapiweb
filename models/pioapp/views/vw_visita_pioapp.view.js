const { Model, DataTypes } = require('sequelize');

class vw_visita_pioapp extends Model {}

function initVw_visita_pioapp(sequelizeInstance) {
    vw_visita_pioapp.init({
        codigo_empresa: { type: DataTypes.STRING(10), allowNull: false, primaryKey: true },
        codigo_tienda: { type: DataTypes.STRING(10), allowNull: false },
        nombre_tienda: { type: DataTypes.STRING(500), allowNull: false },
        direccion_tienda: { type: DataTypes.TEXT, allowNull: false },
        tipo_visita: { type: DataTypes.STRING(100), allowNull: false },
        fecha_hora_visita: { type: DataTypes.DATE, allowNull: false },
        codigo_usuario_visita: { type: DataTypes.STRING(100), allowNull: false },
        nombre_usuario_visita: { type: DataTypes.TEXT, allowNull: false },
        gps_longitud_visita: { type: DataTypes.TEXT, allowNull: false },
        gps_latitud_visita: { type: DataTypes.TEXT, allowNull: false },
        comentario_visita: { type: DataTypes.TEXT, allowNull: false }
    }, {
        sequelize: sequelizeInstance,
        tableName: 'vw_visita_pioapp',
        schema: 'app',
        timestamps: false
    })
    return vw_visita_pioapp;
}

module.exports = initVw_visita_pioapp;