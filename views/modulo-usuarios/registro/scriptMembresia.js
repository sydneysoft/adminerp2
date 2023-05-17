const form = document.querySelector(".sign-up__form");
const inputs = document.querySelectorAll(".form__input");

var numero = document.querySelector("#telefono");

var whatsapp_corporativo_obt = window.intlTelInput(numero, {
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

function enviarFormulario(plan) {
    let nombreEmpresa = $('#nombre').val();
    let categorias = $('#categoria').val();
    let email = $('#email').val();
    let password = $('#password').val();
    let documento = $('#documento').val();
    let contacto = $('#contacto').val();
    const marketplace = $('#marketplace').val();
    let whatsapp_corporativo = whatsapp_corporativo_obt.getNumber();

    if (nombreEmpresa && password && email && categorias && documento) {
        Swal.showLoading();
        $.ajax({
            method: "POST",
            url: "/registro",
            dataType: "json",
            data: { nombre: nombreEmpresa, clave: password, correo: email, tipo_documento: "RUC", numero_documento: documento },
            success: function (data, status) {
                if (data.ok) {

                    let usuario_id = data.data.id
                    Swal.close();
                    if (status == "error") {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: data.msg,
                            showConfirmButton: false,
                            timer: 2500
                        });
                    } else {
                        $.ajax({
                            method: "POST",
                            url: "/registro/empresa",
                            dataType: "json",
                            data: { 
                                nombre: nombreEmpresa, email_corporativo: email, nombre_contacto: contacto, celular_contacto: whatsapp_corporativo, plan: plan,
                                categoria_id: marketplace
                            },
                            success: function (data) {
                                if (data.ok) {
                                    let empresa_id = data.data.id
                            
                                    $.ajax({
                                        method: "POST",
                                        url: "/registro/categoria",
                                        dataType: "json",
                                        data: { empresa_id: empresa_id, categoria: categorias },
                                    });
                                    $.ajax({
                                        method: "POST",
                                        url: "/registro/empresa-usuario",
                                        dataType: "json",
                                        data: { empresa_id: empresa_id, usuario_id: usuario_id }
                                    });
                                } else {
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'error',
                                        title: data.msg,
                                        showConfirmButton: false,
                                        timer: 2500
                                    });
                                }

                            },
                            error: function (err) {
                                console.error("Empresa error", err)
                            },
                        })

                    }
                }

            }, error: function (err) {

                if (err.status == 400) {
                    Swal.close();
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'El usuario ya fue registrado.',
                        showConfirmButton: false,
                        timer: 2500
                    });
                } else {

                    Swal.close();
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Ocurrió un error interno inténtalo más tarde.',
                        showConfirmButton: false,
                        timer: 2500
                    });
                }
            }, complete: function (data) {

                if (data.status === 200) {

                    // const url = "/usuario/" + data.responseJSON.id


                    //window.location.href = url
                }


            }




        })
    }
}

let v = $("#registro-form").validate({
    rules: {
        markeplatce: {
            required: true
        },
        nombre: {
            required: true
        },
        documento: {
            required: true
        },
        categoria: {
            required: true
        },
        email: {
            required: true,
            email: true
        },
        pswd: {
            required: true
        },
        bf_fullname: {
            required: true
        },
        phone: {
            required: true
        }

    },
    errorElement: "span",
    errorClass: "errorTxt",
    errorPlacement: function (error, element) {
        error.insertBefore(element);
    }
});

// jQuery.extend(jQuery.validator.messages, {
//     required: "El campo es requerido.",
//     email: "Por favor ingresa un correo válido",
//     phone: "Por favor ingrese telefono válido",
//     minlength: jQuery.validator.format("El campo Nº de doc debe tener al menos {0}  caracteres."),
// });

$(".next-btn1").click(function (e) {
    e.preventDefault();
    if (v.form()) {
        $(".tab-pane").hide();
        $("#step2").fadeIn(1000);
        $('.progressbar-dots').removeClass('active');
        $('.progressbar-dots:nth-child(3)').addClass('active');
    }
});
$(".next-btn2").click(function (e) {
    e.preventDefault();
    if (v.form()) {
        $(".tab-pane").hide();
        $("#step3").fadeIn(1000);
        $('.progressbar-dots').removeClass('active');
        $('.progressbar-dots:nth-child(5)').addClass('active');
    }
});

$(".submit-btn").click(function (e) {
    e.preventDefault();
    if (v.form()) {
        $("#loader").show();
        setTimeout(function () {
            $("#registro-form").html("<p>Su registro ha sido enviado. Pronto estaremos en contacto.</p>");
        }, 1000);
        return false;
    }
});

// clearInputs(inputs);
