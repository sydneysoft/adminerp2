$(function () {
  // $("#cliente")
  //   .select2()
  //   .on("select2:open", () => {
  //     $(".select2-results:not(:has(a))").append(
  //       '<a href="#" style="padding: 6px;height: 20px;display: inline-table;" onclick="clientesAgregar()">Crea nuevo cliente</a>'
  //     );
  //   });

  // $("#cliente, .servicios, .impuesto, impuesto2").select2({
  //   language: {
  //     noResults: function () {
  //       return "No se han encontrado resultados";
  //     },
  //   },
  // });
  // $(".seleccionar").select2({
  //   language: {
  //     noResults: function () {
  //       return "No se han encontrado resultados";
  //     },
  //   },
  // });
});

function clientesAgregar() {
  $("#cliente").select2("close");
  $("#gestionarCliente").modal("show");
}

function editarClientes() {
  $("#revisionClientes").modal("show");
}
function agregarServicios() {
  $(".servicios").select2("close");
  $("#agregarServicio").modal("show");
}
function agregarImpuesto() {
  $(".impuesto, .impuesto2").select2("close");
  $("#agregarImpuesto").modal("show");
}

// const validateEmail =
//   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// valid email pattern
const validateEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// Valida que este lleno el nombre y el email
$(function () {
  let buttonCargar = $("#add-customer-modal-btn");
  buttonCargar.attr("disabled", true);

  $("#nombreCliente, #emailCliente").on("input change", function () {
    if (
      $("#nombreCliente").val() != "" &&
      validateEmail.test($("#emailCliente").val())
    ) {
      buttonCargar.attr("disabled", false);
    } else {
      buttonCargar.attr("disabled", true);
    }
  });

  let buttonService = $("#add-service-modal-btn");
  buttonService.attr("disabled", true);
  $("#nombreServicio").on("input change", function () {
    if ($("#nombreServicio").val() != "") {
      buttonService.attr("disabled", false);
    } else {
      buttonService.attr("disabled", true);
    }
  });
});


const closeWindows = () => {
  // window.location.reload();
};

// $(".servicios")
  // .on("select2:open", () => {
  //   $(".select2-results:not(:has(a))").append(
  //     '<a href="#" style="padding: 6px;height: 20px;display: inline-table;" onclick="agregarServicios()">Crea nuevo producto/servicio</a>'
  //   );
  // });
// $(".impuesto, .impuesto2")
//   .select2()
//   .on("select2:open", () => {
//     $(".select2-results:not(:has(a))").append(
//       '<a href="#" style="padding: 6px;height: 20px;display: inline-table;" onclick="agregarImpuesto()">Añadir</a>'
//     );
//   });

$("table")
  .on("change keyup", ".servicios", function () {
    // let description = $(this).children("option:selected").attr("data-desc");
    // let price = $(this).children("option:selected").attr("data-price");
    let description = "";
    let price = "";
    if ($(this).children("option:selected").data()) {
      description = $(this).children("option:selected").data().data.descripcion;
      price = $(this).children("option:selected").data().data.precio;
    }
    $(this).closest("tr").find(".descripcion").val(description);
    $(this).closest("tr").find(".precio").val(price);
  })
  .keyup();

$("table").on("click", ".agregaNuevo", function () {
  $(".servicios,.impuesto, .impuesto2").select2("destroy");
  let tr = $(this).closest(".rowAgregaServicio");
  let clone = tr.clone();
  tr.after(clone);
  initProductoServicioSelect2();
  initImpuestosSelect2();
  clone.find(".items").select2("val", "");
  clone.find(".impuesto").select2("val", "");
  clone.find(".impuesto2").select2("val", "");
  clone.find("input").val("");
});

const cargarServicio = (base) => {
  let clone = $(".rowAgregaServicio:first").clone();
  clone.find(".total").empty();
  clone.find(".impuestoTotal").empty();
  clone.find("span").remove();
  clone.find("select").select2();

  clone.appendTo(`#${base}`);
  $(".servicios")
    .on("select2:open", () => {
      $(".select2-results:not(:has(a))").append(
        '<a href="#" style="padding: 6px;height: 20px;display: inline-table;" onclick="agregarServicios()">Crea nuevo producto/servicio</a>'
      );
    });

  clone.find("input").val("");
  clone.find("select").val(null).trigger("change");
};

function updateCol() {
  let tr = $(this).parent().parent();

  let valorPrecio = tr.find(".precio").val();
  let valorCantidad = tr.find(".cantidad").val();
  const impuesto1 = tr.find(".impuesto").val();
  const impuesto2 = tr.find(".impuesto2").val();

  let subtotalSinImpuesto = valorPrecio * valorCantidad;
  let impuestos =
    subtotalSinImpuesto * (impuesto1 / 100) +
    subtotalSinImpuesto * (impuesto2 / 100);

  let impuestoTotal = impuestos;
  tr.find(".impuestoTotal").val(impuestoTotal.toFixed(2));

  let total = parseFloat(subtotalSinImpuesto);
  tr.find(".total").val(total);

  let sum = 0;
  $(".total").each(function () {
    sum += parseFloat($(this).val() ? $(this).val() : 0);
  });
  $("#subtotal").html(sum);

  let sumImpuesto = 0;
  $(".impuestoTotal").each(function () {
    sumImpuesto += parseFloat($(this).val() ? $(this).val() : 0);
  });
  $("#subtotalImpuestos").html(sumImpuesto);

  let totalGeneral = sum + sumImpuesto;

  $("#totalGeneral").html(totalGeneral);
}

$(function () {

  updateCol();
});

$(document).on(
  "input change",
  ".precio, .cantidad, .impuesto, .impuesto2",
  descuento
);
$(document).on(
  "input change",
  ".precio, .cantidad, .impuesto, .impuesto2",
  updateCol
);

$(document).on("click", "#remove", updateCol);
$(document).on("input change", ".descuento", descuento);
$(function () {
  $("#nuevaCotizacion").on("click", "#remove", function () {
    $(this).closest("tr").remove();
    updateCol;
  });
});

function descuento() {
  let sum = 0;
  $(".total").each(function () {
    sum += parseFloat($(this).val() ? $(this).val() : 0);
  });
  const subtotal_sin_descuento = sum;

  let sumImpuesto = 0;
  $(".impuestoTotal").each(function () {
    sumImpuesto += parseFloat($(this).val() ? $(this).val() : 0);
  });

  const subtotal_impuesto = sumImpuesto;

  let descuento_porc = $("#descuento").val();

  let totalDescuento = 0;
  if (descuento_porc > 0 || descuento_porc != null) {
    let subtotal_descuento = subtotal_sin_descuento * (descuento_porc / 100);
    totalDescuento = parseFloat(subtotal_descuento);

    $("#descuentoSubtotal").html(totalDescuento.toFixed(2));

    let subtotal_impuesto_descuento =
      subtotal_impuesto - subtotal_impuesto * (descuento_porc / 100);

    $("#subtotalImpuestos").html(subtotal_impuesto_descuento.toFixed(2));

    let totalGeneralDesc =
      subtotal_sin_descuento - totalDescuento + subtotal_impuesto_descuento;
    totalGeneralDesc ? totalGeneralDesc.toFixed(2) : 0;
    $("#totalGeneral").html(totalGeneralDesc.toFixed(2));
  } else {
    $("#subtotalImpuestos").html(subtotal_impuesto);

    let totalGeneral = subtotal_sin_descuento + subtotal_impuesto;

    $("#totalGeneral").html(totalGeneral);
  }
}

//edicion producto eliminar almacen

$("#terminos").change(function () {
  if ($(this).val() === "personalizado") {
    $("#nuevosTerminos").show();
  } else {
    $("#nuevosTerminos").hide();
  }
});
//- CHANGE STEP
$('button[data-action="change-step"]').click(function (e) {
  const steps = Array.from(document.querySelectorAll(".step"));

  const [stepActive] = steps.filter((step) =>
    step.classList.contains("step-active")
  );
  const [stepHidden] = steps.filter((step) =>
    step.classList.contains("hidden")
  );

  stepActive.classList.remove("step-active");
  stepActive.classList.add("hidden");

  stepHidden.classList.remove("hidden");
  stepHidden.classList.add("step-active");
});


$("#tabla-todosClientes").DataTable({
  pageLength: 7,
  language: {
    url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
  },
});

$("#tabla-todosClientes").on("click", "#deleteCustomer", function () {
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

const seleccionaProductoNuevo = async () => {

  let valorEmpresa = $("#empresa").val();
  $(".servicios").empty();
  $("#cliente").empty();
  $(".impuesto").empty();
  $(".impuesto2").empty();

  // if (valorEmpresa == null || valorEmpresa == "") {
  //   valorEmpresa = 0
  // }
  if (valorEmpresa != '') {
    $(".servicios").attr("disabled", false);
    $("#cliente").attr("disabled", false);
    $(".impuesto").attr("disabled", false);
    $(".impuesto2").attr("disabled", false);
  } else {
    $(".servicios").attr("disabled", true);
    $("#cliente").attr("disabled", true);
    $(".impuesto").attr("disabled", true);
    $(".impuesto2").attr("disabled", true);
  }

  // if (valorEmpresa != "") {
  //   $.ajax({
  //     method: "GET",
  //     url: `/producto-admin-empresa/${valorEmpresa}`,
  //     dataType: "json",
  //     success: function (data) {
  //       if (data.sucess == true) {
  //         let productos = data.productos;
  //         let servicios = data.servicios;
  //         let impuestos = data.impuestos;
  //         let clientes = data.clientes;

  //         let product_services = [...servicios, ...productos];
  //         product_services = product_services.map((i) => ({
  //           name: i.name,
  //           description: i.description,
  //           price: i.precio
  //         }))

  //         if (product_services.length > 0) {
  //           $(".servicios").append(
  //             '<option value="">Selecciona producto</option>'
  //           );

  //           for (let i = 0; product_services.length > i; i++) {
  //             $(".servicios").append(
  //               '<option value="' + product_services[i].name + '"  data-desc="' + product_services[i].description + '"  data-price="' + product_services[i].precio + '">' + product_services[i].name + '</option>'
  //             );
  //           }
            
  //         } else {
  //           $(".servicios").append(
  //             '<option value="0">No se encontraron</option>'
  //           );
            // $(".servicios").attr("disabled", true);
  //         }

  //         if (clientes.length > 0) {
  //           // $("#cliente").append(
  //           //   '<option value="">Selecciona cliente</option>'
  //           // );

  //           // for (let i = 0; clientes.length > i; i++) {
  //           //   $("#cliente").append(
  //           //     '<option value="' + clientes[i].email + '"  data-value="' + clientes[i].nombre + '">' + clientes[i].nombre + " | " + clientes[i].email + '</option>'
  //           //   );
  //           // }
            
  //         } else {
  //           // $("#cliente").append(
  //           //   '<option value="0">No se encontraron</option>'
  //           // );
  //           $("#cliente").attr("disabled", false);
  //         }


  //         if (impuestos.length > 0) {
  //           $(".impuesto").append(
  //             '<option value="">Selecciona</option>'
  //           );
  //           $(".impuesto2").append(
  //             '<option value="">Selecciona</option>'
  //           );

  //           for (let i = 0; impuestos.length > i; i++) {
  //             $(".impuesto").append(
  //               '<option value="' + impuestos[i].tasa + '"  data-desc="' + impuestos[i].nombre + '">' + impuestos[i].nombre + '</option>'
  //             );
  //             $(".impuesto2").append(
  //               '<option value="' + impuestos[i].tasa + '"  data-desc="' + impuestos[i].nombre + '">' + impuestos[i].nombre + '</option>'
  //             );
  //           }
            
  //         } else {
  //           $(".impuesto").append(
  //             '<option value="0">No se encontraron</option>'
  //           );
  //           $(".impuesto").attr("disabled", false);
  //           $(".impuesto2").append(
  //             '<option value="0">No se encontraron</option>'
  //           );
  //           $(".impuesto2").attr("disabled", false);
  //         }

  //       }
  //     },
  //     error: function (e) {

  //     },
  //   });
  // } else {
  //   $(".servicios").attr("disabled", false);
  //   $(".impuesto").attr("disabled", false);
  //   $(".impuesto2").attr("disabled", false);


  // }
};


const seleccionaProductoEditar = () => {
  // let valorEmpresa = $("#empresaEdit").val();

  // $(".servicios").empty();
  // $("#cliente").empty();
  // $(".impuesto").empty();
  // $(".impuesto2").empty();

  // typeUpdate = 2;
  // if (valorEmpresa != "") {
  //   $.ajax({
  //     method: "GET",
  //     url: `/producto-admin-empresa/${valorEmpresa}`,
  //     dataType: "json",

  //     success: function (data) {
  //       if (data.sucess == true) {
  //         let productos = data.productos;
  //         let servicios = data.servicios;
  //         let impuestos = data.impuestos;
  //         let clientes = data.clientes;


  //         let product_services = [...servicios, ...productos];
  //         product_services = product_services.map((i) => ({
  //           name: i.name,
  //           description: i.description,
  //           price: i.precio
  //         }))

  //         if (product_services.length > 0) {
  //           $(".servicios").append(
  //             '<option value="">Selecciona producto</option>'
  //           );

  //           for (let i = 0; product_services.length > i; i++) {
  //             $(".servicios").append(
  //               '<option value="' + product_services[i].name + '"  data-desc="' + product_services[i].description + '"  data-price="' + product_services[i].precio + '">' + product_services[i].name + '</option>'
  //             );
  //           }
  //           $(".servicios").attr("disabled", false);
  //         } else {
  //           $(".servicios").append(
  //             '<option value="0">No se encontraron</option>'
  //           );
  //           $(".servicios").attr("disabled", true);
  //         }

  //         if (clientes.length > 0) {
  //           // $("#cliente").append(
  //           //   '<option value="">Selecciona cliente</option>'
  //           // );

  //           for (let i = 0; clientes.length > i; i++) {
  //             // $("#cliente").append(
  //             //   '<option value="' + clientes[i].email + '"  data-value="' + clientes[i].nombre + '">' + clientes[i].nombre + " | " + clientes[i].email + '</option>'
  //             // );
  //           }
  //           // $("#cliente").attr("disabled", false);
  //         } else {
  //           // $("#cliente").append(
  //           //   '<option value="0">No se encontraron</option>'
  //           // );
  //           // $("#cliente").attr("disabled", false);
  //         }


  //         if (impuestos.length > 0) {
  //           $(".impuesto").append(
  //             '<option value="">Selecciona</option>'
  //           );
  //           $(".impuesto2").append(
  //             '<option value="">Selecciona</option>'
  //           );

  //           for (let i = 0; impuestos.length > i; i++) {
  //             $(".impuesto").append(
  //               '<option value="' + impuestos[i].tasa + '"  data-desc="' + impuestos[i].nombre + '">' + impuestos[i].nombre + '</option>'
  //             );
  //             $(".impuesto2").append(
  //               '<option value="' + impuestos[i].tasa + '"  data-desc="' + impuestos[i].nombre + '">' + impuestos[i].nombre + '</option>'
  //             );
  //           }
  //           $(".impuesto").attr("disabled", false);
  //           $(".impuesto2").attr("disabled", false);
  //         } else {
  //           $(".impuesto").append(
  //             '<option value="0">No se encontraron</option>'
  //           );
  //           $(".impuesto").attr("disabled", false);
  //           $(".impuesto2").append(
  //             '<option value="0">No se encontraron</option>'
  //           );
  //           $(".impuesto2").attr("disabled", false);
  //         }

  //       }


  //     },
  //     error: function (e) {


  //     },
  //   });
  // } else {

  //   $(".servicios").append('<option value=""></option>');
  //   // $("#cliente").append('<option value=""></option>');
  //   $(".impuesto").append('<option value=""></option>');
  //   $(".impuesto2").append('<option value=""></option>');

  // }
};