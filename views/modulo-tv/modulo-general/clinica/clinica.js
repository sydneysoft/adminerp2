document.getElementById('agregar_tipo_documento').addEventListener('click', (e) => {
  document.getElementById('tipo_documento').innerHTML += `
    <div class="form-group d-flex mt-3">
      <input type="text" class="tipo_documento form-control" name="tipo_documento" placeholder="Tipo de documento">
      <button class="btn btn-danger ml-1" onclick="eliminarTipoDocumento(this)">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  ` 
});

document.getElementById('agregar_tipo_seguro').addEventListener('click', (e) => {
  document.getElementById('tipo_seguro').innerHTML += `
    <div class="form-group d-flex mt-3">
      <input type="text" class="tipo_seguro form-control" name="tipo_seguro" placeholder="Tipo de seguro">
      <button class="btn btn-danger ml-1" onclick="eliminarTipoSeguro(this)">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  ` 
});

document.getElementById('agregar_tipo_cita').addEventListener('click', (e) => {
  document.getElementById('tipo_cita').innerHTML += `
    <div class="form-group d-flex mt-3">
      <input type="text" class="tipo_cita form-control" name="tipo_cita" placeholder="Tipo de cita">
      <button class="btn btn-danger ml-1" onclick="eliminarTipoCita(this)">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  ` 
});

document.getElementById('agregar_sexo').addEventListener('click', (e) => {
  document.getElementById('sexo').innerHTML += `
    <div class="form-group d-flex mt-3">
      <input type="text" class="sexo form-control" name="sexo" placeholder="Sexo">
      <button class="btn btn-danger ml-1" onclick="eliminarSexo(this)">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  ` 
});
//
document.getElementById('agregar_estado_civil').addEventListener('click', (e) => {
  document.getElementById('estado_civil').innerHTML += `
    <div class="form-group d-flex mt-3">
      <input type="text" class="estado_civil form-control" name="estado_civil" placeholder="Estado civil">
      <button class="btn btn-danger ml-1" onclick="eliminarEstadoCivil(this)">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  ` 
});

document.getElementById('agregar_estado_cita').addEventListener('click', (e) => {
  document.getElementById('estado_cita').innerHTML += `
    <div class="form-group d-flex mt-3">
      <input type="text" class="estado_cita form-control" name="estado_cita" placeholder="Estado de cita">
      <button class="btn btn-danger ml-1" onclick="eliminarEstadoCita(this)">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  ` 
});


function eliminarTipoDocumento(e) {
  e.parentNode.remove()
};

function eliminarTipoSeguro(e) {
  e.parentNode.remove()
}

function eliminarTipoCita(e) {
  e.parentNode.remove()
}

function eliminarSexo(e) {
  e.parentNode.remove()
}

function eliminarEstadoCivil(e) {
  e.parentNode.remove()
}

function eliminarEstadoCita(e) {
  e.parentNode.remove()
}

document.getElementById('guardar_cambios').addEventListener('click', (e) => {
  let tipo_documento = [];
  $('.tipo_documento').map(function (item) {
    tipo_documento.push(this.value);
  });
  tipo_documento = tipo_documento.filter((item, index) => tipo_documento.indexOf(item) === index);

  let tipo_seguro = [];
  $('.tipo_seguro').map(function (item) {
    tipo_seguro.push(this.value);
  });
  tipo_seguro = tipo_seguro.filter((item, index) => tipo_seguro.indexOf(item) === index);

  let tipo_cita = [];
  $('.tipo_cita').map(function (item) {
    tipo_cita.push(this.value);
  });
  tipo_cita = tipo_cita.filter((item, index) => tipo_cita.indexOf(item) === index);

  let sexo = [];
  $('.sexo').map(function (item) {
    sexo.push(this.value);
  });
  sexo = sexo.filter((item, index) => sexo.indexOf(item) === index);

  let estado_civil = [];
  $('.estado_civil').map(function (item) {
    estado_civil.push(this.value);
  });
  estado_civil = estado_civil.filter((item, index) => estado_civil.indexOf(item) === index);

  let estado_cita = [];
  $('.estado_cita').map(function (item) {
    estado_cita.push(this.value);
  });
  estado_cita = estado_cita.filter((item, index) => estado_cita.indexOf(item) === index);

  $.ajax({
    url: '/admin-clinica',
    type: 'PUT',
    data: {
      tipo_documento,
      tipo_seguro,
      tipo_cita,
      sexo,
      estado_civil,
      estado_cita
    },
    success: function (data) {
      if (data.ok) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Cambios guardados',
          showConfirmButton: false,
          timer: 1500
        });
        for (let i = 0; i < data.data.length; i++) {
          // console.log(data.data[i].resi)
          if (data.data[i].result !== 1) {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: `Error al guardar cambios de ${data.data[i].campo}`,
              showConfirmButton: false,
              timer: 1500,
              toast: true
            });
            break;
          }
        }
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error al guardar cambios',
          showConfirmButton: false,
          timer: 1500
        });
      }
    },
    error: function (err) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error al guardar cambios',
        showConfirmButton: false,
        timer: 1500
      });
    }
  })
});