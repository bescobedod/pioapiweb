const { Model, DataTypes } = require('sequelize');

class EmpleadoNominaModel extends Model {}

function initEmpleadoNominaModel(sequelizeInstance) {
    EmpleadoNominaModel.init({
        codEmpleado: { type: DataTypes.INTEGER, primaryKey: true },
        nombreEmpleado: { type: DataTypes.STRING },
        segundoNombre: { type: DataTypes.STRING },
        apellidoEmpleado: { type: DataTypes.STRING },
        segundoApellido: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        fechaNac: { type: DataTypes.STRING },
        aliasCodigo: { type: DataTypes.STRING },
        idRol: { type: DataTypes.INTEGER },
        baja: { type: DataTypes.INTEGER },
        direccion: { type: DataTypes.STRING }
    }, {
        sequelize: sequelizeInstance,
        tableName: 'vwDetalleEmpleadoCootragua',
        schema: 'dbo',
        timestamps: false
    });

    return EmpleadoNominaModel;
}

module.exports = initEmpleadoNominaModel;