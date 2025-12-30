const initSupervisorModel = require('../../models/pdv/views/vwDwhSupervisores.view');
const initEmpleadoModel = require('../../models/nomina/empleado.model');
const { sequelizeInit } = require('../../configuration/db');

//Obtener codigo de supervisor y nombre de todos los supervisores
async function getAllSupervisors(req, res) {
    try {
        const sequelizePDV = await sequelizeInit('PDV');
        const SupervisorModel = initSupervisorModel(sequelizePDV);
        const supervisores = await SupervisorModel.findAll({
            attributes: [
                [sequelizePDV.fn('MAX', sequelizePDV.col('CodSupervisor')), 'CodSupervisor'],
                'NomSupervisor'
            ],
            group: ['NomSupervisor'],
            raw: true
        });
        return res.json(supervisores);
    } catch (err) {
        return res.status(500).json({ error: 'Error al obtener los supervisores', details: err.message });
    }
}

//Obtener supervisor de tienda
async function getSupervisorBycodEmpleado(req, res) {
  const { codE } = req.params;

  try {
    const sequelizeNomina = await sequelizeInit('NOMINA');
    const EmpleadoModel = initEmpleadoModel(sequelizeNomina);
    const { Sequelize } = sequelizeNomina;

    const empleado = await EmpleadoModel.findOne({
      attributes: [
        ['aliasCodigo', 'codsupervisor'],
        [
          Sequelize.fn(
            'CONCAT',
            Sequelize.col('nombreEmpleado'),
            ' ',
            Sequelize.col('apellidoEmpleado')
          ),
          'nomsupervisor'
        ],
      ],
      where: { codEmpleado: codE },
      raw: true
    });

    return res.json(empleado);
  } catch (err) {
    return res.status(500).json({
      error: 'Error al obtener empleado',
      details: err.message
    });
  }
}



module.exports = {
    getAllSupervisors,
    getSupervisorBycodEmpleado
};