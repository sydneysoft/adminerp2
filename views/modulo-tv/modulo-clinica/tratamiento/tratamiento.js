
const paciente = document.getElementById('paciente');
const nombre = document.getElementById('nombre');
const dosis = document.getElementById('dosis');
const inicio_tratamiento = document.getElementById('inicio_tratamiento');
const fin_tratamiento = document.getElementById('fin_tratamiento');
const descripcion_corta = document.getElementById('descripcion_corta');
const costo_tratamiento = document.getElementById('costo_tratamiento');
const duracion = document.getElementById('duracion');
const codigoexterno = document.getElementById('codigoexterno');
const descripcion_larga = document.getElementById('descripcion_larga');
const resultado = document.getElementById('resultado');
const imagen = document.getElementById('imagen'); // Se paso a la vista de subir imagen
const sede = document.getElementById('sede');
const sintomas = document.getElementById('sintomas');
const estado = document.getElementById('estado');

const pacienteEditar = document.getElementById('pacienteEditar');
const nombreEditar = document.getElementById('nombreEditar');
const dosisEditar = document.getElementById('dosisEditar');
const inicio_tratamientoEditar = document.getElementById('inicio_tratamientoEditar');
const fin_tratamientoEditar = document.getElementById('fin_tratamientoEditar');
const descripcion_cortaEditar = document.getElementById('descripcion_cortaEditar');
const costo_tratamientoEditar = document.getElementById('costo_tratamientoEditar');
const duracionEditar = document.getElementById('duracionEditar');
const codigoexternoEditar = document.getElementById('codigoexternoEditar');
const descripcion_largaEditar = document.getElementById('descripcion_largaEditar');
const resultadoEditar = document.getElementById('resultadoEditar');
const imagenEditar = document.getElementById('imagenEditar'); // Se paso a la vista de subir imagen
const sedeEditar = document.getElementById('sedeEditar');
const sintomasEditar = document.getElementById('sintomasEditar');
const idTratamiento = document.getElementById('idTratamiento');
const estadoEditar = document.getElementById('estadoEditar');

let tablaTratamiento;
addEventListener('DOMContentLoaded', () => {
  tablaTratamiento = $("#dataTable").DataTable({
    fnCreatedRow: function (nRow, aData, iDataIndex) {
      $(nRow).attr('id', `delete${aData.ID}`);
    },
    responsive: true,
    autoWidth: false,
    deferRender: true,
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json",
    },
    columns: [
      { data: "ID" },
      { data: "Nombre" },
      { data: "Paciente" },
      { data: "Dosis" },
      { data: "Estado" },
      {
        data: "Acciones",
        render: function (data, type, row) {
          const tratamiento = JSON.parse(data);
          return `<button type="button" class="btn btn-primary btn-sm" onclick='editarTratamiento(${data})'>Editar</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="beforeDeleteItem('/admin-clinica/tratamiento/items/${tratamiento.id}',${tratamiento.id})">Eliminar</button>`
        }
      },
    ]
  });
  getTableData();
});

function getTableData() {
  tablaTratamiento.clear().draw();
  $.ajax({
    method: "GET",
    url: "/admin-clinica/tratamiento/datatable",
    success: function (response) {
      if (response.ok) {
        response.data.forEach(tratamiento => {
          tablaTratamiento.row.add({
            "ID": tratamiento.id,
            "Nombre": tratamiento.nombre_tratamiento,
            "Paciente": tratamiento.paciente.nombre,
            "Dosis": tratamiento.dosis,
            "Estado": tratamiento.estado,
            "Acciones": JSON.stringify(tratamiento)
          }).draw();
        });
      }
    },
    error: function (error) {
      console.log(error);
    }
  })
}

document.getElementById('nuevoTratamiento').addEventListener('click', function () {
  $(".imagen_").empty();
  if (imagen.value !== '') {
    $('.imagen_').append(
      `<img class="image-item-galeria-photo" src="${imagen.value}"/>`
    );
  }
  $("#nuevoTratamientoModal").modal("show");
});




function formClear() {
  paciente.value = '';
  nombre.value = '';
  dosis.value = '';
  inicio_tratamiento.value = '';
  fin_tratamiento.value = '';
  descripcion_corta.value = '';
  costo_tratamiento.value = '';
  duracion.value = '';
  codigoexterno.value = '';
  descripcion_larga.value = '';
  resultado.value = '';
  imagen.value = '';
  sede.value = '';
  sintomas.value = '';
}

document.getElementById('guardarTratamiento').addEventListener('click', function () {
  if (paciente.value !== '' && nombre.value !== '' && dosis.value !== '' && inicio_tratamiento.value !== '' && fin_tratamiento.value !== '' && duracion.value !== '') {
    const data = {
      paciente_id: paciente.value,
      nombre_tratamiento: nombre.value,
      dosis: dosis.value,
      inicio_tratamiento: inicio_tratamiento.value,
      fin_tratamiento: fin_tratamiento.value,
      descripcion_corta: descripcion_corta.value,
      costo_tratamiento: costo_tratamiento.value,
      duracion: duracion.value,
      codigo_externo: codigoexterno.value,
      descripcion_larga: descripcion_larga.value,
      resultado: resultado.value,
      imagen: imagen.value,
      sede_id: sede.value,
      sintomas: sintomas.value,
      estado: estado.value
    };

    $.ajax({
      method: "POST",
      url: "/admin-clinica/tratamiento/items",
      data: data,
      success: function (response) {
        if (response.ok) {
          console.log(response);
          Swal.fire({
            icon: 'success',
            title: 'Tratamiento agregado',
            text: response.message,
            timer: 2000
          });
          data.id = response.id;
          tablaTratamiento.row.add({
            "ID": response.id,
            "Nombre": data.nombre_tratamiento,
            "Paciente": paciente.options[paciente.options.selectedIndex].text,
            "Dosis": data.dosis,
            "Estado": data.estado,
            "Acciones": JSON.stringify(data)
          }).draw();
          $("#nuevoTratamientoModal").modal("hide");
          formClear();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.message,
            timer: 2000
          });
        }
      },
      error: function (error) {
        if (error.responseJSON) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.responseJSON.msg,
            timer: 2000
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error al actualizar tratamiento',
            timer: 2000
          });
        }
      }
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Llene los campos obligatorios',
      timer: 2000
    })
  }

});

document.getElementById('actualizarTratamiento').addEventListener('click', function () {
  updateTratamiento();
});
function updateTratamiento() {
  if (pacienteEditar.value !== '' && nombreEditar.value !== '' && dosisEditar.value !== '' && inicio_tratamientoEditar.value !== '' && fin_tratamientoEditar.value !== '' && duracionEditar.value !== '') {
    const data = {
      paciente_id: pacienteEditar.value,
      nombre_tratamiento: nombreEditar.value,
      dosis: dosisEditar.value,
      inicio_tratamiento: inicio_tratamientoEditar.value,
      fin_tratamiento: fin_tratamientoEditar.value,
      descripcion_corta: descripcion_cortaEditar.value,
      costo_tratamiento: costo_tratamientoEditar.value,
      duracion: duracionEditar.value,
      codigo_externo: codigoexternoEditar.value,
      descripcion_larga: descripcion_largaEditar.value,
      resultado: resultadoEditar.value,
      imagen: imagenEditar.value,
      sede_id: sedeEditar.value,
      sintomas: sintomasEditar.value,
      estado: estadoEditar.value
    };

    $.ajax({
      method: "PUT",
      url: "/admin-clinica/tratamiento/items/" + idTratamiento.value,
      data: data,
      success: function (response) {
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Tratamiento actualizado',
            text: response.message,
            timer: 2000
          });
          tablaTratamiento.row(`#delete${idTratamiento.value}`).remove().draw();
          tablaTratamiento.row.add({
            "ID": idTratamiento.value,
            "Nombre": data.nombre_tratamiento,
            "Paciente": pacienteEditar.options[pacienteEditar.options.selectedIndex].text,
            "Dosis": data.dosis,
            "Estado": data.estado,
            "Acciones": JSON.stringify(data)
          }).draw();
          $("#editarTratamientoModal").modal("hide");
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.message,
            timer: 2000
          });
        }
      },
      error: function (error) {
        if (error.responseJSON) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.responseJSON.msg,
            timer: 2000
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error al actualizar tratamiento',
            timer: 2000
          });
        }
      }
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Llene los campos obligatorios',
      timer: 2000
    })
  }
}

function editarTratamiento(str) {
  const edite = JSON.parse(JSON.stringify(str));
  console.log(edite)
  idTratamiento.value = edite.id;
  pacienteEditar.value = edite.paciente_id;
  nombreEditar.value = edite.nombre_tratamiento;
  dosisEditar.value = edite.dosis;
  inicio_tratamientoEditar.value = moment(edite.inicio_tratamiento).format('YYYY-MM-DD');
  fin_tratamientoEditar.value = moment(edite.fin_tratamiento).format('YYYY-MM-DD');
  descripcion_cortaEditar.value = edite.descripcion_corta;
  costo_tratamientoEditar.value = edite.costo_tratamiento;
  duracionEditar.value = edite.duracion;
  codigoexternoEditar.value = edite.codigo_externo;
  descripcion_largaEditar.value = edite.descripcion_larga;
  resultadoEditar.value = edite.resultado;
  imagenEditar.value = edite.imagen;
  sedeEditar.value = edite.sede_id;
  sintomasEditar.value = edite.sintomas;
  estadoEditar.value = edite.estado;
  $(".imagen_").empty();
  $('.imagen_').append(
    `<img class="image-item-galeria-photo" src="${imagenEditar.value}"/>`
  );
  $("#editarTratamientoModal").modal("show");
};