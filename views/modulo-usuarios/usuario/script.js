function validarActualizacion(id) {
    let nombreEmpresa = $('#nombre').val();
    let categorias = $('#categoria').val();
    let email = $('#email').val();
    let password = $('#password').val();
    let datos;


    if (nombreEmpresa && email && categorias) {
        if (!password) {
            datos = { nombre_empresa: nombreEmpresa, contrasena: password, correo_electronico: email }
        } else {
            datos = { nombre_empresa: nombreEmpresa, correo_electronico: email }
        }
        Swal.showLoading();

        $.ajax({
            method: "PUT",
            url: "/usuario/datos/"+ id,
            dataType: "json",
            data: datos,

            success: function (data) {


                Swal.close();
                if (data.status == "error") {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: data.msg,
                        showConfirmButton: false,
                        timer: 2500
                    });
                } else {
           
                    categorias.map((val, key) =>
                        $.ajax({
                            method: "POST",
                            url: "/usuario/categoria/"+ id,
                            dataType: "json",
                            data: { empresa_id: id, categoria: val }
                        }))

          
                   
                }
            },
            error: function (err) {
                console.log(err.status)
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
                    console.log("error", err)
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
                    location.reload();
                }


            }




        })
    }
}