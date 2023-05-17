const nombre = document.getElementById('nombre');
const apellido_paterno = document.getElementById('apellido_paterno');
const apellido_materno = document.getElementById('apellido_materno');
const numero_documento = document.getElementById('numero_documento');
const tipo_documento = document.getElementById('tipo_documento');
const sexo = document.getElementById('sexo');
const fecha_nacimiento = document.getElementById('fecha_nacimiento');
const estado_civil = document.getElementById('estado_civil');
const numero_seguro = document.getElementById('numero_seguro');
const tipo_seguro = document.getElementById('tipo_seguro');
const celular = document.getElementById('celular');
const correo = document.getElementById('correo');
const direccion = document.getElementById('direccion');
const diagnostico = document.getElementById('diagnostico');
const nota = document.getElementById('nota');

const nombreEditar = document.getElementById('nombreEditar');
const apellido_paternoEditar = document.getElementById('apellido_paternoEditar');
const apellido_maternoEditar = document.getElementById('apellido_maternoEditar');
const numero_documentoEditar = document.getElementById('numero_documentoEditar');
const tipo_documentoEditar = document.getElementById('tipo_documentoEditar');
const sexoEditar = document.getElementById('sexoEditar');
const fecha_nacimientoEditar = document.getElementById('fecha_nacimientoEditar');
const estado_civilEditar = document.getElementById('estado_civilEditar');
const numero_seguroEditar = document.getElementById('numero_seguroEditar');
const tipo_seguroEditar = document.getElementById('tipo_seguroEditar');
const celularEditar = document.getElementById('celularEditar');
const correoEditar = document.getElementById('correoEditar');
const direccionEditar = document.getElementById('direccionEditar');
const diagnosticoEditar = document.getElementById('diagnosticoEditar');
const notaEditar = document.getElementById('notaEditar');
const idEditar = document.getElementById('idEditar');

function clearForm() {
  nombre.value = ''
  apellido_paterno.value = ''
  apellido_materno.value = ''
  numero_documento.value = ''
  tipo_documento.value = ''
  sexo.value = ''
  fecha_nacimiento.value = ''
  estado_civil.value = ''
  numero_seguro.value = ''
  tipo_seguro.value = ''
  celular.value = ''
  correo.value = ''
  direccion.value = ''
  diagnostico.value = ''
  nota.value = ''
}

let tablaPacientes;
document.addEventListener('DOMContentLoaded', function () {
  tablaPacientes = $('#dataTable').DataTable({
    fnCreatedRow: function (nRow, aData, iDataIndex) {
      $(nRow).attr('id', `delete${aData.ID}`);
    },
    buttons: [
      {
        extend: 'print',
        text: 'Print current page',
        autoPrint: true
      }
    ],
    columns: [
      { data: 'ID' },
      { data: 'Nombre' },
      { data: 'Apellido Paterno' },
      { data: 'Celular' },
      { data: 'Correo' },
      {
        data: 'Acciones',
        render: function (data, type, row) {
          return `
            <button class="btn btn-primary btn-sm" onclick='editarPacienteModal(${data})'>Editar</button>
            <button class="btn btn-danger btn-sm" onclick="beforeDeleteItem('/admin-citas-medicas/pacientes/pacientes/${(JSON.parse(data)).id}', ${(JSON.parse(data)).id})">Eliminar</button>
            `
        }
      },
    ],
  });
});

document.getElementById('nuevoPaciente').addEventListener('click', (e) => {
  $('#nuevoPacienteModal').modal('show');
});

document.getElementById('guardarPaciente').addEventListener('click', (e) => {
  if (nombre.value !== '' && apellido_paterno.value !== '') {
    e.preventDefault();
    const data = {
      nombre: nombre.value,
      apellido_paterno: apellido_paterno.value,
      apellido_materno: apellido_materno.value,
      numero_documento: numero_documento.value,
      tipo_documento: tipo_documento.value,
      sexo: sexo.value,
      fecha_nacimiento: fecha_nacimiento.value,
      estado_civil: estado_civil.value,
      numero_seguro: numero_seguro.value,
      tipo_seguro: tipo_seguro.value,
      celular: celular.value,
      correo: correo.value,
      direccion: direccion.value,
      diagnostico: diagnostico.value,
      nota: nota.value
    }
    fetch('/admin-citas-medicas/pacientes/pacientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(response => {
        if (response.ok) {
          console.log(response);
          $('#nuevoPacienteModal').modal('hide');
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Paciente registrado correctamente.',
            showConfirmButton: false,
            timer: 1500
          })
          tablaPacientes.rows.add([{
            "ID": response.id,
            "Nombre": nombre.value,
            "Apellido Paterno": apellido_paterno.value,
            "Celular": celular.value,
            "Correo": correo.value,
            "Acciones": JSON.stringify({ id: response.id, ...data })
          }]).draw();
          clearForm();
        }
      })
      .catch(err => console.log(err));
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debe llenar los campos obligatorios',
    });
  }
});

function editarPacienteModal(str) {
  const data = JSON.parse(JSON.stringify(str));
  nombreEditar.value = data.nombre;
  apellido_paternoEditar.value = data.apellido_paterno;
  apellido_maternoEditar.value = data.apellido_materno;
  numero_documentoEditar.value = data.numero_documento;
  tipo_documentoEditar.value = data.tipo_documento;
  sexoEditar.value = data.sexo;
  fecha_nacimientoEditar.value = moment(data.fecha_nacimiento).format('YYYY-MM-DD');
  estado_civilEditar.value = data.estado_civil;
  numero_seguroEditar.value = data.numero_seguro;
  tipo_seguroEditar.value = data.tipo_seguro;
  celularEditar.value = data.celular;
  correoEditar.value = data.correo;
  direccionEditar.value = data.direccion;
  diagnosticoEditar.value = data.diagnostico;
  notaEditar.value = data.nota;
  idEditar.value = data.id;
  $('#editarPacienteModal').modal('show');

  console.log(data);
}

document.getElementById('updatePaciente').addEventListener('click', (e) => {
  if (nombreEditar.value !== '' && apellido_paternoEditar.value !== '') {
    const data = {
      nombre: nombreEditar.value,
      apellido_paterno: apellido_paternoEditar.value,
      apellido_materno: apellido_maternoEditar.value,
      numero_documento: numero_documentoEditar.value,
      tipo_documento: tipo_documentoEditar.value,
      sexo: sexoEditar.value,
      fecha_nacimiento: fecha_nacimientoEditar.value,
      estado_civil: estado_civilEditar.value,
      numero_seguro: numero_seguroEditar.value,
      tipo_seguro: tipo_seguroEditar.value,
      celular: celularEditar.value,
      correo: correoEditar.value,
      direccion: direccionEditar.value,
      diagnostico: diagnosticoEditar.value,
      nota: notaEditar.value
    }
    fetch(`/admin-citas-medicas/pacientes/pacientes/${idEditar.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(response => {
        if (response.ok) {
          $('#editarPacienteModal').modal('hide');
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Paciente actualizado correctamente.',
            showConfirmButton: false,
            timer: 1500
          })
          tablaPacientes.row(`#delete${idEditar.value}`).remove().draw();
          tablaPacientes.rows.add([{
            "ID": idEditar.value,
            "Nombre": nombreEditar.value,
            "Apellido Paterno": apellido_paternoEditar.value,
            "Celular": celularEditar.value,
            "Correo": correoEditar.value,
            "Acciones": JSON.stringify({ id: idEditar.value, ...data })
          }]).draw();
        }
      })
      .catch(err => console.log(err));
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debe llenar los campos obligatorios',
    });
  }
});