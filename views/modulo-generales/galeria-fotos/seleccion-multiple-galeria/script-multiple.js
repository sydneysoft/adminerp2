var arrayImagesNew = [];
const multimediaModalEdit = () => {
    $("#galeriaModalMultiple").modal("show");
};
const multimediaModal = () => {
    $("#galeriaModalMultiple").modal("show");
};
const uploadImagesMultiple = async () => {
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

                    myDropzone.removeAllFiles();
                    $("#dataRowListMultimedia-multiple").empty();
                    getQuantityImagesProductMultiple();

                    $('#profile1-tab').click()


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



//Función para Obtener todas las Imágenes con Paginación en el Scroll
const getMultimediaPagedMultiple = async (dataPage) => {

    $("#dataRowListMultimedia-multiple").empty();
    $("#dataRowListMultimedia-multiple").hide();
    $("#loadingDataAjax").show();
    try {
        let url = "/admin-galeria/selectImages/" + dataPage;
        let data = null;
        let head = { "Content-Type": "application/json" };
        const dataFilesUpload = await axios.get(url, data, head);
    
        if (dataFilesUpload.data) {
          
            for (let i = 0; dataFilesUpload.data.length > i; i++) {
                let verifyData = arrayImagesNew.includes(dataFilesUpload.data[i].id);

                if (verifyData) {
                    $("#dataRowListMultimedia-multiple").append(
                        "<div onclick=\"selectImageMultiple('" +
                        dataFilesUpload.data[i].id +
                        "','" +
                        dataFilesUpload.data[i].url +
                        '\')" class="col-6 col-md-3 mb-4 text-center">' +
                        '<div class="selectImg position-relative"><img id="mediaPhoto' +
                        dataFilesUpload.data[i].id +
                        '" class="image-item-galeria-photo css-images-selected" src="' +
                        dataFilesUpload.data[i].url +
                        '"/></div>' +
                        "</div>"
                    );
                } else {
                    $("#dataRowListMultimedia-multiple").append(
                        "<div onclick=\"selectImageMultiple('" +
                        dataFilesUpload.data[i].id +
                        "','" +
                        dataFilesUpload.data[i].url +
                        '\')" class="col-6 col-md-3 mb-4 text-center">' +
                        '<div class="selectImg position-relative"><img id="mediaPhoto' +
                        dataFilesUpload.data[i].id +
                        '" class="image-item-galeria-photo" src="' +
                        dataFilesUpload.data[i].url +
                        '"/></div>' +
                        "</div>"
                    );


                }

            }
            $("#loadingDataAjax").hide();
            $("#dataRowListMultimedia-multiple").show();
        }
    } catch (e) {

    }
};
//Metodo  para traer Datos de la paginación con selección múltiple
const getQuantityImagesProductMultiple = async () => {

    try {
        $.ajax({
            method: "GET",
            url: "/admin-galeria/selectImages",
            dataType: "json",

            success: function (data) {


                let dataFilesUpload2 = data.data2;
                $("#data-paginate-images-multiple").attr(
                    "data-total-count",
                    data.data1
                );
                $("#data-paginate-images-multiple").pajinatify({
                    onChange: function (currentPage) {
                        let dataGetPage = parseInt(currentPage) - 1;
                        getMultimediaPagedMultiple(dataGetPage);
                    },
                });

           
                if (!dataFilesUpload2.length) {

                    $("#dataRowListMultimedia-multiple").append(
                        "<p>No hay imagenes disponibles. Sube tu primera imagen</p>")
                }

                for (let i = 0; dataFilesUpload2.length > i; i++) {
                    $("#dataRowListMultimedia-multiple").append(
                        "<div onclick=\"selectImageMultiple('" +
                        dataFilesUpload2[i].id +
                        "','" +
                        dataFilesUpload2[i].url +
                        '\')" class="col-6 col-md-3 mb-4 text-center">' +
                        '<div class="selectImg position-relative"><img id="mediaPhoto' +
                        dataFilesUpload2[i].id +
                        '" class="image-item-galeria-photo" src="' +
                        dataFilesUpload2[i].url +
                        '"/></div>' +
                        "</div>"
                    );
                }
                $("#loadingDataAjax").hide();
                $("#dataRowListMultimedia-multiple").show();
            },
            error: function (err) {
                console.log("err", err)
            }
        })
    } catch (e) {

    }
};


//Metodo  para traer Datos de la paginación con selección múltiple al Editar
const getMultimediaInitialMultipleEdit = async () => {
    $("#dataRowListMultimediaEditar").empty();
    $("#dataRowListMultimediaEditar").hide();
    $("#loadingDataAjaxEditar").show();
    try {
        let url = "get-multimedia-data";
        let data = null;
        let head = { "Content-Type": "application/json" };
        const dataFileHandled = await axios.get(url, data, head);
        if (dataFileHandled.data) {
            let dataFilesUpload = dataFileHandled.data.data2;
            $("#data-paginate-images-editar").attr(
                "data-total-count",
                dataFileHandled.data.data1
            );
            $("#data-paginate-images-editar").pajinatify({
                onChange: function (currentPage) {
                    let dataGetPage = parseInt(currentPage) - 1;
                    getMultimediaPagedMultipleGenericEdit(dataGetPage);
                },
            });
            for (let i = 0; dataFilesUpload.length > i; i++) {
                let verifyData = imagesGalery.includes(dataFilesUpload[i].id);
                if (verifyData) {
                    $("#dataRowListMultimediaEditar").append(
                        "<div onClick=\"selectImageMultipleEdit('" +
                        dataFilesUpload[i].id +
                        "','" +
                        dataFilesUpload[i].url +
                        '\')" class="col-6 col-md-3 mb-4 text-center">' +
                        '<div class="selectImg position-relative"><img id="mediaPhotoEdit' +
                        dataFilesUpload[i].id +
                        '" class="image-item-galeria-photo css-images-selected" src="' +
                        dataFilesUpload[i].url +
                        '"/></div>' +
                        "</div>"
                    );
                } else {
                    $("#dataRowListMultimediaEditar").append(
                        "<div onClick=\"selectImageMultipleEdit('" +
                        dataFilesUpload[i].id +
                        "','" +
                        dataFilesUpload[i].url +
                        '\')" class="col-6 col-md-3 mb-4 text-center">' +
                        '<div class="selectImg position-relative"><img id="mediaPhotoEdit' +
                        dataFilesUpload[i].id +
                        '" class="image-item-galeria-photo" src="' +
                        dataFilesUpload[i].url +
                        '"/></div>' +
                        "</div>"
                    );
                }
            }
            $("#loadingDataAjaxEditar").hide();
            $("#dataRowListMultimediaEditar").show();
        }
    } catch (e) {
        console.log(e);
    }
};


//Selección múltiple de Imagen Método al hacer click
const selectImageMultiple = (id, url) => {

    let verifyData = arrayImagesNew.includes(id);
    if (verifyData) {
        $("#mediaPhoto" + id).removeClass("css-images-selected");
        arrayImagesNew = arrayImagesNew.filter((value) => value != id);
        if (arrayImagesNew.length > 0) {
            $("#choice-image-banner").attr("disabled", false);
        } else {
            $("#choice-image-banner").attr("disabled", true);
        }
    } else {

        $("#mediaPhoto" + id).addClass("css-images-selected");
        arrayImagesNew.push(id);

        $("#choice-image-banner").attr("disabled", false);
    }



};


//Actualizar Galería
const updateDataGalery = () => {
    Swal.showLoading();
    let idTake = $("#data-id-product").val();
    let grupo = $("#data-id-grupo").val();

    if (arrayImagesNew.length > 0) {
        $("#galeriaEditProducto").hide();
        Swal.showLoading();
        $.ajax({
            method: "POST",
            url: "/admin-productos/update-producto-galeria",
            dataType: "json",
            data: { arrayUpdate: arrayImagesNew, id: idTake, id_grupo: grupo },
            success: function (data) {
                if (data.status === "success") {
                    Swal.close();
                    window.location.reload(true);
                } else {
                    Swal.close();
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Ocurrió un error interno al actualizar la galería.",
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
    } else {
        Swal.close();
        window.location.reload(true);
    }
};

var myDropzone = new Dropzone("#my-awesome-dropzone", {
    name: "multimedia",
    acceptedFiles: ".jpeg,.jpg,.png,.gif,.ico",
    autoQueue: false,
    addRemoveLinks: true,
    dictDefaultMessage: "<b>Suelta los archivos aquí o haz click para subirlos</b><br><p>(Recuerda que la máxima cantidad permitida de imágenes es 20 en cada petición)</p>",
    dictRemoveFile: "<b style='color:red;margin-top:5px;'>Remover</b>",
});

myDropzone.on("addedfile", function (file) {
    $('#btn-upload-multiple').show();
});

myDropzone.on("removedfile", function (e) {
    if (myDropzone.files.length == 0) {
        $('#btn-upload-multiple').hide();
    }
});


getQuantityImagesProductMultiple();