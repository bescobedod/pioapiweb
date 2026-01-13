const express = require('express');
const router = express.Router();
const visita = require('../controllers/pioapp/visita.controller');
const users = require('../controllers/pioapp/users.controller');
const empleados = require('../controllers/nomina/empleado.controller');
const supervisores = require('../controllers/pdv/vwDwhSupervisores.controller');
const tiendas = require('../controllers/pdv/vwTiendasModulo.controller');
const casos = require('../controllers/pioapp/caso.controller');
const login = require('../services/authService');
const auth = require('../middlewares/auth.middleware');

//VISITAS
router.get('/visitas/getAllVisita', auth, visita.getAllVisitas);
router.get('/visitas/getVisitaBySupervisor/:id_users', auth, visita.getVisitaBySupervisor);
router.get('/visitas/getUltimaVisitaBySupervisor/:id_users', auth, visita.getUltimaVisitaBySupervisor);
router.get('/visitas/getTiposVisita', auth, visita.getTiposVisita);
router.post('/visitas/createVisitaEmergencia', auth, visita.createVisitaEmergencia);
router.get('/visitas/getVisitasEmergencia/:division', auth, visita.getVisitasEmergencia);
router.get('/visitas/getVisitasEmergenciaById/:id_visita', auth, visita.getVisitasEmergenciaById);
router.get('/visitas/getVisitasEmergenciaByCaso/:id_caso', auth, visita.getVisitasEmergenciaByCaso);
router.get('/visitas/getVisitaByVisitaEmergencia/:id_ve', auth, visita.getVisitaByVisitaEmergencia);
router.get('/visitas/getVisitasReabiertas/:id_v/:id_c', auth, visita.getVisitasReabiertas);

//USERS
router.get('/users/getAllUsers', auth, users.getAllUsers);
router.get('/users/getAllSupervisors', auth, users.getAllSupervisors);
router.put('/users/updateUser', auth, users.updateUser);

//EMPLEADOS
router.get('/empleados/getAllEmpleados', auth, empleados.getAllEmpleados);

//SUPERVISORES
router.get('/supervisores/getAllSupervisors', auth, supervisores.getAllSupervisors);
router.get('/supervisores/getSupervisorBycodEmpleado/:codE', auth, supervisores.getSupervisorBycodEmpleado);

//TIENDAS
router.get('/tiendas/getAllTiendas/:cod_tienda', auth, tiendas.getAllTiendas);
router.get('/tiendas/getTiendaByIdAndEmpresa/:cod_tienda/:cod_empresa', auth, tiendas.getTiendaByIdAndEmpresa);

//LOGIN
router.post('/login', login);

//CASOS
router.get('/casos/getAllTiposSolicitudes', auth, casos.getAllTiposSolicitudes);
router.get('/casos/getAllImpactos', auth, casos.getAllImpactos);
router.get('/casos/getAllUrgencias', auth, casos.getAllUrgencias);
router.get('/casos/getAllCategorias', auth, casos.getAllCategorias);
router.get('/casos/getSubcategoriaByCategoria/:id_categoria', auth, casos.getSubcategoriaByCategoria)
router.post('/casos/createCaso', auth, casos.createCaso);
router.get('/casos/getCasosByDivision/:division', auth, casos.getCasosByDivision);
router.get('/casos/getCasoById/:id_caso', auth, casos.getCasoById);
router.put('/casos/updateCaso/:id_caso', auth, casos.updateCaso);
router.put('/casos/cierreReaperturaCaso/:id_c/:id_e', auth, casos.cierreReaperturaCaso);

module.exports = router;