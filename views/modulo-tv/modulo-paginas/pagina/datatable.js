let tablaPagina;
$(document).ready( function () {
  tablaPagina = $('#dataTable').dataTable({
    fnCreatedRow: function (nRow, aData, iDataIndex) {
      $(nRow).attr('id', `delete${aData.ID}`);
    },
    columns: [
      { data: 'ID' },
      { data: 'Nombre' },
      { data: 'Estracto' },
      { 
        data: 'Acciones',
        render: function (data, type, row) {
          const item = JSON.parse(data);
          return `
          <a href="/admin-paginas/pagina/editar/${item.id}" class="btn btn-primary btn-sm">Editar</a>
          <a href="/admin-paginas/pagina/${item.id}" class="btn btn-warning btn-sm">Ver</a>
            <button type="button" class="btn btn-danger btn-sm" onclick="beforeDeleteItem('/admin-paginas/paginas/${item.id}', eliminarRowTable)">Eliminar</button>`;
        }
      }
    ]
  });
  obtenerDatosTabla()
});

function eliminarRowTable(data) {
  tablaPagina.fnDeleteRow($(`#${data.target}`));
}

function obtenerDatosTabla () {
  $.ajax({
    url: '/admin-paginas/datatable',
    type: 'GET',
    success: function (data) {
      if (data.ok) {
        let rowsTable = [];
        data.data.forEach((pagina, index) => {
          rowsTable.push({
            "ID": pagina.id,
            "Nombre": pagina.nombre,
            "Estracto": pagina.estracto,
            "Acciones": JSON.stringify(pagina)
          });
        });
        if(rowsTable.length > 0) {
          tablaPagina.fnClearTable();
          tablaPagina.fnAddData(rowsTable);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo salio mal!'
        })
      }
    },
    error: function (error) {
      console.log(error);
    }
  });
}