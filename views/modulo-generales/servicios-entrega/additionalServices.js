const AgregarServicioAdmin = (token) => {
    let nombre = $("#nombreNuevo-servicio").val();
    let telefono = $("#telefonoNuevo-servicio").val();
    let metodos_envio = autocompleteTiposEnvioNuevo.value();
    if (nombre && telefono && metodos_envio.length > 0) {
        Swal.showLoading();
        $.ajax({
            method: "POST",
            url: "/admin-servicios-entrega",
            dataType: "json",
            data: { nombre: nombre, empresa_id:token,telefono: telefono, metodos: metodos_envio },
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
    } else {
        Swal.fire({
            position: "center",
            icon: "info",
            html: "<b>#{translation.MUST_COMPLETE_DATA_TO_ADD_DELIVERY_SERVICE}</b>",
            showConfirmButton: false,
            timer: 2500,
        });
    }
};



//Eliminar Servicios
const handleDeleteServicio = (val) => {
    Swal.fire({
        title: "#{translation.ARE_YOU_SURE}",
        text: "#{translation.YOU_COULD_NOT_REVERT}", 
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "#{translation.YES_DELETE}",
    }).then((result) => {
        if (result.isConfirmed) {
            deleteServicioJoin(val);
        }
    });
};

const deleteServicioJoin = (val) => {
    Swal.showLoading();
    $.ajax({
        method: "DELETE",
        url: `/admin-servicios-entrega/${val}`,
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

const ActualizarServicioAdmin = () => {
    let nombre = $("#nombreEditar-servicio").val();
    let telefono = $("#telefonoEditar-servicio").val();
    let id = $("#idEditar-servicio").val();
    let dataSelectEdit = $("#arrDatosSelectEdit").val();
    if (nombre && telefono && id && dataSelectEdit) {
        let deleteFiltrosArray = [];
        if (dataOldArray.length > 0) {
            let filtrosFiltered = dataSelectEdit.slice(",");
            for (let xs = 0; dataOldArray.length > xs; xs++) {
                if (!filtrosFiltered.includes(dataOldArray[xs])) {
                    deleteFiltrosArray.push(dataOldArray[xs]);
                }
            }
        }

        let dataUpdateArrayGen = dataSelectEdit.slice(",");
        Swal.showLoading();
        $.ajax({
            method: "POST",
            url: "/update-servicio-admin",
            dataType: "json",
            data: {
                id: id,
                nombre: nombre,
                telefono: telefono,
                dataMetodos: dataUpdateArrayGen,
                dataDelete: deleteFiltrosArray,
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
        Swal.close();
        Swal.fire({
            position: "center",
            icon: "error",
            html: "<b>#{translation.COMPLETE_FORM_DATA_ADD_SERVICE}</b>",
            showConfirmButton: false,
            timer: 2500,
        });
    }
};