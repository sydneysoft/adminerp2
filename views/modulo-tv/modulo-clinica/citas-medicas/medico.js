const nombre = document.getElementById('nombre');
const especialidad = document.getElementById('especialidad');
const numero_documento = document.getElementById('numero_documento');
const tipo_documento = document.getElementById('tipo_documento');
const celular = document.getElementById('celular');
const correo = document.getElementById('correo');
const tiempo_cita = document.getElementById('tiempo_cita');


const nombreEditar = document.getElementById('nombreEditar');
const especialidadEditar = document.getElementById('especialidadEditar');
const numero_documentoEditar = document.getElementById('numero_documentoEditar');
const tipo_documentoEditar = document.getElementById('tipo_documentoEditar');
const celularEditar = document.getElementById('celularEditar');
const correoEditar = document.getElementById('correoEditar');
const idEditar = document.getElementById('idEditar');
const tiempo_citaEditar = document.getElementById('tiempo_citaEditar');

let tablaMedicos;
document.addEventListener('DOMContentLoaded', function () {
  tablaMedicos = $('#dataTable').DataTable({
    fnCreatedRow: function (nRow, aData, iDataIndex) {
      $(nRow).attr('id', `delete${aData.ID}`);
    },
    buttons: [
      {
        extend: 'print',
        text: 'Print current page',
        autoPrint: false
      }
    ],
    columns: [
      { data: 'ID' },
      { data: 'Nombre' },
      { data: 'Especialidad' },
      { data: 'Celular' },
      { data: 'Correo' },
      {
        data: 'Acciones',
        render: function (data, type, row) {
          return `
            <button class="btn btn-primary btn-sm" onclick='editarMedicoModal(${data})'>Editar</button>
            <button class="btn btn-danger btn-sm" onclick="beforeDeleteItem('/admin-clinica/citas-medicas/medicos/medicos/${(JSON.parse(data)).id}', ${(JSON.parse(data)).id})">Eliminar</button>
            `
        }
      },
    ],
  });
});

document.getElementById('nuevoMedico').addEventListener('click', (e) => {
  $('#nuevoMedicoModal').modal('show');
});

document.getElementById('addMedico').addEventListener('click', (e) => {
  if (nombre.value !== '' && especialidad.value !== '' && numero_documento.value !== '' && tipo_documento.value !== '' && celular.value !== '' && correo.value !== '') {
    const data = {
      nombre: nombre.value,
      especialidad: especialidad.value,
      numero_documento: numero_documento.value,
      tipo_documento: tipo_documento.value,
      celular: celular.value,
      correo: correo.value,
      tiempo_consulta: tiempo_cita.value * 60 * 1000
    };

    fetch('/admin-clinica/citas-medicas/medicos/medicos', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          $('#nuevoMedicoModal').modal('hide');
          Swal.fire({
            icon: 'success',
            title: 'Medico registrado',
            text: 'El medico se registro correctamente',
            timer: 2000
          });

          tablaMedicos.rows.add([
            {
              "ID": data.id,
              "Nombre": nombre.value,
              "Especialidad": especialidad.value,
              "Celular": celular.value,
              "Correo": correo.value,
              "Acciones": JSON.stringify({
                id: data.id,
                nombre: nombre.value,
                especialidad: especialidad.value,
                numero_documento: numero_documento.value,
                tipo_documento: tipo_documento.value,
                celular: celular.value,
                correo: correo.value,
                tiempo_consulta: tiempo_cita.value * 60 * 1000
              })
            }
          ]).draw()
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ocurrio un error al registrar el medico!',
            timer: 2000
          });
        }
      })
      .catch(err => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrio un error al registrar el medico!',
          timer: 2000
        });
      });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Todos los campos son obligatorios!',
      timer: 2000
    });
  }

});


function editarMedicoModal(str) {
  const data = JSON.parse(JSON.stringify(str));
  console.log(data);
  idEditar.value = data.id;
  nombreEditar.value = data.nombre;
  especialidadEditar.value = data.especialidad;
  numero_documentoEditar.value = data.numero_documento;
  tipo_documentoEditar.value = data.tipo_documento;
  celularEditar.value = data.celular;
  correoEditar.value = data.correo;
  tiempo_citaEditar.value = data.tiempo_consulta / 60000;

  $('#editarMedicoModal').modal('show');
}
document.getElementById('editarMedicoModal').addEventListener('click', (e) => {


});

document.getElementById('updateMedico').addEventListener('click', (e) => {
  if (nombreEditar !== '' && especialidadEditar !== '' && numero_documentoEditar !== '' && tipo_documentoEditar !== '' && celularEditar !== '' && correoEditar !== '') {
    const data = {
      nombre: nombreEditar.value,
      especialidad: especialidadEditar.value,
      numero_documento: numero_documentoEditar.value,
      tipo_documento: tipo_documentoEditar.value,
      celular: celularEditar.value,
      correo: correoEditar.value,
      tiempo_consulta: tiempo_citaEditar.value * 60 * 1000
    };

    fetch('/admin-clinica/citas-medicas/medicos/medicos/' + idEditar.value, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.ok) {
          $('#editarMedicoModal').modal('hide');
          Swal.fire({
            icon: 'success',
            title: 'Medico actualizado',
            text: 'El medico se actualizo correctamente',
            timer: 2000
          });
        }
        // location.reload();
      })
      .catch(err => console.log(err));
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Todos los campos son obligatorios!',
      timer: 2000
    });
  }
});