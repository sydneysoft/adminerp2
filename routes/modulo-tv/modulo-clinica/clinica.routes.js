const { Router } = require("express"), router = Router();

// router.use('/tratamientos', require('./tratamiento.routes'));
router.use('/tratamientos', require('./ce_tratamientos.routes'));
router.use('/citas-medicas', require('./cita-medica.routes'));
router.use('/medicos', require('./medico.routes'));
router.use('/pacientes', require('./paciente.routes'));
router.use('/visitas', require('./visita.routes'));

router.use('/especialidades', require('./especialidad.routes'));
router.use('/sedes', require('./sedes.routes'));

router.use('/aseguradoras', require('./empresa-seguros.routes'));

router.use('/configuracion', require('./configuracion/index.routes'));

router.use('/', require('./calendario.routes'));


module.exports = router