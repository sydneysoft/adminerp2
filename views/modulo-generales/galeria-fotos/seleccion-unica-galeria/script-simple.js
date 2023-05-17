var imagesGalery = [];
 
const handleModal = () => {
    $("#galeriaModal").modal("show");

};

const uploadImages = async () => {
    var dataForm = new FormData();

    myDropzonePortada.files.forEach((file) => {
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
                    myDropzonePortada.removeAllFiles();
                    $("#dataRowListMultimedia-single").empty();
                    getQuantityImagesProduct();

                    $('#profile-tab').click()


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
const getMultimediaPaged = async (dataPage) => {

    $("#dataRowListMultimedia-single").empty();
    $("#dataRowListMultimedia-single").hide();
    $("#loadingDataAjax").show();
    try {
        let url = "/admin-galeria/selectImages/" + dataPage;
        let data = null;
        let head = { "Content-Type": "application/json" };
        const dataFilesUpload = await axios.get(url, data, head);
     

        if (dataFilesUpload.data) {
            
           
            for (let i = 0; dataFilesUpload.data.length > i; i++) {
              
                $("#dataRowListMultimedia-single").append(
                    "<div onClick=\"selectImageSingleProduct('" +
                    dataFilesUpload.data[i].id +
                    "','" +
                    dataFilesUpload.data[i].url +
                    '\')" class="col-6 col-md-3 mb-4 text-center">' +
                    '<div class="selectImg position-relative"><img id="mediaPhotoSingle' +
                    dataFilesUpload.data[i].id +
                    '" class="image-item-galeria-photo-single" src="' +
                    dataFilesUpload.data[i].url +
                    '"/></div>' +
                    "</div>"
                );
            }
            $("#loadingDataAjax").hide();
            $("#dataRowListMultimedia-single").show();
        }
    } catch (e) {
        console.log(e);
    }
};




//Abrir Modal Imágenes
const handleImageGalery = (id_group, id_product) => {
   
    imagesGalery = [];
    Swal.showLoading();
    $("#imagesAll").empty();
    $.ajax({
        method: "GET",
        url: "/admin-productos/get-galery-data/" + id_group,
        dataType: "json",

        success: function (data) {

            for (let i = 0; data.length > i; i++) {
                $("#imagesAll").append(
                    `<div class="col-md-4 col-12 mb-4" style="position:relative"><button onClick="DeleteImageGalery(${data[i].id},${id_product})" 
                    class="btn btn-danger close-button"><i class="fa fa-times"></i></button><img class="img-galery" src=${data[i].url}></div>`
                );
            }
            imagesGalery = [...data]
            Swal.close();
            $("#data-id-product").val(id_product);
            $("#data-id-grupo").val(id_group);
            $("#galeriaEditProducto").modal("show");
        },
        error: function () {
            Swal.close();
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Ocurrió un error al obtener los datos,inténtalo más tarde.",
                showConfirmButton: false,
                timer: 2500,
            });
        },
    });
};
const DeleteImageGalery = (id_imagen, id_prod) => {

    Swal.showLoading();

    $("#imagesAll").empty();
    $.ajax({
        method: "POST",
        url: "/admin-productos/delete-picture-data/" + id_imagen,
        dataType: "json",
        data: { id_producto: id_prod },

        success: function (data) {
            imagesGalery = imagesGalery.filter((value) => value.id != id_imagen);
            $("#imagesAll").empty();
            for (let i = 0; imagesGalery.length > i; i++) {

                $("#imagesAll").append(
                    `<div class="col-md-4 col-12 mb-4" style="position:relative"><button onClick="DeleteImageGalery(${imagesGalery[i].id},${id_prod})" 
                    class="btn btn-danger close-button"><i class="fa fa-times"></i></button><img class="img-galery" src=${imagesGalery[i].url}></div>`
                );
            }
            Swal.close();
        }, error: function () {
            Swal.close();
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Ocurrió un error al obtener los datos,inténtalo más tarde.",
                showConfirmButton: false,
                timer: 2500,
            });
        }
    })

};
//Elegir la Foto que se usara
const choiceImgSingleProducto2 = () => {

    if (typeOperation == "1") {
        let valorDataURL = $("#selected-img-data-single").val();
 

        $("#imagen-data-banner").attr("src", valorDataURL);
        $("#galeriaModal").modal("hide");
    } else {

        let valorDataURL = $("#selected-img-data-single").val();
        console.log("DAA", valorDataURL)
        $("#imagen-data-banner-editar").attr("src", valorDataURL);
        $("#galeriaModal").modal("hide");
    }
};






//Manejar Single Selección de una Imagen
const selectImageSingleProduct = (id, url) => {

        $(".image-item-galeria-photo-single").css("filter", "brightness(100%)");
        $("#mediaPhotoSingle" + id).css("filter", "brightness(40%)");
        $("#choice-image-banner-single").attr("disabled", false);
        $("#selected-img-data-single").val(url);


};
//Traer la cantidad de imágenes por paginación de portada
const getQuantityImagesProduct = async () => {
    try {
        $.ajax({
            method: "GET",
            url: "/admin-galeria/selectImages",
            dataType: "json",

            success: function (data) {
             

                let dataFilesUpload = data.data2;
                $("#data-paginate-images-single").attr(
                    "data-total-count",
                    data.data1
                );
                $("#data-paginate-images-single").pajinatify({
                    onChange: function (currentPage) {
                        let dataGetPage = parseInt(currentPage) - 1;
                        getMultimediaPaged(dataGetPage);
                    },
                });

                if (!dataFilesUpload.length) {

                    $("#dataRowListMultimedia-single").append(
                        "<p>No hay imagenes disponibles. Sube tu primera imagen</p>")
                }
                for (let i = 0; dataFilesUpload.length > i; i++) {
                    $("#dataRowListMultimedia-single").append(
                        "<div onClick=\"selectImageSingleProduct('" +
                        dataFilesUpload[i].id +
                        "','" +
                        dataFilesUpload[i].url +
                        '\')" class="col-6 col-md-3 mb-4 text-center">' +
                        '<div class="selectImg position-relative"><img id="mediaPhotoSingle' +
                        dataFilesUpload[i].id +
                        '" class="image-item-galeria-photo-single" src="' +
                        dataFilesUpload[i].url +
                        '"/></div>' +
                        "</div>"
                    );
                }
                $("#loadingDataAjax-single").hide();
                $("#dataRowListMultimedia-single").show();

            },
            error: function (err) {
       
            }
        })

    } catch (e) {
        console.log(e);
    }
};


Dropzone.autoDiscover = false;


var myDropzonePortada = new Dropzone("#my-awesome-dropzone2", {
    name: "multimedia",
    acceptedFiles: ".jpeg,.jpg,.png,.gif,.ico",
    autoQueue: false,
    maxFiles: 1,
    addRemoveLinks: true,
    dictDefaultMessage: "<b>Haz click para subir la portada </p>",
    dictRemoveFile: "<b style='color:red;margin-top:5px;'>Remover</b>",
});
myDropzonePortada.on("addedfile", function (file) {
    $('#btn-upload').show();
});

myDropzonePortada.on("removedfile", function (e) {
    if (myDropzonePortada.files.length == 0) {
        $('#btn-upload').hide();
    }
});


 
getQuantityImagesProduct(); 