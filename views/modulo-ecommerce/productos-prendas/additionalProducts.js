const cargarAlmacen = (base) => {

    let clone = $(".rowAgregaAlmacen:first").clone();
    clone.appendTo(`#${base}`);
    clone.find("input").val("");
    clone.find("select").attr("disabled", false)

};
const cargarAlmacenEditar = () => {


    let clone = $(".rowAlmacen:first").clone();
    clone.appendTo($("#tdbodyAlmacenEditar"));
    clone.find("input").val("");
    clone.find("select").attr("disabled", false)

};


const handleProductoAdmin = async (idVal) => {
    typeOperation = "2";
    Swal.showLoading();
    $(".stock_question").prop('checked', false);
    $("#dataIdProducto").val(idVal);
    $("#subcategoriasEditar-producto-admin").empty();
    $("#categoriaEditar-producto-admin").empty();
    $("#marcaEditar-producto-admin").empty();
    $("#subfiltrosEditar-producto-admin").empty();
    $("#tdbodyAlmacenEditar").empty();
    $(".idAlmacenEditar").empty();
    $("idEmpresaEditar").empty();

    $("idEmpresaEditar").val("");
    $(".idAlmacenEditar").val("");
    $("#categoriaEditar-producto-admin").val("");
    $("#subcategoriasEditar-producto-admin").val("");
    $("#marcaEditar-producto-admin").val("");
    $("#controlerFiltrosEditar span").remove();
    $("#filtrosAdvancedEdit").hide();
    $("#valueFiltersEdit").val("");

    $("#tallasEditar-producto-admin").val("");
    $("#coloresEditar-producto-admin").val("");
    typeUpdate = 1;
    $.ajax({
        method: "GET",
        url: "/get-all-data-product/" + idVal,
        dataType: "json",
        data: null,

        success: async function (data) {

            if (data.status === "success") {
                let almacenesCantidad = data.almacenesCantidad;
                let almacenesArray = data.almacenes;
                let dataProducto = data.dataProducto;
                let marcasArray = data.dataMarcas;
                let subcategoriasArray = data.dataSubcategorias;
                let categoriasArray = data.dataCategorias;
                let filtrocategorias = data.dataFiltros;
                let resultOptions = data.resultOptions;
                let tallasProducto = data.dataProducto.tallas;
                let coloresProducto = data.dataProducto.colores;

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


                if (dataProducto.empresa_id == 0 || dataProducto.empresa_id == "" || dataProducto.empresa_id == null) {
                    categoriasArray = data.dataCategorias.filter(a => a.id != 9999)
                } else {
                    categoriasArray = data.dataCategorias
                }
                if (categoriasArray.length > 0) {
                    for (let i = 0; categoriasArray.length > i; i++) {
                        $("#categoriaEditar-producto-admin").append(
                            '<option value="' +
                            categoriasArray[i].id +
                            '">' +
                            categoriasArray[i].name +
                            "</option>"
                        );
                    }
                    $("#categoriaEditar-producto-admin").attr("disabled", false);
                } else {
                    $("#categoriaEditar-producto-admin").append(
                        '<option value="0">No se encontraron Categorías</option>'
                    );
                    // $("#categoriaEditar-producto-admin").attr("disabled", true);
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

                if (almacenesCantidad.length > 0) {
                    for (let i = 0; almacenesCantidad.length > i; i++) {

                        $(`td #almacenEditar:eq(${i})`)
                            .val(almacenesCantidad[i].almacen_id)


                        $(`td .stock:eq(${i})`)
                            .val(almacenesCantidad[i].stock)

                    }
                }
                let migracion = 0
                dataProducto.empresa_id ? migracion = dataProducto.empresa_id : migracion
                $("#idEmpresaEditar").val(migracion).select2();
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
                $("#tallasEditar-producto-admin").val(tallasProducto);
                $("#coloresEditar-producto-admin").val(coloresProducto);

                $("#categoriaEditar-producto-admin").val(dataProducto.categoria)
                $("#subcategoriasEditar-producto-admin").val(dataProducto.subcategoria);
                $("#marcaEditar-producto-admin").val(dataProducto.marca);
                $("#porcentajeEditar-producto-admin").val(
                    dataProducto.oferta_porcentaje
                );
                $("#stockEditar-producto-admin").val(dataProducto.stock);
                $("#descripcionCortaEditar-producto-admin").val(
                    dataProducto.descripcion_corta
                );

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
}

function asignarFiltros() {

    const valorEmpresa = $("#filtroEmpresa").select2().find(":selected").data("id");

    $("#filtroAlmacen").empty();
    $("#filtroCategoria").empty();


    if (valorEmpresa > -1) {

        $.ajax({
            method: "GET",
            url: "/admin-categorias-almacenes/empresa/" + valorEmpresa,
            dataType: "json",

            success: function (data) {

                let categorias = data.categorias;
                let almacenes = data.almacenes;


                if (categorias.length > 0) {
                    $("#filtroCategoria").append(
                        '<option value="">Seleccione</option>'
                    );

                    for (let i = 0; categorias.length > i; i++) {
                        $("#filtroCategoria").append(
                            '<option value="' +
                            categorias[i].name +
                            '">' +
                            categorias[i].name +
                            "</option>"
                        );
                    }
                    $("#filtroCategoria").attr("disabled", false);
                } else {
                    $("#filtroCategoria").append(
                        '<option value="0">No se encontraron categorías</option>'
                    );
                    $("#filtroCategoria").attr("disabled", true);
                }


                if (almacenes.length > 0) {
                    $("#filtroAlmacen").append(
                        '<option value="">Selecciona el almacén</option>'
                    );

                    for (let i = 0; almacenes.length > i; i++) {
                        $("#filtroAlmacen").append(
                            '<option value="' +
                            almacenes[i].nombre +
                            '">' +
                            almacenes[i].nombre +
                            "</option>"
                        );
                    }
                    $("#filtroAlmacen").attr("disabled", false);
                } else {
                    $("#filtroAlmacen").append(
                        '<option value="0">No se encontraron almacenes</option>'
                    );
                    $("#filtroAlmacen").attr("disabled", true);
                }


            },
            error: function (e) {
                $("#filtroCategoria").append(
                    '<option value="">Seleccione empresa</option>'
                );
                $("#filtroAlmacen").append(
                    '<option value="">Seleccione empresa</option>'
                );
                $("#filtroCategoria").attr("disabled", true);
                $("#filtroAlmacen").attr("disabled", true);
            },
        });
    } else {

        $("#filtroCategoria").attr("disabled", true);
        $("#filtroAlmacen").attr("disabled", true);


    }



}
$(document).ready(function () {
    $(".habilitarAlmacen").hide();
    $(".stock_question").click(function () {
        if ($(this).is(":checked")) {

            $(".habilitarAlmacen").show();
        } else {
            $(".habilitarAlmacen").hide();


        }
    });


    $(".seleccionar").select2({
        language: {
            noResults: function () {
                return "No se han encontrado resultados";
            },
        },
    });

    $(".stockEditar").on("click", "#remove", function () {

        $(this).closest("tr").remove();
    });
    $('#tabla-productos').DataTable({

        columnDefs: [
            {
                orderable: false,
                className: 'select-checkbox',
                targets: 0
            }, {
                target: 9,
                visible: false,
                searchable: true,
            },
        ],

        select: {
            style: 'multi',
            selector: 'td:first-child'
        },
        dom: 'Bfrtip',
        buttons: [
            'selectAll',
            'selectNone',

        ],

        order: [[1, 'asc']],
        language: {
            buttons: {
                selectAll: "Seleccionar todos",
                selectNone: "Borrar Selección"
            },
            url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json",
            select: {
                rows: "%d filas seleccionadas"
            }

        },

    });

    var table = $('#tabla-productos').DataTable();
    var tableFilter = $('#tabla-productos').dataTable();
    //filtro de productos


    $('select#filtroCategoria').change(function () {
        if (this.value != 0) {
            tableFilter.fnFilter(this.value, 4);
        } else {
            tableFilter.fnFilter('', 4);
            tableFilter.fnFilter('')
        }
    })



    //filtro de almacenes
    $('select#filtroAlmacen').change(function () {
        if (this.value != 0) {
            tableFilter.fnFilter(this.value, 9);
        } else {
            tableFilter.fnFilter('', 9);
            tableFilter.fnFilter('')
        }
    })
    $('select#filtroEmpresa').change(function () {
        if (this.value != null) {
            tableFilter.fnFilter(this.value, 10);

        } else {
            tableFilter.fnFilter('', 10);
            tableFilter.fnFilter('')
        }
    })
    //acciones masivas productos
    $('#accionesBoton').click(function () {
        const valorSeleccionado = $("#acciones").val();
        const selected_rows = table.rows({
            selected: true
        }).ids();

        const arraySeleccion = $.makeArray(selected_rows)
        switch (valorSeleccionado) {
            case "0":
                eliminarProductos(arraySeleccion, "productos")
                break;
            case "1":
                publicarProductos(arraySeleccion, "productos")
                break;
            case "2":
                borradorProductos(arraySeleccion, "productos")
                break;
        }
    });
});

//Metodo obtener datos de cada fila
function object_from_row(tr) {
    return Object.fromEntries(
        [...tr.querySelectorAll("select, input")].map((inp) => [inp.id, inp.value])
    );
}

//Método para Registrar un Nuevo Producto con todos sus filtros disponibles
const addProductoAdmin = (token) => {
    let nombreProducto = $("#nombreNuevo-producto-admin").val();
    let precioProducto = $("#precioNuevo-producto-admin").val();
    let statusProducto = $("#estatusNuevo-producto-admin").val();
    let destacadoProducto = $("#destacadoNuevo-producto-admin").val();
    let ofertaProducto = $("#ofertaNuevo-producto-admin").val();
    let categoriaProducto = $("#categoriaNuevo-producto-admin").val();
    let subcategoriaProducto = $("#subcategoriasNuevo-producto-admin").val();
    let marcaProducto = $("#marcaNuevo-producto-admin").val();
    let subFiltro = $("#subfiltrosNuevo-producto-admin").val();
    let fotosProducto = arrayImagesNew;

    let filtrosProducto = $("#valueFiltersNew").val();
    let descripcionProducto = CKEDITOR.instances.ckeditorarea.getData();
    let calificacionProducto = $("#calificacionNuevo-producto-admin").val();
    let comentariosProducto = $(
        "#califacion-revision-Nuevo-producto-admin"
    ).val();
    let urlFotoPrincipal = $("#imagen-data-banner").attr("src");
    let habilitadoAlmacenes = $(".stock_question").is(":checked");

    let stockProducto = $("#stockNuevo-producto-admin").val();
    let ofertaValorProducto = $("#porcentajeNuevo-producto-admin").val();
    let descripcionCorta = $("#descripcionCortaNuevo-producto-admin").val();
    let empresaSeleccionada = $("#idEmpresaNuevo").val();

    if (empresaSeleccionada) {
        empresa = $("#idEmpresaNuevo").val();

    } else {
        empresa = token
    }
    //Adicionales Agregados
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
        categoriaProducto &&
        fotosProducto.length > 0 &&
        descripcionProducto
    ) {
        Swal.showLoading();
        $.ajax({
            method: "POST",
            url: "/add-producto-admin",
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
                subcategoria: subcategoriaProducto,
                marca: marcaProducto ? marcaProducto : 0,

                filtros: filtrosProducto,
                descripcion: descripcionProducto,
                stock: stockProducto,
                ofertaValor: ofertaValorProducto,
                descripcionCorta: descripcionCorta,
                almacenes: stockAlmacenes,
                habilitadoAlmacenes: habilitadoAlmacenes,
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
const handleChangeOferta = () => {
    let valorOferta = $("#ofertaNuevo-producto-admin").val();
    if (valorOferta == "1") {
        $("#porcentajeNuevo-producto-admin").attr("disabled", false);
    } else {
        $("#porcentajeNuevo-producto-admin").attr("disabled", true);
    }
};

const handleCompany = (item) => {

    let valorEmpresa = $("#idEmpresaNuevo").val();
    $("#categoriaNuevo-producto-admin").empty();
    $("#almacenNuevo").empty();


    if (valorEmpresa == null || valorEmpresa == "") {
        valorEmpresa = 0
    }
    let url
    if (!item) {
        url = "/admin-categorias-almacenes/empresa/"
    } else {
        url = "/admin-categorias-almacenes-prendas/empresa/"
    }
    if (valorEmpresa != "") {

        $.ajax({
            method: "GET",
            url: url + valorEmpresa,
            dataType: "json",

            success: function (data) {

                let categoriasArray
                if (valorEmpresa == 0 || valorEmpresa == "" || valorEmpresa == null) {
                    categoriasArray = data.categorias.filter(a => a.id != 9999)
                } else {
                    categoriasArray = data.categorias
                }
                let almacenesArray = data.almacenes;


                if (categoriasArray.length > 0) {
                    $("#categoriaNuevo-producto-admin").append(
                        '<option value="">Elige una categoría</option>'
                    );
                    for (let i = 0; categoriasArray.length > i; i++) {
                        $("#categoriaNuevo-producto-admin").append(
                            '<option value="' +
                            categoriasArray[i].id +
                            '">' +
                            categoriasArray[i].name +
                            "</option>"
                        );
                    }
                    $("#categoriaNuevo-producto-admin").attr("disabled", false);
                } else {
                    $("#categoriaNuevo-producto-admin").append(
                        '<option value="">No se encontraron categorías</option>'
                    );
                    $("#categoriaNuevo-producto-admin").attr("disabled", true);
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
        $("#categoriaNuevo-producto-admin").attr("disabled", true);
        $("#almacenNuevo").attr("disabled", true);
    }
};

const handleCompanyEdit = (item) => {
    let valorEmpresa = $("#idEmpresaEditar").val();

    $("#categoriaEditar-producto-admin").empty();
    $("#almacenEditar").empty();
    let url
    if (!item) {
        url = "/admin-categorias-almacenes/empresa/"
    } else {
        url = "/admin-categorias-almacenes-prendas/empresa/"
    }
    console.log(url);
    typeUpdate = 2;
    if (valorEmpresa != "") {
        $.ajax({
            method: "GET",
            url: url + valorEmpresa,
            dataType: "json",

            success: function (data) {

                let categoriasArray

                if (valorEmpresa == 0 || valorEmpresa == "" || valorEmpresa == null) {
                    categoriasArray = data.categorias.filter(a => a.id != 9999)
                } else {
                    categoriasArray = data.categorias
                }
                let almacenesArray = data.almacenes;

                if (categoriasArray.length > 0) {
                    $("#categoriaEditar-producto-admin").append(
                        '<option value="">Elige una categoría</option>'
                    );
                    for (let i = 0; categoriasArray.length > i; i++) {
                        $("#categoriaEditar-producto-admin").append(
                            '<option value="' +
                            categoriasArray[i].id +
                            '">' +
                            categoriasArray[i].name +
                            "</option>"
                        );
                    }
                    $("#categoriaEditar-producto-admin").attr("disabled", false);
                } else {
                    $("#categoriaEditar-producto-admin").append(
                        '<option value="">No se encontraron  categorías</option>'
                    );
                    // $("#categoriaEditar-producto-admin").attr("disabled", true);
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

        $("#categoriaEditar-producto-admin").append('<option value=""></option>');
        $("#almacenEditar").append('<option value=""></option>');
    }
};

//Manejar Combobox Dependiente
const handleChangeCategoria = () => {

    let valueCategoria = $("#categoriaNuevo-producto-admin").val();

    $("#subcategoriasNuevo-producto-admin").empty();
    $("#subfiltrosNuevo-producto-admin").empty();
    $("#marcaNuevo-producto-admin").empty();
    $("#subcategoriasNuevo-producto-admin").val("");
    $("#marcaNuevo-producto-admin").val("");
    $("#controlerFiltrosProducto span").remove();
    $("#filtrosAdvancedNew").hide();
    $("#valueFiltersNew").val("");


    if (valueCategoria != "") {

        $.ajax({
            method: "POST",
            url: "/obtain-data-by-category",
            dataType: "json",
            data: { categoria: valueCategoria },
            success: function (data) {

                let marcasArray = data.marcas;
                let subcategoriasArray = data.subcategorias;
                let filtrocategorias = data.filtros;

                if (subcategoriasArray.length > 0) {
                    $("#subcategoriasNuevo-producto-admin").append(
                        '<option value="">Elige una Subcategoría</option>'
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
                        '<option value="0">No se encontraron Subcategorías</option>'
                    );
                    // $("#subcategoriasNuevo-producto-admin").attr("descripcion_corta:", true);
                }

                if (marcasArray.length > 0) {
                    for (let i = 0; marcasArray.length > i; i++) {
                        $("#marcaNuevo-producto-admin").append(
                            '<option value="' +
                            marcasArray[i].id +
                            '">' +
                            marcasArray[i].name +
                            "</option>"
                        );
                    }
                    $("#marcaNuevo-producto-admin").attr("descripcion_corta:", false);
                } else {
                    $("#marcaNuevo-producto-admin").append(
                        '<option value="">No se encontraron Marcas</option>'
                    );
                    // $("#marcaNuevo-producto-admin").attr("disabled", true);
                }

                if (filtrocategorias.length > 0) {
                    let dataFunctional = filtrocategorias.map((item) => {
                        return {
                            label: item.name + " (" + item.grupofiltro + ")",
                            value: item.id.toString(),
                        };
                    });
                    $("#controlerFiltrosProducto").append(
                        "<span id='filtroNuevo-producto-admin'></span>"
                    );
                    var autocompleteFiltros = new SelectPure(
                        "#filtroNuevo-producto-admin",
                        {
                            options: dataFunctional,
                            multiple: true,
                            autocomplete: true,
                            icon: "fa fa-times",
                            onChange: (value) => {
                                $("#valueFiltersNew").val(value);
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
                        }
                    );
                    $("#filtrosAdvancedNew").show();
                }

                $("#subfiltrosNuevo-producto-admin").append(
                    '<option value=""></option>'
                );
                // $("#subfiltrosNuevo-producto-admin").attr("disabled", true);
            },
            error: function (e) {
                console.log(e);
            },
        });
    } else {
        $("#subcategoriasNuevo-producto-admin").attr("disabled", true);
        $("#marcaNuevo-producto-admin").attr("disabled", true);
        $("#subfiltrosNuevo-producto-admin").append('<option value=""></option>');
        $("#subfiltrosNuevo-producto-admin").attr("disabled", true);
    }
};
//Manejar Combobox Dependiente
const handleChangeCategoriaEdit = () => {
    let valueCategoria = $("#categoriaEditar-producto-admin").val();
    $("#subcategoriasEditar-producto-admin").empty();
    $("#marcaEditar-producto-admin").empty();
    $("#subfiltrosEditar-producto-admin").empty();
    $("#subcategoriasEditar-producto-admin").val("");
    $("#marcaEditar-producto-admin").val("");
    $("#controlerFiltrosEditar span").remove();
    $("#filtrosAdvancedEdit").hide();
    $("#valueFiltersEdit").val("");
    typeUpdate = 2;
    if (valueCategoria != "") {
        $.ajax({
            method: "POST",
            url: "/obtain-data-by-category",
            dataType: "json",
            data: { categoria: valueCategoria },
            success: function (data) {
                let marcasArray = data.marcas;
                let subcategoriasArray = data.subcategorias;
                let filtrocategorias = data.filtros;
                if (subcategoriasArray.length > 0) {
                    $("#subcategoriasEditar-producto-admin").append(
                        '<option value="">Elige una Subcategoría</option>'
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
                        '<option value="">No se encontraron Subcategorías</option>'
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

                $("#subfiltrosEditar-producto-admin").append(
                    '<option value=""></option>'
                );
                $("#subfiltrosEditar-producto-admin").attr("disabled", true);

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
                    var autocompleteEditFiltros = new SelectPure(
                        "#filtroEditar-producto-admin",
                        {
                            options: dataFunctional,
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
                        }
                    );
                    $("#filtrosAdvancedEdit").show();
                }
            },
            error: function (e) {
                console.log(e);
            },
        });
    } else {
        $("#subcategoriasEditar-producto-admin").attr("disabled", true);
        $("#marcaEditar-producto-admin").attr("disabled", true);
        $("#subfiltrosEditar-producto-admin").append('<option value=""></option>');
        $("#subfiltrosEditar-producto-admin").attr("disabled", true);
    }
};







//Manejar Combobox Dependiente Subcategoría apra subFiltros
const handleChangeEditSubcategoria = () => {
    let dataEmpresaId = $("#subcategoriasEditar-producto-admin").val();
    $("#subfiltrosEditar-producto-admin").empty();
    if (dataEmpresaId) {
        $.ajax({
            method: "GET",
            url: "/get-data-opciones-subcategoria/" + dataEmpresaId,
            dataType: "json",
            data: null,
            success: function (data) {
                for (let xp = 0; data.length > xp; xp++) {
                    $("#subfiltrosEditar-producto-admin").append(
                        '<option value="' +
                        data[xp].id +
                        '">' +
                        data[xp].nombre +
                        "</option>"
                    );
                }
                $("#subfiltrosEditar-producto-admin").attr("disabled", false);
            },
            error: function (e) {
                console.log(e);
            },
        });
    } else {
        $("#subfiltrosEditar-producto-admin").append('<option value="null"></option>');
        $("#subfiltrosEditar-producto-admin").attr("disabled", true);
    }
};


//Manejar Combobox Dependiente Subcategoría apra subFiltros
const handleChangeSubcategoria = () => {
    let dataEmpresaId = $("#subcategoriasNuevo-producto-admin").val();
    $("#subfiltrosNuevo-producto-admin").empty();
    if (dataEmpresaId) {

        $.ajax({
            method: "GET",
            url: "/get-data-opciones-subcategoria/" + dataEmpresaId,
            dataType: "json",
            data: null,
            success: function (data) {
                for (let xp = 0; data.length > xp; xp++) {
                    $("#subfiltrosNuevo-producto-admin").append(
                        '<option value="' +
                        data[xp].id +
                        '">' +
                        data[xp].nombre +
                        "</option>"
                    );
                }
                $("#subfiltrosNuevo-producto-admin").attr("disabled", false);
            },
            error: function (e) {
                console.log(e);
            },
        });
    } else {
        $("#subfiltrosNuevo-producto-admin").append('<option value=""></option>');
        $("#subfiltrosNuevo-producto-admin").attr("disabled", true);
    }
};
//Manejar el dato de Oferta al Editar
const handleChangeOfertaEdit = () => {
    let valorOferta = $("#ofertaEditar-producto-admin").val();
    if (valorOferta == "1") {
        $("#porcentajeEditar-producto-admin").attr("disabled", false);
    } else {
        $("#porcentajeEditar-producto-admin").attr("disabled", true);
    }
};

//Actualizar Datos del producto
const updateDataProducto = (token) => {

    let idProducto = $("#dataIdProducto").val();
    let nombreProducto = $("#nombreEditar-producto-admin").val();
    let precioProducto = $("#precioEditar-producto-admin").val();
    let statusProducto = $("#estatusEditar-producto-admin").val();
    let destacadoProducto = $("#destacadoEditar-producto-admin").val();
    let ofertaProducto = $("#ofertaEditar-producto-admin").val();
    let categoriaProducto = $("#categoriaEditar-producto-admin").val();


    let subcategoriaProducto = $("#subcategoriasEditar-producto-admin").val();
    let marcaProducto = $("#marcaEditar-producto-admin").val();
    let porcentajeOfertaProducto = $("#porcentajeEditar-producto-admin").val();
    let stockProducto = $("#stockEditar-producto-admin").val();
    let descripcionCorta = $("#descripcionCortaEditar-producto-admin").val();
    let filtrosProducto = $("#valueFiltersEdit").val();
    let descripcionProducto = CKEDITOR.instances.ckeditorareaEditar.getData();
    let calificacionProducto = $("#calificacionEditar-producto-admin").val();
    let comentariosProducto = $(
        "#califacion-revision-Editar-producto-admin"
    ).val();
    let urlFotoPrincipal = $("#imagen-data-banner-editar").attr("src");
    let subcategorias_opciones = $("#subfiltrosEditar-producto-admin").val();
    let empresaSeleccionada = $("#idEmpresaEditar").val();
    let empresa
    if (empresaSeleccionada) {
        empresa = empresaSeleccionada
    } else {
        empresa = token
    }
    let habilitadoAlmacenes = $(".stock_question").is(":checked");


    let stockAlmacenes = [
        ...document.getElementById("tdbodyAlmacenEditar").children,
    ].map(object_from_row);

    let tallas_value = $("#tallasEditar-producto-admin").val();
    let colores_value = $("#coloresEditar-producto-admin").val();

    let colores = [];
    let tallas = [];

    if (tallas_value) {
        tallas = JSON.parse(tallas_value).map((i) => i.value);
    }

    if (colores_value) {
        colores = JSON.parse(colores_value).map((i) => i.value);
    }

    if (typeUpdate == 1) {
        if (oldFiltersArray.length > 0) {
            let filtrosFiltered = filtrosProducto.slice(",");
            for (let xs = 0; oldFiltersArray.length > xs; xs++) {
                if (!filtrosFiltered.includes(oldFiltersArray[xs])) {
                    deleteFiltrosArray.push(oldFiltersArray[xs]);
                }
            }
        }
    }
    console.log(
        subcategoriaProducto,
        categoriaProducto)

    if (
        nombreProducto &&
        urlFotoPrincipal &&
        precioProducto &&
        stockProducto &&
        descripcionCorta &&
        subcategoriaProducto &&
        statusProducto &&
        destacadoProducto &&
        ofertaProducto &&
        categoriaProducto &&
        descripcionProducto
    ) {
        Swal.showLoading();
        $.ajax({
            method: "POST",
            url: "/update-producto-admin",
            dataType: "json",
            data: {
                almacenes: stockAlmacenes,
                subcategorias_opciones: subcategorias_opciones,
                urlFotoPrincipal: urlFotoPrincipal,
                comentariosProducto: comentariosProducto,
                calificacionProducto: calificacionProducto,
                id: idProducto,
                filtrosDelete: deleteFiltrosArray,
                nombre: nombreProducto,
                typeUpdate: typeUpdate,
                precio: precioProducto,
                status: statusProducto,
                destacado: destacadoProducto,
                oferta: ofertaProducto,
                categoria: categoriaProducto,
                subcategoria: subcategoriaProducto,
                marca: marcaProducto ? marcaProducto : 0,
                porcentajeOferta: porcentajeOfertaProducto,
                stock: stockProducto,
                descripcionCorta: descripcionCorta,
                filtros: filtrosProducto,
                descripcion: descripcionProducto,
                tallas: tallas.length ? tallas : null,
                colores: colores.length ? colores : null,
                empresa_id: empresa,
                habilitadoAlmacenes: habilitadoAlmacenes
            },
            success: function (data) {

                if (data.status === "success") {
                    Swal.close();
                    window.location.reload(true);
                } else {
                    Swal.close();
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title:
                            "Ocurrió un error al actualizar el registro intentalo nuevamente.",
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


const clonarProducto = (val) => {
    Swal.fire({
        title: "¿Desear clonar el producto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Clonar!",
    }).then((result) => {
        if (result.isConfirmed) {
            accionclonarProducto(val);
        }
    });
};


const accionclonarProducto = (val) => {
    Swal.showLoading();

    $.ajax({
        method: "GET",
        url: "/add-producto-admin/clonar/" + val,

        success: function (data) {
            if (data.affectedRows === 1) {
                Swal.close();
                handleProductoAdmin(data.insertId);
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

const borradorProductos = (val, db) => {
    if (val.length === 0) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Seleccione productos a cambiar a borrador.",
            showConfirmButton: false,
            timer: 2500,
        });
    } else {
        Swal.fire({
            title: "Estás Seguro?",
            text: `Se cambiaran a borrador ${val.length} productos`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar",
        }).then((result) => {
            if (result.isConfirmed) {
                accionBorrador(val, db);
            }
        });
    }
};

const accionBorrador = (val, db) => {
    Swal.showLoading();
    $.ajax({
        method: "PUT",
        url: "/acciones-masivas/borrador",
        dataType: "json",
        data: { val, db },
        success: function (data) {
            if (data.msg > 0) {
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

const publicarProductos = (val, db) => {
    if (val.length === 0) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Seleccione productos a publicar.",
            showConfirmButton: false,
            timer: 2500,
        });
    } else {
        Swal.fire({
            title: "Estás Seguro?",
            text: `Se publicaran ${val.length} productos`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar",
        }).then((result) => {
            if (result.isConfirmed) {
                accionPublicar(val, db);
            }
        });
    }
};

const accionPublicar = (val, db) => {
    Swal.showLoading();
    $.ajax({
        method: "PUT",
        url: "/acciones-masivas/publicar",
        dataType: "json",
        data: { val, db },
        success: function (data) {
            if (data.msg > 0) {
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
const deleteProductosAdminPanel = (val) => {
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
            handleDeleteProductosAdmin(val);
        }
    });
};

const handleDeleteProductosAdmin = (val) => {
    Swal.showLoading();
    $.ajax({
        method: "GET",
        url: "/eliminar-producto-admin/" + val,
        dataType: "json",
        data: null,
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
//Abrir Modal Productos para crear uno nuevo
const openNewHandleModalProduct = () => {
    typeOperation = "1";
    $("#nuevoProductoAdmin").modal("show");
};


