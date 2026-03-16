const express = require('express');
const router = express.Router();
const login = require('../services/authService');
const auth = require('../middlewares/auth.middleware');
const casos = require('../controllers/pioapp/caso.controller');
const menus = require('../controllers/pioapp/menu.controller');
const users = require('../controllers/pioapp/users.controller');
const visita = require('../controllers/pioapp/visita.controller');
const empleados = require('../controllers/nomina/empleado.controller');
const tiendas = require('../controllers/pdv/vwTiendasModulo.controller');
const supervisores = require('../controllers/pdv/vwDwhSupervisores.controller');
const publicaciones = require('../controllers/pioapp/publicacion.controller');
const devoluciones = require('../controllers/pioapp/devolucion.controller');
const upload = require('../middlewares/upload');

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
router.get('/users/getUsersByRole/:role', auth, users.getUsersByRole);
router.post('/users/createPermisoCaso/:id_user', auth, users.createPermisoCaso);
router.put('/users/quitPermisoCaso/:id_user', auth, users.quitPermisoCaso);
router.get('/users/getUsersPermisosEstados', auth, users.getUsersPermisosEstados);
router.get('/users/getAllRoles', auth, users.getAllRoles);

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
router.post('/casos/createCaso', auth, casos.createCaso);
router.get('/casos/getAllImpactos', auth, casos.getAllImpactos);
router.get('/casos/permiso_estado', auth, casos.permiso_estado);
router.put('/casos/updateCaso/:id_caso', auth, casos.updateCaso);
router.get('/casos/getAllUrgencias', auth, casos.getAllUrgencias);
router.get('/casos/getCasoById/:id_caso', auth, casos.getCasoById);
router.get('/casos/getAllCategorias', auth, casos.getAllCategorias);
router.get('/casos/getAllTiposSolicitudes', auth, casos.getAllTiposSolicitudes);
router.get('/casos/getCasosByDivision/:division', auth, casos.getCasosByDivision);
router.get('/casos/getArchivosCaso/:id_caso/archivos', auth, casos.getArchivosByCaso);
router.put('/casos/cierreReaperturaCaso/:id_c/:id_e', auth, casos.cierreReaperturaCaso);
router.get('/casos/getSubcategoriaByCategoria/:id_categoria', auth, casos.getSubcategoriaByCategoria)
router.delete('/casos/deleteArchivosCaso/:id_caso/archivos/:id_archivo', auth, casos.deleteArchivosCaso);
router.post('/casos/uploadArchivosCaso/:id_caso/archivos',
    auth,
    upload.array('imagenes', 3),
    casos.uploadArchivosCaso
);

//MENUS
router.get('/menus/getMenuByRol', auth, menus.getMenuByRol);

//PUBLICACIONES
router.get('/publicaciones/getAllCategoriasPublicacion', auth, publicaciones.getAllCategoriasPublicacion);
router.put('/publicaciones/updateCategoriaById/:id_categoria', auth, publicaciones.updateCategoriaById);
router.post('/publicaciones/createCategoria', auth, publicaciones.createCategoria);
router.delete('/publicaciones/deleteCategoriaById/:id_categoria', auth, publicaciones.deleteCategoriaById);
router.put('/publicaciones/toggleCategoriaById/:id_categoria', auth, publicaciones.toggleCategoriaById)
router.get('/publicaciones/getAllPublicaciones', auth, publicaciones.getAllPublicaciones);
router.get('/publicaciones/getArchivoUrl/:id_archivo_pub', auth, publicaciones.getArchivoUrl);
router.post('/publicaciones/createPublicacion', auth, publicaciones.createPublicacion);
router.post('/publicaciones/uploadArchivosPublicacion/:id_publicacion', 
    auth,
    upload.array('archivos', 5),
    publicaciones.uploadArchivosPublicacion
);
router.put('/publicaciones/updatePublicacionById/:id_publicacion', auth, publicaciones.updatePublicacionById);
router.put('/publicaciones/togglePublicationById/:id_publicacion', auth, publicaciones.togglePublicationById);
router.get('/publicaciones/getAllArchivos',auth, publicaciones.getAllArchivos);
router.get('/publicaciones/getArchivosByPublicacion/:id_publicacion', auth, publicaciones.getArchivosByPublicacion);
router.post('/publicaciones/deleteArchivos', auth, publicaciones.deleteArchivos);
router.get('/publicaciones/getUsersViews/:id_publicacion', auth, publicaciones.getUsersViews);

//DEVOLUCIONES
router.get('/devoluciones/getAllDevoluciones', auth, devoluciones.getAllDevoluciones);
router.get('/devoluciones/getDetalleDevolucionByDevolucion/:id_devolucion', auth, devoluciones.getDetalleDevolucionByDevolucion);
router.get('/devoluciones/getAllDevolucionesEstado', auth, devoluciones.getAllDevolucionesEstado);
router.put('/devoluciones/changeStatus/:id_devolucion', auth, devoluciones.changeStatus);
router.get('/devoluciones/getAllDevolucionesMotivo', auth, devoluciones.getAllDevolucionesMotivo);

module.exports = router;