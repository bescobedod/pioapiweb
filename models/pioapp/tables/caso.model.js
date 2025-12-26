
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class CasoModel extends Model {}

CasoModel.init({
    id_caso: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    id_tienda: { type: DataTypes.STRING(10), allowNull: false },
    tienda_nombre: { type: DataTypes.STRING(500), allowNull: false },
    id_empresa: { type: DataTypes.STRING(10), allowNull: false },
    division: { type: DataTypes.INTEGER, allowNull: false },
    id_tipo_solicitud: { type: DataTypes.INTEGER, allowNull: false },
    id_estado: { type: DataTypes.INTEGER, allowNull: false },
    id_impacto: { type: DataTypes.INTEGER, allowNull: false },
    id_urgencia: { type: DataTypes.INTEGER, allowNull: false },
    id_categoria: { type: DataTypes.INTEGER, allowNull: false },
    id_subcategoria: { type: DataTypes.INTEGER, allowNull: false },
    mensaje: { type: DataTypes.STRING(255), allowNull: false },
    userCreatedAt: { type: DataTypes.BIGINT, allowNull: true },
    userUpdatedAt: { type: DataTypes.BIGINT, allowNull: true }
}, {
    sequelize,
    tableName: 'tbl_caso',
    schema: 'web',
    timestamps: true
});

module.exports = CasoModel;
