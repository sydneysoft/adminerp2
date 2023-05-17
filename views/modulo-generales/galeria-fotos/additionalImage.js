Dropzone.autoDiscover = false;
var myDropzone = new Dropzone(".dropzone", {
    name: "multimedia",
    acceptedFiles: ".jpeg,.jpg,.png,.gif,.ico",
    autoQueue: false,
    addRemoveLinks: true,
    dictDefaultMessage: "<b>Suelta los archivos aquí o haz click para subirlos</b><br><p>(Recuerda que la máxima cantidad permitida de imágenes es 20 en cada petición)</p>",
    dictRemoveFile: "<b style='color:red;margin-top:5px;'>Remover</b>",
});

myDropzone.on("addedfile", function (file) {
    $('#btn-upload').show();
});

myDropzone.on("removedfile", function (e) {
    if (myDropzone.files.length == 0) {
        $('#btn-upload').hide();
    }
});

//Función para Obtener todas las Imágenes con Paginación en el Scroll
const getMultimediaPagedGaleria = async (dataPage) => {
    $("#dataRowListMultimedia").empty();
    $("#dataRowListMultimedia").hide();
    $("#loadingDataAjax").show();
    try {
        let url = "/admin-galeria/selectImages/" + dataPage;
        let data = null;
        let head = { "Content-Type": "application/json" };
        const dataFilesUpload = await axios.get(url, data, head);
        if (dataFilesUpload.data) {

            for (let i = 0; dataFilesUpload.data.length > i; i++) {
                $("#dataRowListMultimedia").append(
                    '<div id="mediaPhoto' +
                    dataFilesUpload.data[i].id +
                    '" class="col-6 col-md-3 mb-4 text-center" onClick="HandleMultimediaData(\'' +
                    dataFilesUpload.data[i].id +
                    "','" +
                    dataFilesUpload.data[i].public_id +
                    "','" +
                    dataFilesUpload.data[i].url +
                    "','" +
                    dataFilesUpload.data[i].peso +
                    "','" +
                    dataFilesUpload.data[i].created_at +
                    "','" +
                    dataFilesUpload.data[i].tipo +
                    "')\">" +
                    '<div onclick="' +
                    dataFilesUpload.data[i].url +
                    '" class="selectImg position-relative"><img class="image-item-galeria-photo" src="' +
                    dataFilesUpload.data[i].url +
                    '"/></div>' +
                    "</div>"
                );
            }
            $("#loadingDataAjax").hide();
            $("#dataRowListMultimedia").show();
        }
    } catch (e) {
        console.log(e);
    }
};
getMultimediaPagedGaleria("0");
$('#data-paginate-images').pajinatify({
    onChange: function (currentPage) {
        let dataGetPage = parseInt(currentPage) - 1;
        getMultimediaPagedGaleria(dataGetPage);
    }
});

//Manejar Datos Generales
const HandleMultimediaData = (id, public, url, peso, creado, tipo) => {
    console.log("PUBLIC", public)
    $("#noSelectedDivImagen").hide();
    let fechaData = moment(creado).format("lll");
    $("#data-id-multimedia-select").val(id);
    $("#data-public-multimedia-select").val(public);
    $("#data-image-multimedia-select").val(url);

    $("#text-peso-multimedia-select").html(
        "<b>Fecha de Creación : </b><b style='font-weight:normal'>" +
        fechaData +
        "</b>"
    );
    $("#text-date-multimedia-select").html(
        "<b>Peso : </b><b style='font-weight:normal'>" +
        peso +
        "</b>"
    );
    $("#text-type-multimedia-select").html(
        "<b>Tipo : </b><b style='font-weight:normal'>" + tipo + "</b>"
    );
    $("#infoImagenData").show();

};


const uploadImagesGaleria = async () => {
    var dataForm = new FormData();

    myDropzone.files.forEach((file) => {
        dataForm.append("multimedia", file);
    });

    Swal.showLoading();
    try {

        fetch(`/admin-galeria`, {
            method: "post",
            body: dataForm
        })
            .then((data) =>
                data.json())
            .then(info => {

                if (info.status == "success") {

                    Swal.close();
                    window.location.reload(true);


                } else {
                    Swal.close();
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Ocurrió un error interno inténtalo nuevamente.",
                        showConfirmButton: false,
                        timer: 2500,
                    });
                }
            })
            .catch(e => {
                console.log(e)
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Ocurrió un error interno inténtalo nuevamente.",
                    showConfirmButton: false,
                    timer: 2500,
                });
            })


    } catch (e) {
        Swal.close();
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Ocurrió un error interno inténtalo nuevamente.",
            showConfirmButton: false,
            timer: 2500,
        });
    }
};



const visualizarFotoMultimedia = () => {

    let urlFotoHandled1 = $("#data-image-multimedia-select").val();
    $("#data-img-all").attr("src", urlFotoHandled1);
    $("#myModalMultimedia").modal("show");
};

//Eliminar foto del storage y la db
const deletePhotoMultimedia = async () => {
    let result = await Swal.fire({
        title: "Estás Seguro?",
        text: "No podras revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0f67ff",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar!",
    });

    if (result.isConfirmed) {

        let dataIdHandled = $("#data-id-multimedia-select").val();

        let public_id = $("#data-public-multimedia-select").val();
 
        Swal.showLoading();

        $.ajax({
            method: "POST",
            url: `/admin-galeria/${dataIdHandled}`,
            dataType: "json",
            data: {
                public_id: public_id

            },
            success: function (data) {

                if (data.status == "success") {
                    $("#mediaPhoto" + dataIdHandled).remove();
                    $("#infoImagenData").hide();
                    $("#noSelectedDivImagen").show();
                    Swal.close();
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "La imagen fue eliminada correctamente.",
                        showConfirmButton: false,
                        timer: 2500,
                    });
                
                } else {
                    Swal.close();
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Ocurrió un error interno inténtalo nuevamente.",
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
                    title: "Ocurrió un error interno inténtalo nuevamente.",
                    showConfirmButton: false,
                    timer: 2500,
                });
            }
        })
    }


}