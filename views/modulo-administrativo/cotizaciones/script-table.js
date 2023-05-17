$(document).ready(function () {
  $("#tabla-cotizaciones").DataTable({
    order: [[0, "desc"]],
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
    },
  });

  var tableFilter = $("#tabla-cotizaciones").dataTable();

  $("select#filtroEstado").change(function () {
    if (this.value != 0) {
      tableFilter.fnFilter(this.value, 5);
    } else {
      tableFilter.fnFilter("", 5);
      tableFilter.fnFilter("");
    }
  });
});
function openModalServicios() {
  $("#revisionServicios").modal("show");
}
function openModalImpuestos() {
  $("#revisionImpuestos").modal("show");
}
$("#filtroDias").change(function () {
  let value = $(this).val();

  switch (value) {
    case "30":
      $(".mes").show();
      $(".trimestre").hide();
      $(".anual").hide();
      break;
    case "90":
      $(".mes").hide();
      $(".trimestre").show();
      $(".anual").hide();
      break;
    case "360":
      $(".mes").hide();
      $(".trimestre").hide();
      $(".anual").show();
      break;
  }
});
$("#tabla-todosServicios").on("click", "#borraServicio", function () {
  Swal.fire({
    title: "Estás Seguro?",
    text: "No podras revertir esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Eliminar",
  }).then((result) => {
    let url = $(this).data("url");
    let id = $(this).data("id");
    if (result.isConfirmed) {
      Swal.showLoading();
      fetch(url + id, {
        method: "delete",
      }).then((data) => {
        if (data.status === 200) {
          $(this).closest("tr").remove();

          Swal.close();
        }
      });
    } else {
      Swal.close();
    }
  });
});
$("#tabla-todosServicios").DataTable({
  pageLength: 7,
  language: {
    url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
  },
});

$("#tabla-todosImpuestos").on("click", "#borraImpuesto", function () {
  Swal.fire({
    title: "Estás Seguro?",
    text: "No podras revertir esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Eliminar",
  }).then((result) => {
    let url = $(this).data("url");
    let id = $(this).data("id");
    if (result.isConfirmed) {
      Swal.showLoading();
      fetch(url + id, {
        method: "delete",
      }).then((data) => {
        if (data.status === 200) {
          $(this).closest("tr").remove();

          Swal.close();
        }
      });
    } else {
      Swal.close();
    }
  });
});
$("#tabla-todosImpuestos").DataTable({
  pageLength: 7,
  language: {
    url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
  },
});

const closeWindows = () => {
  window.location.reload();
};
