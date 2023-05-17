const aceptada = async (id) => {
  Swal.fire({
    title: "¿Desear marcar aceptado el producto?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si",
  }).then(async (result) => {
    if (result.isConfirmed) {
      marcarAceptada(id);
    }
  });
};

const marcarAceptada = (id) => {
  Swal.showLoading();
  $.ajax({
    method: "GET",
    url: "/cotizaciones/aceptado/" + id,
    success: async function (data) {

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se aceptó el presupuesto",
        showConfirmButton: false,
        timer: 2500,
      }).then(() => window.location.reload(true));
    },
    error: function () {
      Swal.close();
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Ocurrió un error interno inténtalo más tarde.",
        showConfirmButton: false,
        timer: 2500,
      });
    },
  });
};

const facturada = async (id) => {
  Swal.fire({
    title: "¿Desear marcar como facturado?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si",
  }).then(async (result) => {
    if (result.isConfirmed) {
      $.ajax({
        method: "GET",
        url: "cotizaciones/facturado/" + id,
        success: async function (data) {
  
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Se ha marcado como facturado",
            showConfirmButton: false,
            timer: 2500,
          }).then(() => window.location.reload(true));
        },
        error: function () {
          Swal.close();
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Ocurrió un error interno inténtalo más tarde.",
            showConfirmButton: false,
            timer: 2500,
          });
        },
      });
    }
  });
};
