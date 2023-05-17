const {CitaMedicaController} = require('./citas-medicas/cita-medica.controller');
const {MedicoController} = require('./medicos/medico.controller');
const {PacienteController} = require('./pacientes/paciente.controller');
const {EspecialidadController} = require('./especialidades/especialidad.controller');
const {VisitaController} = require('./visita.controller');
const {SedeController} = require('./sedes/sedes.controller');
const {SeguroController} = require('./empresas-seguro/seguro.controller');
const {DocumentoController} = require('./configuracion/documento-medico.controller');


module.exports = {
  CitaMedicaController,
  MedicoController,
  PacienteController,
  EspecialidadController,
  VisitaController, 
  SedeController, 
  SeguroController,
  DocumentoController
}