let tablaSocial;
addEventListener('DOMContentLoaded', () => {
  tablaSocial = $('#redes_sociales').DataTable({
    fnCreatedRow: function (nRow, aData, iDataIndex) {
      $(nRow).attr('data-id', `delete${aData.id}`);
    },
    columns: [
      { data: 'ID' },
      { data: 'Correo Cliente'},
      { data: 'Nombre Empresa' },
      { data: 'Correo Empresa'},
      { 
        data: 'Acciones',
        render: function (data, type, row) {
          return `<a class="btn btn-info btn-sm" data-id="${row.ID}" href="/admin-redes-sociales/empresa/${row.ID}">Editar</a>`;
        }
      }
    ]
  });
  obtenerDatos()
});


// Get data from /admin-redes-sociales/datatable with ajax and processces it with DataTables
function obtenerDatos() {
  $.ajax({
    url: '/admin-redes-sociales/datatable',
    method: 'GET',
    success: function (data) {

      if (data.ok && Array.isArray(data.data)) {
        console.log(data);
        tablaSocial.clear();
        let auxData = []
        data.data.forEach(empresa => {
          console.log(empresa)
          auxData.push({
            "ID": empresa.id,
            "Correo Cliente": empresa.correo,
            "Nombre Empresa": empresa.empresa.nombre,
            "Correo Empresa": empresa.empresa.email_corporativo,
          })
        });
        tablaSocial.rows.add(auxData);
        tablaSocial.draw();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrio un error al obtener los datos.'
        })
      }
    },
    error: function (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrio un error al obtener los datos.'
      })
    }
  });
}