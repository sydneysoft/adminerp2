const openModalEmail = (id, email) => {
  $("#asunto").val("Nueva cotización de Inkaland");
  $("#descripcionCortaNuevo").val(
    "Has recibido una nueva cotización de Inkaland. Haz clic en el botón abajo para ver, guardar o imprimir la cotización.\n"
  );

  $("#nuevo").attr("data-id", id);
  $("#nuevo").attr("data-email", email);
  $("#emailCliente").text(email);
 
 
  let button = `
    <button
      class="button btn btn-success nuevo"
      style=""
      type="button"
      id="enviaMails"
      onclick="enviarCorreo(${id})"
    >
      Enviar
    </button>
 `;
  $("#footer").empty().append(button);

  $("#nuevo").modal("show");
};

const enviarCorreo = (id) => {
  const asuntoNuevo = $("#asunto").val();
  const descripcionNuevo = $("#descripcionCortaNuevo").val();
  const email = $("#emailCliente").html();

  $.ajax({
    url: "/send-email",
    type: "POST",
    data: {
      asunto: asuntoNuevo,
      cuerpo: descripcionNuevo,
      to: email,
      id: id,
    },
    beforeSend: function () {
      $("#enviaMails").html("Enviando..");
    },
    success: function (data) {
      Swal.close();
      window.location.href = "/cotizaciones";
    },
    complete: function () {
      $("#enviaMails").html("Enviado!");
    },
    error: function (er) {
    
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
