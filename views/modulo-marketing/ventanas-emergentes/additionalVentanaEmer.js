
//Agregar Nueva Ventana Emergenete
const AgregarVentanaEmergenteAdmin = (token) => {

    let imagen = $("#imagen-data-banner").attr("src");
    let url = $("#urlNuevo-ventanas-admin").val();
    let estado = $("#activadoNuevo-ventanas-admin").val();
   
    if (imagen && url && estado) {
        Swal.showLoading();
      
        $.ajax({
            method: "POST",
            url: "/admin-ventanas-emergentes",
            dataType: "json",
            data: {

                imagen: imagen,
                url: url,
                estado: estado,
                empresa_id: token
            },

            success: function (data) {
         
                if (data.status === "success") {
                    Swal.close();
                    $("#SelectImageFrame").modal("hide");
                    window.location.reload(true);
                } else {
                    Swal.close();
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        html: "<b>No se pudo agregar la Ventana Emergente.</b>",
                        showConfirmButton: false,
                        timer: 3500,
                    });
                }
            },
            error: function () {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    html: "<b>Ocurrió un error interno inténtalo más tarde.</b>",
                    showConfirmButton: false,
                    timer: 3500,
                });
            },
        });
    } else {
        Swal.fire({
            position: "center",
            icon: "info",
            html: "<b>Debes completar el formulario.</b>",
            showConfirmButton: false,
            timer: 2500,
        });
    }
};

//Manejar Datos al Modal
const handlingEditVentanaAdmin = (id, url, imagen, estado) => {
    typeOperation = "2";
    $("#data-id-ventanas").val(id);
    $("#urlEditar-ventantas-admin").val(url);
    $("#imagen-data-banner-editar").attr("src", imagen);
    $("#activadoEditar-ventanas-admin").val(estado);
    $("#editarBannerAdministrador").modal("show");
};

//Actualizar Datos de la Ventana Emergente
const updateVentanaAdmin = (token) => {
    let id = $("#data-id-ventanas").val();
    let url = $("#urlEditar-ventantas-admin").val();
    let imagen = $("#imagen-data-banner-editar").attr("src");
    let estado = $("#activadoEditar-ventanas-admin").val();
    if (id && url && imagen && estado) {
        Swal.showLoading();
        $.ajax({
            method: "POST",
            url: "/admin-ventanas-emergentes",
            dataType: "json",
            data: { id: id, imagen: imagen, url: url, estado: estado, empresa_id: token },
            success: function (data) {
                if (data.status === "success") {
                    Swal.close();
                    $("#SelectImageFrame").modal("hide");
                    window.location.reload(true);
                } else {
                    Swal.close();
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        html: "<b>No se pudo agregar la Ventana Emergente.</b>",
                        showConfirmButton: false,
                        timer: 3500,
                    });
                }
            },
            error: function () {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    html: "<b>Ocurrió un error interno inténtalo más tarde.</b>",
                    showConfirmButton: false,
                    timer: 3500,
                });
            },
        });
    } else {
        Swal.fire({
            position: "center",
            icon: "info",
            html: "<b>Debes completar el formulario para actualizar el registro.</b>",
            showConfirmButton: false,
            timer: 2500,
        });
    }
};

//Eliminar Ventanas Emergentes Admin
const deleteVentanasAdminPanel = (val) => {
    Swal.fire({
        title: "Estás Seguro?",
        text: "No podras revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar!",
    }).then((result) => {
        if (result.isConfirmed) {
            handleDeleteVentanasAdmin(val);
        }
    });
};

const handleDeleteVentanasAdmin = (val) => {
    Swal.showLoading();
    $.ajax({
        method: "DELETE",
        url: "/admin-ventanas-emergentes",
        dataType: "json",
        data: { id: val },
        success: function (data) {
            if (data.status === "success") {
                Swal.close();
                window.location.reload(true);
            } else {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Ocurrió un error interno inténtalo más tarde.",
                    showConfirmButton: false,
                    timer: 2500,
                });
            }
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