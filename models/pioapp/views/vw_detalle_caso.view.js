const { Model, DataTypes } = require('sequelize');

class vw_detalle_caso extends Model {}

function initVw_detalle_caso(sequelizeInstance) {
    vw_detalle_caso.init({
        id_caso: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
        tienda_nombre: { type: DataTypes.STRING(500), allowNull: false },
        id_tienda: { type: DataTypes.STRING(12), allowNull: false },
        id_empresa: { type: DataTypes.STRING(12), allowNull: false },
        division: { type: DataTypes.INTEGER, allowNull: false },
        tipo_solicitud: { type: DataTypes.STRING(100), allowNull: false },
        estado: { type: DataTypes.STRING(100), allowNull: false },
        impacto: { type: DataTypes.STRING(100), allowNull: false },
        urgencia: { type: DataTypes.STRING(100), allowNull: false },
        categoria: { type: DataTypes.STRING(100), allowNull: false },
        subcategoria: { type: DataTypes.STRING(100), allowNull: false },
        mensaje: { type: DataTypes.STRING(255), allowNull: false },
        correlativo: { type: DataTypes.BIGINT, allowNull: false },
        creador: { type: DataTypes.TEXT, allowNull: true },
        mensaje_cierre: { type: DataTypes.STRING(500), allowNull: true }
    }, {
        sequelize: sequelizeInstance,
        tableName: 'vw_detalle_caso',
        schema: 'web',
        timestamps: true,
    }
    );

    return vw_detalle_caso;
}

module.exports = initVw_detalle_caso;