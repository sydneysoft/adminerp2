$(document).ready(function () {
    $.ajax({
        method: "GET",
        url: "/admin-metodos-facturacion-datos",
        dataType: "json",

        success: function (datos) {
            
            Swal.close();
            if (datos) {

                let data = datos.items.metodo
                $("#nubefact-token").val(data.token);
                $("#nubefact-ruta").val(data.ruta);


                if (data.estado == "2") {
                    co
                    $("#toggle-nubefact").bootstrapToggle("on");
                }

            }


        },
    })
});




//Guardar Datos de Facturación
const handleInvoiceMethod = (id) => {
    let token_nub = $("#nubefact-token").val();
    let ruta = $("#nubefact-ruta").val();
 
    let estado = document.getElementById("toggle-nubefact").checked;

    if (estado == true) {

        estado = "2";
    } else {
        estado = "1";
    }
    Swal.showLoading();
    $.ajax({
        method: "POST",
        url: "/admin-metodos-facturacion",
        dataType: "json",
        data: {
            nombre: "Nubefact", empresa_id: id, token: token_nub, ruta: ruta, estado: estado
        },
        success: function (data) {
            if (data.status == "success") {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    html: "<b>#{translation.ALERTS.CREDENTIALS_SUCCESS_UPDATE}</b>",
                    showConfirmButton: false,
                    timer: 2500,
                });
            } else {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    html: "<b>#{translation.ALERTS.WRONG}</b>",
                    showConfirmButton: false,
                    timer: 2500,
                });
            }
        },
        error: function (e) {
            console.log(e);
            Swal.close();
            Swal.fire({
                position: "center",
                icon: "error",
                html: "<b>#{translation.ALERTS.WRONG}</b>",
                showConfirmButton: false,
                timer: 2500,
            });
        },
    });
};