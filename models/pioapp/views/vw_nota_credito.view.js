const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../configuration/db');

class vw_nota_credito extends Model {}

vw_nota_credito.init({
    id_nota: { type: DataTypes.UUID, primaryKey: true },
    id_tienda: { type: DataTypes.STRING(10), allowNull: false },
    tienda_nombre: { type: DataTypes.STRING },
    id_empresa: { type: DataTypes.STRING(10), allowNull: false },
    empresa_nombre: { type: DataTypes.STRING },
    division: { type: DataTypes.INTEGER, allowNull: false },
    estado: { type: DataTypes.TEXT },
    id_devolucion: { type: DataTypes.INTEGER },
    idEntradaInventario: { type: DataTypes.BIGINT, field: "idEntradaInventario" },
    serieEntradaInventario: { type: DataTypes.STRING(10), field: "serieEntradaInventario" },
    creado_por: { type: DataTypes.STRING },
    fecha_creacion: { type: DataTypes.DATE }
}, {
    sequelize: sequelize,
    tableName: 'vw_nota_credito',
    schema: 'web',
    timestamps: false,
    freezeTableName: true
});

module.exports = vw_nota_credito;