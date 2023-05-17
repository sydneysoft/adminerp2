const clonar = (val) => {
  Swal.fire({
    title: "¿Desear clonar el producto?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Clonar!",
  }).then((result) => {
    if (result.isConfirmed) {

      accionClonarCotizacion(val);
    }
  });
};

const accionClonarCotizacion = (val) => {
  Swal.showLoading();

  $.ajax({
    method: "GET",
    url: "/cotizaciones/data/" + val,

    success: async function (data) {

      Swal.close();
      let titulo_cotizacion = data.cotizacion[0].titulo_cotizacion,
        cliente_nombre = data.cotizacion[0].cliente_nombre,
        cliente_email = data.cotizacion[0].cliente_email,
        fecha_vencimiento = data.cotizacion[0].fecha_vencimiento,
        servicios_cotizados = data.detalle,
        terminos_pago = data.cotizacion[0].terminos_pago,
        nota_comentarios = data.cotizacion[0].nota_comentarios,
        nota_terminos = data.cotizacion[0].nota_terminos,
        subtotalGeneral = data.cotizacion[0].subtotalGeneral,
        impuestosGeneral = data.cotizacion[0].impuestosGeneral,
        descuento = data.cotizacion[0].descuento,
        descuento_porcentaje = data.cotizacion[0].descuento_porcentaje,
        totalGeneral = data.cotizacion[0].totalGeneral;

      await fetch(`/cotizaciones/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo_cotizacion,
          cliente_nombre,
          cliente_email,
          fecha_vencimiento,
          servicios_cotizados,
          terminos_pago,
          nota_comentarios,
          nota_terminos,
          subtotalGeneral,
          impuestosGeneral,
          descuento,
          descuento_porcentaje,
          totalGeneral,
        }),
      })
        .then((data) => data.json())
        .then((res) => (location.href = `/cotizaciones/detalle/${res.data}`));
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
