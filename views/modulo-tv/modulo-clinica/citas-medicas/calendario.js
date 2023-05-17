const doctor = document.getElementById('doctor');
const paciente = document.getElementById('paciente');
const sede = document.getElementById('sede');
const fecha = document.getElementById('fecha');
const hora = document.getElementById('hora');
const tipoCita = document.getElementById('tipoCita');
const estadoSelect = document.getElementById('estado');
const precio = document.getElementById('precio');
const color = document.getElementById('colorpicker');
const especialidad = document.getElementById('especialidad');

const doctorEdit = document.getElementById('editarDoctor');
const pacienteEdit = document.getElementById('editarPaciente');
const sedeEdit = document.getElementById('editarSede');
const fechaEdit = document.getElementById('editarFecha');
const horaEdit = document.getElementById('editarHora');
const horaFinEdit = document.getElementById("editarHoraFin");
const estadoEdit = document.getElementById("editarEstado");
const tipoCitaEdit = document.getElementById("editarTipoCita");
const precioEdit = document.getElementById('editarPrecio');
const colorEdit = document.getElementById("editarColorpicker");
const especialidadEdit = document.getElementById('editarEspecialidad');

let calendar;
document.addEventListener('DOMContentLoaded', function () {
  
  const pacienteSelect2Editar = $("#editarPaciente").select2()

  var calendarEl = document.getElementById('calendario');
  calendar = new FullCalendar.Calendar(calendarEl, {
    locale: 'es',
    initialView: 'timeGridWeek',
    // themeSystem: 'bootstrap',
    headerToolbar: {
      start: 'title', // will normally be on the left. if RTL, will be on the right
      center: '',
      end: 'today prev,next' // will normally be on the right. if RTL, will be on the left
    },
    aspectRatio: 2,
    handleWindowResize: true,
    selectable: true,
    editable: true,
    droppable: true,
    nowIndicator: true,
    // events: JSON.parse(document.getElementById('calendario').getAttribute('data-calendar')),
    dateClick: function (info) {
      $('#fecha-sede-admin-citas-add').val(moment(info.date).format('YYYY-MM-DD'));
      $('#hora-sede-admin-citas-add').val(moment(info.date).format('HH:mm'));
      $('#nuevaCita').modal('show');
    },
    eventClick: function (info) {
      if (info.event.extendedProps.data) {
        const data = info.event.extendedProps.data;
        console.log(data);
        // $('#editarSede')[0].value = data.sede ? data.sede.id : '0'
        // $('#editarDoctor')[0].value = data.doctor ? data.doctor.id : '0'
        // $('#editarPaciente')[0].value = data.paciente ? data.paciente.id : '0'
        // $("#editarEspecialidad")[0].value = data.especialidad ? data.especialidad.id : '0'
        // $('#editarFecha')[0].value = 
        // $('#editarHora')[0].value = 
        // $('#editarHoraFin')[0].value = 
        // $('#editarPrecio')[0].value = data.precio || '0'
        // $("#editarColorpicker")[0].value = data.color || '#0000ff'
        // $('#mySelect2').val('1')
        doctorEdit.value = data.doctor ? data.doctor.id : '0';
        pacienteEdit.value = data.paciente ? data.paciente.id : '0';
        pacienteSelect2Editar.val(data.paciente ? data.paciente.id : '0').trigger('change');
        especialidadEdit.value = data.especialidad ? data.especialidad.id : '0';
        sedeEdit.value = data.sede ? data.sede.id : '0';
        fechaEdit.value = moment(data.fechaCita).format('YYYY-MM-DD') || '0000-00-00';
        horaEdit.value = data.horaInicio || '00:00';
        horaFinEdit.value = data.horaFin || '00:00';
        estadoEdit.value = data.estado;
        tipoCitaEdit.value = data.tipoCita;
        precioEdit.value = data.precio;
        colorEdit.value = data.color;

        $('#idCita')[0].value = data.id
        $("#editarCita").modal('show');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se puede editar esta cita.'
        })
      }
    },
    eventDrop: function (info) {
      actualizarFechaCita(info.event.id, info.event.start, info.event.end);
    },
    eventResize: function (info) {
      actualizarFechaCita(info.event.id, info.event.start, info.event.end);
    }
  });
  calendar.render();
  getEvents()

});

function getEvents() {
  $.ajax({
    method: "GET",
    dataType: 'json',
    url: '/admin-clinica/citas-medicas/calendario/data',
    success: function (data) {
      if (data.ok) {
        calendar.removeAllEvents();
        calendar.addEventSource(data.data);
      }
    }
  })
}

document.getElementById('addNewCita').addEventListener('click', (e) => {
  console.log(e)
  if (doctor.value !== '' && paciente.value !== '' && tipoCita.value !== '' && estadoSelect.value !== '' && fecha.value !== '' && hora.value !== '' && precio.value !== '' && sede.value) {
    console.log('post');
    $.ajax({
      method: "POST",
      // dataType: 'json',
      url: '/admin-clinica/citas-medicas/cita',
      data: {
        doctor: doctor.value,
        paciente: paciente.value,
        tipoCita: tipoCita.value,
        estado: estadoSelect.value,
        fecha: fecha.value,
        hora: hora.value,
        precio: precio.value,
        sede: sede.value,
        color: color.value,
        especialidad: especialidad.value
      },
      success: function (data) {
        if (data.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Cita agregada correctamente',
            timer: 2000,
            showCloseButton: true
          })
          $('#nuevaCita').modal('hide');
          getEvents();
          // location.reload();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salió mal',
            timer: 2000,
            showCloseButton: true
          })
        }
      },
      error: function (err) {
        console.log(err);
      }
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Todos los campos son obligatorios',
      timer: 2000,
      showCloseButton: true
    })
  }
});

document.getElementById('updateCita').addEventListener('click', (e) => {

  if (doctorEdit.value !== '' && pacienteEdit.value !== '' && fechaEdit.value !== '' && horaEdit.value !== '' && precioEdit.value !== '' && sedeEdit.value !== '' && colorEdit.value !== '' && horaFinEdit.value !== '') {
    console.log('post');
    $.ajax({
      method: "PUT",
      // dataType: 'json',
      url: '/admin-clinica/citas-medicas/allcita',
      data: {
        id: $('#idCita')[0].value,
        doctor: doctorEdit.value,
        paciente: pacienteEdit.value,
        tipoCita: tipoCitaEdit.value,
        estado: estadoEdit.value,
        fecha: fechaEdit.value,
        hora: horaEdit.value,
        precio: precioEdit.value,
        sede: sedeEdit.value,
        color: colorEdit.value,
        horaFin: horaFinEdit.value,
        especialidad: especialidadEdit.value
      },
      success: function (data) {

        if (data.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Cita actualizada correctamente',
            timer: 2000,
            showCloseButton: true
          })
          $('#nuevaCita').modal('hide');
          getEvents();
          // location.reload();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salió mal',
            timer: 2000,
            showCloseButton: true
          })
        }
      },
      error: function (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo salió mal',
          timer: 2000,
          showCloseButton: true
        })
      }
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Todos los campos son obligatorios',
      timer: 2000,
      showCloseButton: true
    })
  }
})
document.getElementById('nuevaCitaButton').addEventListener('click', (e) => {
  $('#nuevaCita').modal('show');
});
function actualizarFechaCita(id, fechaInicio, fechaFin) {
  if (moment(fechaInicio).isValid() && moment(fechaFin).isValid) {
    $.ajax({
      method: "PUT",
      url: '/admin-clinica/citas-medicas/cita',
      data: {
        id: id,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      },
      success: function (data) {
        if (data.ok) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Cita actualizada correctamente',
            timer: 2000,
            showConfirmButton: false,
          })
        } else {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salió mal',
            timer: 2000,
            showConfirmButton: false,
          })
        }
      },
      error: function (err) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Oops...',
          text: 'Algo salió mal',
          timer: 2000,
          showConfirmButton: false,
        })
      }
    })
  }
}
