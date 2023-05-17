let tablaCitas;
const citaHandleModal = (data) => {
  const aux = JSON.parse(JSON.stringify(data));
  console.log(data);
  console.log(aux)
  $('#nombreUsuarioInfoCitas').text(data.paciente.nombre);
  $('#dataUsuarioNombreCitaEdit').text("Nombre: " + data.paciente.nombre);
  $('#ubicacionCitaEdit').text("Dirección: " + data.sede.direccion);
  $('#dataUsuarioCorreo').text("Correo: " + data.paciente.correo)
  $('#fechaCitasEdit').text("Fecha de cita: " + data.fechaCita);
  $('#statusCitasEdit').text("Estado: " + data.estado);
  $('#tipoCitasEdit').text("Hora de la cita " + data.horaInicio);
  $('#horarioFechaCitaEdit').text(`Documento: ${data.paciente.tipo_documento} : ${data.paciente.numero_documento}`);
  $('#precioCitaPacienteEdit').text("Precio: " + data.precio);
  // $('#correoCitaPacienteEdit').text("Correo: ", data.paciente.correo);
  if (null) {
    $('#importadoDataEdit').text("No cuenta con fecha de Importación");
  } else {
    $('#importadoDataEdit').text("Importado el " + data.fechaRegistro);
  }

  $('#infoPaciente').modal("show");
};
document.addEventListener('DOMContentLoaded', function () {
  tablaCitas = $("#tablaCita").dataTable({
    fnCreatedRow: function (nRow, aData, iDataIndex) {
      $(nRow).attr('id', `delete${JSON.parse(aData.Acciones).id}`);
      $(nRow).attr('onclick', "citaHandleModal(" + aData.Acciones +")");
    },
    buttons: [
      {
        extend: 'print',
        text: 'Print current page',
        autoPrint: true
      }
    ],
    columns: [
      { data: 'Paciente' },
      { data: 'Doctor' },
      { data: 'Sede' },
      { data: 'Estado' },
      { data: 'Emisión' },
      { data: 'Reserva' },
      {
        data: 'Acciones',
        render: function (data, type, row) {
          // <button class="btn btn-primary btn-sm" onclick='editarPacienteModal(${data})'>Editar</button>
          const aux = JSON.parse(data);
          return `
            <div class="btn-group">
              <button class="btn btn-primary btn-sm" onclick='citaHandleModal(${data})'>
                <i class="fas fa-pen"></i>
              </button>
              <button class="btn btn-info btn-sm" onclick='citaHandleModal(${data})'>
              <i class="fas fa-eye"></i>
              </button>
              <a class="btn btn-secondary btn-sm" href="/admin-clinica/citas-medicas/reprogramar/${aux.id}">Reprogramar</a>
              <button class="btn btn-danger btn-sm" onclick="beforeDeleteItem('/admin-clinica/citas-medicas/citas/${aux.id}', ${aux.id})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            `
        }
      },
    ],
  });
  getCitas();
});

function getCitas() {
  $.ajax({
    method: 'GET',
    url: '/admin-clinica/citas-medicas/get-data-date',
    dataType: 'json',
    success: function (data) {
      if (data.ok) {
        let datos = []
        data.data.forEach((item) => {
          let aux = {
            "Paciente": item.paciente.nombre,
            "Doctor": item.doctor.nombre,
            "Sede": item.sede.direccion,
            "Estado": item.estado === 1 ? 'Atendido' : 'No Atendido',
            "Emisión": item.fechaRegistro,
            "Reserva": item.fechaCita,
            "Acciones": JSON.stringify(item)
          }
          datos.push(aux)
        })
        // console.log(data)
        tablaCitas.fnClearTable();
        tablaCitas.fnAddData(datos);
      }
    },
    error: function (err) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal!',
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}


function nohayregistros() {
  $('#data-body-citas-filter').empty();
  $('#data-body-citas-filter').append('<p>No hay registros con esos filtros.</p>');
};


function filterFechaInicio() {
  var fecha_cita = $('#fecha-citas-admin-filtro').val();
  if (fecha_cita != '') {
    $.ajax({
      method: 'GET',
      url: '/admin-clinica/citas-medicas/get-data-filter-date',
      data: {
        fecha_cita: fecha_cita
      },
      success: function (result) {
        console.log(result)
        if (result.ok) {
          let datos = []
          result.data.forEach((item) => {
            let aux = {
              "Paciente": item.paciente.nombre,
              "Doctor": item.doctor.nombre,
              "Sede": item.sede.direccion,
              "Estado": item.estado === 1 ? 'Atendido' : 'No Atendido',
              "Emisión": item.fechaRegistro,
              "Reserva": item.fechaCita,
              "Acciones": JSON.stringify(item)
            }
            datos.push(aux)
          });

          tablaCitas.fnClearTable();
          if (datos.length > 0) {
            tablaCitas.fnAddData(datos);
          }
        }else {
          tablaCitas.fnClearTable();
        }
      },
      error: function (error) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Ocurrió un error al filtrar por estado.',
          showConfirmButton: false,
          timer: 2500
        });
      }
    })
  } else {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Debes ingresar una fecha.',
      showConfirmButton: false,
      timer: 2500
    });
  }
};

function filterFechaRegistro() {
  var fecha_registro = $('#fecha-registro-citas-admin-filtro').val();
  if (fecha_registro != '') {
    $.ajax({
      method: 'GET',
      url: '/admin-clinica/citas-medicas/get-data-filter-date',
      data: {
        fecha_registro: fecha_registro
      },
      success: function (result) {
        if (result.ok) {
          let datos = []
          result.data.forEach((item) => {
            let aux = {
              ID: item.id,
              Paciente: item.paciente.nombre,
              Doctor: item.doctor.nombre,
              Sede: item.sede.direccion,
              Estado: item.estado === 1 ? 'Atendido' : 'No Atendido',
              Emisión: item.fechaRegistro,
              Reserva: item.fechaCita,
              Acciones: JSON.stringify(item)
            }
            datos.push(aux)
          });

          tablaCitas.fnClearTable();
          if (datos.length > 0) {
            tablaCitas.fnAddData(datos);
          }
        } else {
          tablaCitas.fnClearTable();
        }
      },
      error: function (error) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Ocurrió un error al filtrar por estado.',
          showConfirmButton: false,
          timer: 2500
        });
      }
    })
  } else {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Debes ingresar una fecha.',
      showConfirmButton: false,
      timer: 2500
    });
  }
};

function filterEstado() {
  let filterEstado = $('#estado-citas-admin-filtro').val();
  if (filterEstado !== '') {
    $.ajax({
      method: 'GET',
      url: '/admin-clinica/citas-medicas/get-data-filter-date',
      data: {
        estado: filterEstado
      },
      success: function (result) {
        if (result.ok) {
          let datos = []
          result.data.forEach((item) => {
            let aux = {
              ID: item.id,
              Paciente: item.paciente.nombre,
              Doctor: item.doctor.nombre,
              Sede: item.sede.direccion,
              Estado: item.estado === 1 ? 'Atendido' : 'No Atendido',
              Emisión: item.fechaRegistro,
              Reserva: item.fechaCita,
              Acciones: JSON.stringify(item)
            }
            datos.push(aux)
          });

          tablaCitas.fnClearTable();
          if (datos.length > 0) {
            tablaCitas.fnAddData(datos);
          }
        } else {
          tablaCitas.fnClearTable();
        }
      },
      error: function (error) {
        console.log(error);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Ocurrió un error al filtrar por estado.',
          showConfirmButton: false,
          timer: 2500
        });
      }
    })
  } else {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Debes seleccionar un estado.',
      showConfirmButton: false,
      timer: 2500
    });
  }
}

function resetearFiltros() {
  $('#fecha-citas-admin-filtro')[0].value = "";
  $('#fecha-registro-citas-admin-filtro')[0].value = "";
  $('#estado-citas-admin-filtro')[0].value = "";
  getCitas();
};