const { Model, DataTypes } = require('sequelize');
class vw_detalle_permisos extends Model {}

function initVw_detalle_permisos(sequelizeInstance) {
    vw_detalle_permisos.init({
        id_user: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
        usuario: { type: DataTypes.TEXT, allowNull: false, primaryKey: true },
        fecha: { type: DataTypes.DATE, allowNull: false },
        creado_por: { type: DataTypes.TEXT, allowNull: false }
    }, {
        sequelize: sequelizeInstance,
        tableName: 'vw_detalle_permisos',
        schema: 'web',
        timestamps: false
    })
    return vw_detalle_permisos;
}

module.exports = initVw_detalle_permisos;