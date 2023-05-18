const openModalNewRegion = () => {
    $("#nuevaRegionAdmin").modal("show");
};

const seleccionPais = () => {
    let paisSeleccionado = $("#nuevo-pais-regiones").val();

    $("#nuevo-distrito-regiones").empty();
    $("#nuevo-ciudad-regiones").empty();
    $.ajax({
        method: "GET",
        url: "admin-regiones/ciudades/" + paisSeleccionado,
        dataType: "json",

        success: function (data) {

            let ciudades = data.ciudades;

            if (ciudades.length > 0) {
              
                for (let i = 0; ciudades.length > i; i++) {
                    $("#nuevo-ciudad-regiones").append(
                        '<option value="' +
                        ciudades[i].CiudadID +
                        '">' +
                        ciudades[i].CiudadNombre + ", " + ciudades[i].CiudadDistrito +
                        "</option>"
                    );
                }
                $("#nuevo-ciudad-regiones").attr("disabled", false);

            } else {
                $("#nuevo-ciudad-regiones").append(
                    '<option value="">#{translation.CITIES_NOT_FOUND}</option>'
                );

                $("#nuevo-ciudad-regiones").attr("disabled", true);

            }
        }
    })
}



const AgregarRegionAdmin = (token) => {
    let nombreRegion = $("#nuevo-nombre-regiones").val();
    let ciudad = $("#nuevo-ciudad-regiones").val();

    let pais = $("#nuevo-pais-regiones").val();
    if (nombreRegion && pais) {

        Swal.showLoading();
        $.ajax({
            method: "POST",
            url: "/admin-regiones",
            dataType: "json",
            data: {
                empresa_id: token,
                nombre: nombreRegion,
                states: ciudad,
                pais: pais,
            },
            success: function (data) {
                if (data.status == "success") {
                    Swal.close();
                    window.location.reload(true);
                } else {
                    Swal.close();
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "#{translation.WRONG}",
                        showConfirmButton: false,
                        timer: 2500,
                    });
                }
            },
            error: function (e) {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "#{translation.WRONG}",
                    showConfirmButton: false,
                    timer: 2500,
                });
            },
        });
    } else {
        Swal.fire({
            position: "center",
            icon: "info",
            html: "<b>#{translation.MUST_COMPLETE_DATA_REQUIRED_ADD_SERVICES}</b>", 
            showConfirmButton: false,
            timer: 2500,
        });
    }
};

//Manejar Modal Editar Región

const handleEditRegion = (id, nombre, pais, id_grupo) => {

    $("#editar-id-region").val(id);
    $("#editar-nombre-regiones").val(nombre);
    $("#editar-pais-regiones").val(pais);
    $("#editar-ciudad-regiones").empty();

    let ids
    $.ajax({
        method: "GET",
        url: "admin-regiones/obtener-ciudades/" + id_grupo,
        dataType: "json",

        success: function (data) {
  
            let id = data.ciudades
              ids= id.map(i=>i.ciudadID)

        },
        complete: function () {
 
            $.ajax({
                method: "GET",
                url: "admin-regiones/ciudades/" + pais,
                dataType: "json",

                success: function (data) {

                    let ciudades = data.ciudades;

                    if (ciudades.length > 0) {
                      
                        for (let i = 0; ciudades.length > i; i++) {
                            $("#editar-ciudad-regiones").append(
                                '<option value="' +
                                ciudades[i].CiudadID +
                                '">' +
                                ciudades[i].CiudadNombre + ", " + ciudades[i].CiudadDistrito +
                                "</option>"
                            );
                        }
                        $("#editar-ciudad-regiones").attr("disabled", false);
                        $("#editar-ciudad-regiones").val(ids);

                    } else {
                        $("#editar-ciudad-regiones").append(
                            '<option value="">#{translation.CITIES_NOT_FOUND}</option>'  
                        );

                        $("#editar-ciudad-regiones").attr("disabled", true);

                    }

                }

            })
        }
    })
    $("#editarRegionAdmin").modal("show");

}


//Actualizar Región Action
const UpdateRegionAdmin = (token) => {
    let idRegion = $("#editar-id-region").val();
    let nombreRegion = $("#editar-nombre-regiones").val();
    let pais = $("#editar-pais-regiones").val();
    let ciudad = $("#editar-ciudad-regiones").val();


    if (idRegion && nombreRegion && pais) {



        Swal.showLoading();

        $.ajax({
            method: "POST",
            url: "/admin-regiones",
            dataType: "json",
            data: {
                id: idRegion,
                nombre: nombreRegion,
                pais: pais,
                states: ciudad,
                empresa_id:token
            },
            success: function (data) {
                if (data.status == "success") {
                    $("#editarRegionAdmin").modal("hide");
                    Swal.close();
                    window.location.reload(true);
                } else {
                    Swal.close();
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "#{translation.WRONG}",
                        showConfirmButton: false,
                        timer: 2500,
                    });
                }
            },
            error: function (e) {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "#{translation.WRONG}",
                    showConfirmButton: false,
                    timer: 2500,
                });
            },
        });
    } else {
        Swal.fire({
            position: "center",
            icon: "info",
            html: "<b>#{translation.MUST_COMPLETE_DATA_REQUIRED_EDIT_SERVICES}</b>",
            showConfirmButton: false,
            timer: 2500,
        });
    }
};

//Eliminar Región Admin
const eliminarRegionAdmin = (val) => {
    Swal.fire({
        title: "Estás Seguro?",
        text: "No podras revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "#{translation.YES_DELETE}",
    }).then((result) => {
        if (result.isConfirmed) {
            handleDeleteRegion(val);
        }
    });
};

const handleDeleteRegion = (val) => {
    Swal.showLoading();
    $.ajax({
        method: "DELETE",
        url: `/admin-regiones/${val}`,
        dataType: "json",

        success: function (data) {
            if (data.status === "success") {
                Swal.close();
                window.location.reload(true);
            } else {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "#{translation.WRONG}",
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
                title: "#{translation.WRONG}",
                showConfirmButton: false,
                timer: 2500,
            });
        },
    });
};
