const nueva = () => {
  $("#guardar form").trigger("reset");
  // $("#guardarEmpresa form step-one").classList('step-active');

  $("#guardarProveedoreModal").modal("show");
};

const changeStep = () => {
  const steps = Array.from(document.querySelectorAll(".step"));
  const [stepActive] = steps.filter((step) =>
    step.classList.contains("step-active")
  );
  const [stepHidden] = steps.filter((step) =>
    step.classList.contains("hidden")
  );


  let nombre = $("#nombreProveedorNuevo").val();
  let email_corporativo = $("#correoCorporativoNuevo").val();
  let telefono_corporativo = $("#celularCorporativoNuevo").val();

  let ruc = $("#rucNuevo").val();

  let razon_social = $("#razonSocialNuevo").val();

  if (nombre != ""  & ruc != "" & razon_social != "" & email_corporativo != "" & telefono_corporativo!="") {

    stepActive.classList.remove("step-active");
    stepActive.classList.add("hidden");

    stepHidden.classList.remove("hidden");
    stepHidden.classList.add("step-active");
  } else {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Debes ingresar los datos requeridos para crear una empresa.",
      showConfirmButton: false,
      timer: 2500,
    });
  }
}

const changeStepEditar = () => {
  const steps = Array.from(document.querySelectorAll("#editarProveedoreModal .step"));
  const [stepActive] = steps.filter((step) =>
    step.classList.contains("step-active")
  );
  const [stepHidden] = steps.filter((step) =>
    step.classList.contains("hidden")
  );


  let nombre = $("#nombreProveedorNuevo-editar").val();
  let email_corporativo = $("#correoCorporativoNuevo-editar").val();
  let telefono_corporativo = $("#celularCorporativoNuevo-editar").val();

  let ruc = $("#rucNuevo-editar").val();

  let razon_social = $("#razonSocialNuevo-editar").val();
  if (nombre != ""  & ruc != "" & razon_social != "" & email_corporativo != "" & telefono_corporativo!="") {

    stepActive.classList.remove("step-active");
    stepActive.classList.add("hidden");

    stepHidden.classList.remove("hidden");
    stepHidden.classList.add("step-active");
  } else {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Debes ingresar los datos requeridos para crear una empresa.",
      showConfirmButton: false,
      timer: 2500,
    });
  }
}

var telefono_corporativo = document.querySelector("#celularCorporativoNuevo");
const telefono_corporativo_editar = document.querySelector("#celularCorporativoNuevo-editar");

var telefono_corporativo_obt = window.intlTelInput(telefono_corporativo, {
  hiddenInput: "full_number",
  nationalMode: false,
  formatOnDisplay: true,
  separateDialCode: true,
  autoHideDialCode: true,
  autoPlaceholder: "aggressive",
  placeholderNumberType: "MOBILE",
  initialCountry: "pe",
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.js",
});

const telefono_corporativo_obt_editar = window.intlTelInput(telefono_corporativo_editar, {
  hiddenInput: "full_number",
  nationalMode: false,
  formatOnDisplay: true,
  separateDialCode: true,
  autoHideDialCode: true,
  autoPlaceholder: "aggressive",
  placeholderNumberType: "MOBILE",
  initialCountry: "pe",
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.js",
});

var telefono_contacto = document.querySelector("#celularContactoNuevo");
const telefono_contacto_editar = document.querySelector("#celularContactoNuevo-editar");

var telefono_contacto_obt = window.intlTelInput(telefono_contacto, {
  hiddenInput: "full_number",
  nationalMode: false,
  formatOnDisplay: true,
  separateDialCode: true,
  autoHideDialCode: true,
  autoPlaceholder: "aggressive",
  placeholderNumberType: "MOBILE",
  initialCountry: "pe",
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.js",
});

const telefono_contacto_obt_editar = window.intlTelInput(telefono_contacto_editar, {
  hiddenInput: "full_number",
  nationalMode: false,
  formatOnDisplay: true,
  separateDialCode: true,
  autoHideDialCode: true,
  autoPlaceholder: "aggressive",
  placeholderNumberType: "MOBILE",
  initialCountry: "pe",
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.js",
});



$(document).ready(function () {
  table = $("#tabla").DataTable({
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
    },
  });
});
