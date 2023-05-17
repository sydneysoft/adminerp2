const nombre = document.getElementById('nombre');
const descripcion = document.getElementById('descripcion');
const costo = document.getElementById('costo');
const duracion = document.getElementById('duracion');
const frecuencia = document.getElementById('frecuencia');
const modo_aplicacion = document.getElementById('modo_aplicacion');
const dosificacion = document.getElementById('dosificacion');
const precauciones = document.getElementById('precauciones');
const efectos_secundarios = document.getElementById('efectos_secundarios');
const recomendaciones = document.getElementById('recomendaciones');

const nombre_editar = document.getElementById('nombre_editar');
const descripcion_editar = document.getElementById('descripcion_editar');
const costo_editar = document.getElementById('costo_editar');
const duracion_editar = document.getElementById('duracion_editar');
const frecuencia_editar = document.getElementById('frecuencia_editar');
const modo_aplicacion_editar = document.getElementById('modo_aplicacion_editar');
const dosificacion_editar = document.getElementById('dosificacion_editar');
const precauciones_editar = document.getElementById('precauciones_editar');
const efectos_secundarios_editar = document.getElementById('efectos_secundarios_editar');
const recomendaciones_editar = document.getElementById('recomendaciones_editar');

const nombre_mostrar = document.getElementById('nombre_mostrar');
const descripcion_mostrar = document.getElementById('descripcion_mostrar');
const costo_mostrar = document.getElementById('costo_mostrar');
const duracion_mostrar = document.getElementById('duracion_mostrar');
const frecuencia_mostrar = document.getElementById('frecuencia_mostrar');
const modo_aplicacion_mostrar = document.getElementById('modo_aplicacion_mostrar');
const dosificacion_mostrar = document.getElementById('dosificacion_mostrar');
const precauciones_mostrar = document.getElementById('precauciones_mostrar');
const efectos_secundarios_mostrar = document.getElementById('efectos_secundarios_mostrar');
const recomendaciones_mostrar = document.getElementById('recomendaciones_mostrar');

const empresa_id = document.getElementById('empresa_id');
const tratamiento_id = document.getElementById('tratamiento_id');

function clearForm () {
  nombre.value = '';
  descripcion.value = '';
  costo.value = '';
  duracion.value = '';
  frecuencia.value = '';
  modo_aplicacion.value = '';
  dosificacion.value = '';
  precauciones.value = '';
  efectos_secundarios.value = '';
  recomendaciones.value = '';
}

function guardarTratamiento () {
  if (nombre.value !== '' && costo.value !== '' && dosificacion.value !== '') {
    save('/admin-clinica/tratamientos/items', {
      nombre: nombre.value,
      descripcion: descripcion.value,
      costo: costo.value,
      duracion: duracion.value,
      frecuencia: frecuencia.value,
      modo_aplicacion: modo_aplicacion.value,
      dosificacion: dosificacion.value,
      precauciones: precauciones.value,
      efectos_secundarios: efectos_secundarios.value,
      recomendaciones: recomendaciones.value,
      empresa_id: empresa_id.value
    }, createItemSuccess);
  } else {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Oops...',
      text: 'Los campos marcados con * son obligatorios',
      timer: 2000
    })
  }
}

function createItemSuccess (preData) {
  const data = preData.data;
  tablaTratamientos.rows.add([{
    "ID": preData.id,
    "Nombre": data.nombre,
    "Costo": data.costo,
    "Duración": data.duracion,
    "Frecuencia": data.frecuencia,
    "Modo de aplicación": data.modo_aplicacion,
    "Dosificación": data.dosificacion,
    "Acciones": JSON.stringify({id: preData.id, ...data})
  }]).draw();
  $('#nuevoTratamientoModal').modal('hide');
}

function updateItemSuccess() {
  tablaTratamientos.row($(`#delete${tratamiento_id.value}`)).remove().draw()
  tablaTratamientos.rows.add([{
    "ID": tratamiento_id.value,
    "Nombre": nombre_editar.value,
    "Costo": costo_editar.value,
    "Duración": duracion_editar.value,
    "Frecuencia": frecuencia_editar.value,
    "Modo de aplicación": modo_aplicacion_editar.value,
    "Dosificación": dosificacion_editar.value,
    "Acciones": JSON.stringify({
      id: tratamiento_id.value,
      nombre: nombre_editar.value,
      descripcion: descripcion_editar.value,
      costo: costo_editar.value,
      duracion: duracion_editar.value,
      frecuencia: frecuencia_editar.value,
      modo_aplicacion: modo_aplicacion_editar.value,
      dosificacion: dosificacion_editar.value,
      precauciones: precauciones_editar.value,
      efectos_secundarios: efectos_secundarios_editar.value,
      recomendaciones: recomendaciones_editar.value,
    })
  }]).draw();
  $('#editarTratamientoModal').modal('hide');
}

function verTratamiento(data) {
  nombre_mostrar.value = data.nombre;
  descripcion_mostrar.value = data.descripcion;
  costo_mostrar.value = data.costo;
  duracion_mostrar.value = data.duracion;
  frecuencia_mostrar.value = data.frecuencia;
  modo_aplicacion_mostrar.value = data.modo_aplicacion;
  dosificacion_mostrar.value = data.dosificacion;
  precauciones_mostrar.value = data.precauciones;
  efectos_secundarios_mostrar.value = data.efectos_secundarios;
  recomendaciones_mostrar.value = data.recomendaciones;
  $('#mostrarTratamientoModal').modal('show');
}

function editarTratamiento(data) {
  nombre_editar.value = data.nombre;
  descripcion_editar.value = data.descripcion;
  costo_editar.value = data.costo;
  duracion_editar.value = data.duracion;
  frecuencia_editar.value = data.frecuencia;
  modo_aplicacion_editar.value = data.modo_aplicacion;
  dosificacion_editar.value = data.dosificacion;
  precauciones_editar.value = data.precauciones;
  efectos_secundarios_editar.value = data.efectos_secundarios;
  recomendaciones_editar.value = data.recomendaciones;
  tratamiento_id.value = data.id;
  $('#editarTratamientoModal').modal('show');
}

function updateTratamiento() {
  updateItem(`/admin-clinica/tratamientos/items/${tratamiento_id.value}`, {
    nombre: nombre_editar.value,
    descripcion: descripcion_editar.value,
    costo: costo_editar.value,
    duracion: duracion_editar.value,
    frecuencia: frecuencia_editar.value,
    modo_aplicacion: modo_aplicacion_editar.value,
    dosificacion: dosificacion_editar.value,
    precauciones: precauciones_editar.value,
    efectos_secundarios: efectos_secundarios_editar.value,
    recomendaciones: recomendaciones_editar.value,
    empresa_id: empresa_id.value
  }, updateItemSuccess);
}
