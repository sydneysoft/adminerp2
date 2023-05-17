const addPrendaAdmin = (token) => {
    let nombreProducto = $("#nombreNuevo-producto-admin").val();
    let precioProducto = $("#precioNuevo-producto-admin").val();
    let statusProducto = $("#estatusNuevo-producto-admin").val();
    let destacadoProducto = $("#destacadoNuevo-producto-admin").val();
    let ofertaProducto = $("#ofertaNuevo-producto-admin").val();
    let categoriaProducto = $("#categoriaNuevo-producto-admin").val();
    let subcategoriaProducto = $("#subcategoriasNuevo-producto-admin").val();
    let marcaProducto = $("#marcaNuevo-producto-admin").val();
    let subFiltro = $("#subfiltrosNuevo-producto-admin").val();
    let filtrosProducto = $("#valueFiltersNew").val();
    let descripcionProducto = CKEDITOR.instances.ckeditorarea.getData();
    let calificacionProducto = $("#calificacionNuevo-producto-admin").val();
    let comentariosProducto = $(
        "#califacion-revision-Nuevo-producto-admin"
    ).val();
    let urlFotoPrincipal = $("#imagen-data-banner").attr("src");
    let fotosProducto = arrayImagesNew;
    let stockProducto = $("#stockNuevo-producto-admin").val();
    let ofertaValorProducto = $("#porcentajeNuevo-producto-admin").val();
    let descripcionCorta = $("#descripcionCortaNuevo-producto-admin").val();

    let tallas_value = $("#tallasNuevo-producto-admin").val();
    let colores_value = $("#coloresNuevo-producto-admin").val();

    let colores = [];
    let tallas = [];

    if (tallas_value) {
        tallas = JSON.parse(tallas_value).map((i) => i.value);
    }

    if (colores_value) {
        colores = JSON.parse(colores_value).map((i) => i.value);
    }
    let empresa
    if ($("#idEmpresaNuevo").val()) {
        empresa = $("#idEmpresaNuevo").val();

    } else {
        empresa = token
    }

    let stockAlmacenes = [
        ...document.getElementById("tdbodyAlmacen").children,
    ].map(object_from_row);



    if (
        urlFotoPrincipal != "https://www.cuba.travel/images/noimage.png" &&
        nombreProducto &&
        precioProducto &&
        stockProducto &&
        descripcionCorta &&
        subcategoriaProducto &&
        statusProducto &&
        destacadoProducto &&
        ofertaProducto &&
        fotosProducto.length > 0 &&
        descripcionProducto
    ) {
        Swal.showLoading();
        $.ajax({
            method: "POST",
            url: "/add-prenda-admin",
            dataType: "json",
            data: {
                subFiltro: subFiltro,
                urlFotoPrincipal: urlFotoPrincipal,
                calificacionProducto: calificacionProducto,
                comentariosProducto: comentariosProducto,
                nombre: nombreProducto,
                precio: precioProducto,
                status: statusProducto,
                destacado: destacadoProducto,
                oferta: ofertaProducto,
                categoria: categoriaProducto,
                empresa_id: empresa,
                subcategoria: subcategoriaProducto,
                marca: marcaProducto ? marcaProducto : 0,
                filtros: filtrosProducto,
                descripcion: descripcionProducto,
                stock: stockProducto,
                ofertaValor: ofertaValorProducto,
                descripcionCorta: descripcionCorta,
                tallas: tallas ? tallas : null,
                colores: colores ? colores : null,
                almacenes: stockAlmacenes,
                empresa_id: empresa ? empresa : 0,
            },
         
                success: function (data) {

                    if (data.status === "success") {
                        $.ajax({
                            method: "POST",
                            url: "/admin-productos/galeria",
                            dataType: "json",
                            data: {
                                producto_id: data.id.insertId,
                                fotos: fotosProducto
                            },
                            success: function (data) {
                                Swal.close();

                                window.location.reload(true);
                            }, error: function (e) {
                                console.log(e)
                                Swal.close();
                                Swal.fire({
                                    position: "center",
                                    icon: "error",
                                    title: "Ocurrió un error interno inténtalo más tarde.",
                                    showConfirmButton: false,
                                    timer: 2500,
                                });
                            },
                        })

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
                error: function (e) {
                    console.log(e)
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
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Debes ingresar los datos requeridos para crear un producto.",
            showConfirmButton: false,
            timer: 2500,
        });
    }
};

const handleEmpresaPrenda = () => {

    let valorEmpresa = $("#idEmpresaNuevo").val();
    $("#categoriasNuevo-producto-admin").empty();
    // $("#subcategoriasNuevo-producto-admin").empty();
    $("#almacenNuevo").empty();



    if (valorEmpresa == null || valorEmpresa == "") {
        valorEmpresa = 0
    }

    if (valorEmpresa != "") {

        $.ajax({
            method: "GET",
            url: "/admin-subcategorias-almacenes/empresa/" + valorEmpresa,
            dataType: "json",

            success: function (data) {

                let subcategoriasArray = data.subcategorias;
                let almacenesArray = data.almacenes;


                if (subcategoriasArray.length > 0) {
                    $("#subcategoriasNuevo-producto-admin").append(
                        '<option value="">Elige una subcategoría</option>'
                    );
                    for (let i = 0; subcategoriasArray.length > i; i++) {
                        $("#subcategoriasNuevo-producto-admin").append(
                            '<option value="' +
                            subcategoriasArray[i].id +
                            '">' +
                            subcategoriasArray[i].nombre +
                            "</option>"
                        );
                    }
                    $("#subcategoriasNuevo-producto-admin").attr("disabled", false);
                } else {
                    $("#subcategoriasNuevo-producto-admin").append(
                        '<option value="0">No se encontraron subcategorías</option>'
                    );
                    $("#subcategoriasNuevo").attr("disabled", true);
                }


                if (almacenesArray.length > 0) {
                    $("#almacenNuevo").append(
                        '<option value="null">Elige un almacén</option>'
                    );
                    for (let i = 0; almacenesArray.length > i; i++) {
                        $("#almacenNuevo").append(
                            '<option value="' +
                            almacenesArray[i].id +
                            '">' +
                            almacenesArray[i].nombre +
                            "</option>"
                        );
                    }
                    $("#almacenNuevo").attr("disabled", false);
                } else {
                    $("#almacenNuevo").append(
                        '<option value="0">No se encontraron almacenes</option>'
                    );
                    $("#almacenNuevo").attr("disabled", true);
                }
            },
            error: function (e) {
                console.log(e);
            },
        });
    } else {
        $("#subcategoriasNuevo-producto-admin").attr("disabled", true);
        $("#almacenNuevo").attr("disabled", true);
    }
};

const handleEmpresaPrendaEdit = () => {
    let valorEmpresa = $("#idEmpresaEditar").val();

    $("#subcategoriasEditar-producto-admin").empty();
    $("#almacenEditar").empty();

    typeUpdate = 2;
    if (valorEmpresa != "") {
        $.ajax({
            method: "GET",
            url: "/admin-subcategorias-almacenes/empresa/" + valorEmpresa,
            dataType: "json",

            success: function (data) {

                let subcategoriasArray = data.subcategorias;
                let almacenesArray = data.almacenes;

                if (subcategoriasArray.length > 0) {
                    $("#subcategoriasEditar-producto-admin").append(
                        '<option value="">Elige una subcategoría</option>'
                    );
                    for (let i = 0; subcategoriasArray.length > i; i++) {
                        $("#subcategoriasEditar-producto-admin").append(
                            '<option value="' +
                            subcategoriasArray[i].id +
                            '">' +
                            subcategoriasArray[i].nombre +
                            "</option>"
                        );
                    }
                    $("#subcategoriasEditar-producto-admin").attr("disabled", false);
                } else {
                    $("#subcategoriasEditar-producto-admin").append(
                        '<option value="0">No se encontraron subcategorías</option>'
                    );
                    $("#subcategoriasEditar-producto-admin").attr("disabled", true);
                }

                if (almacenesArray.length > 0) {
                    $("#almacenEditar").append(
                        '<option value="">Elige el almacén</option>'
                    );
                    for (let i = 0; almacenesArray.length > i; i++) {
                        $("#almacenEditar").append(
                            '<option value="' +
                            almacenesArray[i].id +
                            '">' +
                            almacenesArray[i].nombre +
                            "</option>"
                        );
                    }
                    $("#almacenEditar").attr("disabled", false);
                } else {
                    $("#almacenEditar").append(
                        '<option value="">No se encontraron almacenes</option>'
                    );
                    $("#almacenEditar").attr("disabled", true);
                }


            },
            error: function (e) {
                console.log(e);
            },
        });
    } else {

        $("#subcategoriasEditar-producto-admin").append('<option value=""></option>');
        $("#almacenEditar").append('<option value=""></option>');
    }
};

//Manejar Modal Editar Producto trayendo los datos en tiempo real
const handleEditPrendasAdmin = (idVal) => {
    typeOperation = "2";
    Swal.showLoading();

    // $("#categoriaEditar-producto-admin").val(9999)
    $("#categoriaEditar-producto-admin").attr("disabled", true);
    $(".stock_question").prop('checked', false);
    $("#dataIdProducto").val(idVal);
    $("#subcategoriasEditar-producto-admin").empty();
    $("#marcaEditar-producto-admin").empty();
    $("#subfiltrosEditar-producto-admin").empty();
    $("#subcategoriasEditar-producto-admin").val("");
    $("#marcaEditar-producto-admin").val("");
    $("#controlerFiltrosEditar span").remove();
    $("#filtrosAdvancedEdit").hide();
    $("#valueFiltersEdit").val("");
    $("#tdbodyAlmacenEditar").empty();
    $(".idAlmacenEditar").empty();
    $("idEmpresaEditar").empty();

    $("idEmpresaEditar").val("");
    $(".idAlmacenEditar").val("");
    typeUpdate = 1;
    $.ajax({
        method: "GET",
        url: "/get-all-data-prendas/" + idVal,
        dataType: "json",
        data: null,
        success: function (data) {
            if (data.status === "success") {
                let almacenesCantidad = data.almacenesCantidad;
                let almacenesArray = data.almacenes;
                let dataProducto = data.dataProducto;
                let marcasArray = data.dataMarcas;
                let subcategoriasArray = data.dataSubcategorias;
                let filtrocategorias = data.dataFiltros;
                let resultOptions = data.resultOptions;
                if (almacenesCantidad.length > 0) {

                    $(".stock_question").prop('checked', true);
                    $(".habilitarAlmacen").show();
                } else {

                    $(".habilitarAlmacen").hide();


                }


                let fila = '<tr class="rowAlmacen">' +
                    '<td>' +
                    '<select id="almacenEditar" class="idAlmacenEditar form-control" disabled>' +
                    '</select></td>' +
                    '<td><input id="stockEditar" type="number" class="stock form-control"></input></td>' +
                    '<td><button id="remove" type="button" class="rowDelete btn btn-danger"> - </button></td>'
                    + '</tr>'

                $("#tdbodyAlmacenEditar").append(fila);
                if (almacenesArray.length > 0) {

                    $(`#almacenEditar`).append(
                        '<option value="null">Seleccione una opción</option>'
                    );
                    for (let i = 0; almacenesArray.length > i; i++) {
                        $(`td #almacenEditar`).append(
                            '<option value="' +
                            almacenesArray[i].id +
                            '">' +
                            almacenesArray[i].nombre +
                            "</option>"
                        );
                        $(`td #almacenEditar`).attr("disabled", false);
                    }
                } else {
                    $(`#almacenEditar`).append(
                        '<option value="null">No se encontraron almacenes</option>'
                    );
                    $(`#almacenEditar`).attr("disabled", true);
                }


                if (almacenesCantidad.length > 0) {
                    for (let i = 1; almacenesCantidad.length > i; i++) {
                        let clone = $(".rowAlmacen:first").clone();
                        clone.appendTo($("#tdbodyAlmacenEditar"));
                        clone.find("input").val("");
                        clone.find("select").attr("disabled", false)
                    }

                }
                if (subcategoriasArray.length > 0) {
                    for (let i = 0; subcategoriasArray.length > i; i++) {
                        $("#subcategoriasEditar-producto-admin").append(
                            '<option value="' +
                            subcategoriasArray[i].id +
                            '">' +
                            subcategoriasArray[i].nombre +
                            "</option>"
                        );
                    }
                    $("#subcategoriasEditar-producto-admin").attr("disabled", false);
                } else {
                    $("#subcategoriasEditar-producto-admin").append(
                        '<option value="0">No se encontraron Subcategorías</option>'
                    );
                    $("#subcategoriasEditar-producto-admin").attr("disabled", true);
                }

                if (marcasArray.length > 0) {
                    for (let i = 0; marcasArray.length > i; i++) {
                        $("#marcaEditar-producto-admin").append(
                            '<option value="' +
                            marcasArray[i].id +
                            '">' +
                            marcasArray[i].name +
                            "</option>"
                        );
                    }
                    $("#marcaEditar-producto-admin").attr("disabled", false);
                } else {
                    $("#marcaEditar-producto-admin").append(
                        '<option value="">No se encontraron Marcas</option>'
                    );
                    $("#marcaEditar-producto-admin").attr("disabled", true);
                }

                if (resultOptions.length > 0) {
                    for (let i = 0; resultOptions.length > i; i++) {
                        $("#subfiltrosEditar-producto-admin").append(
                            '<option value="' +
                            resultOptions[i].id +
                            '">' +
                            resultOptions[i].nombre +
                            "</option>"
                        );
                    }
                    $("#subfiltrosEditar-producto-admin").attr("disabled", false);
                } else {
                    $("#subfiltrosEditar-producto-admin").append(
                        '<option value=""></option>'
                    );
                    $("#subfiltrosEditar-producto-admin").attr("disabled", true);
                }
                let migracion = 0
                dataProducto.empresa_id ? migracion = dataProducto.empresa_id : migracion
                $("#idEmpresaEditar").val(migracion).select2();
                $("#categoriaEditar-producto-admin").val(9999)
                $("#categoriaEditar-producto-admin").attr("disabled", true);
                $("#nombreEditar-producto-admin").val(dataProducto.name);
                $("#precioEditar-producto-admin").val(dataProducto.precio);
                $("#estatusEditar-producto-admin").val(dataProducto.activado);
                $("#destacadoEditar-producto-admin").val(dataProducto.destacado);
                $("#ofertaEditar-producto-admin").val(dataProducto.is_oferta);
                $("#imagen-data-banner-editar").attr("src", dataProducto.imagen);
                $("#subfiltrosEditar-producto-admin").val(
                    dataProducto.subcategoria_opcion
                );

                $("#calificacionEditar-producto-admin").val(
                    dataProducto.calificaciones_status
                );
                $("#califacion-revision-Editar-producto-admin").val(
                    dataProducto.comentarios_automaticos
                );

                if (dataProducto.is_oferta == "1") {
                    $("#porcentajeEditar-producto-admin").attr("disabled", false);
                } else {
                    $("#porcentajeEditar-producto-admin").attr("disabled", true);
                }
                // $("#categoriaEditar-producto-admin").val(dataProducto.categoria);
                $("#subcategoriasEditar-producto-admin").val(dataProducto.subcategoria);
                $("#marcaEditar-producto-admin").val(dataProducto.marca);
                $("#porcentajeEditar-producto-admin").val(
                    dataProducto.oferta_porcentaje
                );
                $("#stockEditar-producto-admin").val(dataProducto.stock);
                $("#descripcionCortaEditar-producto-admin").val(
                    dataProducto.descripcion_corta
                );
                $("#tallasEditar-producto-admin").val(dataProducto.tallasProducto);
                $("#coloresEditar-producto-admin").val(dataProducto.coloresProducto);

                CKEDITOR.instances.ckeditorareaEditar.setData(dataProducto.description);
                let dataValueAll = data.filtrosProducto;

                if (data.filtrosProducto.length > 0) {
                    dataValueAll = dataValueAll.map((item) => {
                        return item.id_filtro.toString();
                    });

                    oldFiltersArray = dataValueAll;
                    let valueReplace = dataValueAll.join(",");
                    $("#valueFiltersEdit").val(valueReplace);
                }

                if (dataProducto.calificaciones_status == "0") {
                    $("#comentarios-container-edit").hide();
                }

                if (filtrocategorias.length > 0) {
                    let dataFunctional = filtrocategorias.map((item) => {
                        return {
                            label: item.name + " (" + item.grupofiltro + ")",
                            value: item.id.toString(),
                        };
                    });

                    $("#controlerFiltrosEditar").append(
                        "<span id='filtroEditar-producto-admin'></span>"
                    );
                    new SelectPure("#filtroEditar-producto-admin", {
                        options: dataFunctional,
                        value: dataValueAll,
                        multiple: true,
                        autocomplete: true,
                        icon: "fa fa-times",
                        onChange: (value) => {
                            $("#valueFiltersEdit").val(value);
                        },
                        classNames: {
                            select: "select-pure__select",
                            dropdownShown: "select-pure__select--opened",
                            multiselect: "select-pure__select--multiple",
                            label: "select-pure__label",
                            placeholder: "select-pure__placeholder",
                            dropdown: "select-pure__options",
                            option: "select-pure__option",
                            autocompleteInput: "select-pure__autocomplete",
                            selectedLabel: "select-pure__selected-label",
                            selectedOption: "select-pure__option--selected",
                            placeholderHidden: "select-pure__placeholder--hidden",
                            optionHidden: "select-pure__option--hidden",
                        },
                    });
                    $("#filtrosAdvancedEdit").show();
                }
                Swal.close();
                $("#editarProductoAdmin").modal("show");
            } else {
                Swal.close();
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Ocurrió un error al traer los datos.",
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
                title: "Ocurrió un error al traer los datos.",
                showConfirmButton: false,
                timer: 2500,
            });
        },
    });
};
