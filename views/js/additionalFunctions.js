//Function Generate UNIQUE-ID
const getUniqueValue = (strength = 1, int = false) => {
  const u = () => (Math.random() * 10000).toString().replace(".", "");
  let r = "";
  for (let i = 0; i < strength; i++) {
    r += u();
  }
  return int ? parseInt(r) : r;
};


//Funciones Marcas
//Agregar Marca
const AgregarMarcaAdmin = () => {
  let nombreMarca = $("#nombreNuevo-marcas-admin").val();
  let descripcionMarca = $("#descripcionNuevo-marcas-admin").val();
  let imagenMarca = $("#imgNuevo-marcas-admin").val();
  let idMarca = "MAR" + getUniqueValue();
  if (idMarca && nombreMarca && descripcionMarca && imagenMarca) {
    Swal.showLoading();
    $.ajax({
      method: "GET",
      url: "/addNuevo",
      dataType: "json",
      data: {
        nombretabla: "marcas",
        nombreid: "Id",
        name: nombreMarca,
        description: descripcionMarca,
        imagen: imagenMarca,
        id: idMarca,
      },
      success: function (data) {
        if (data.status === "success") {
          $("#nuevaMarca").modal("hide");
          Swal.close();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Se agrego la nueva marca exitósamente.",
            showConfirmButton: false,
            timer: 2500,
          });
          clearMarcasAdmin();
        } else {
          Swal.close();
          Swal.fire({
            position: "center",
            icon: "error",
            title: "No se pudo agregar la marca.",
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
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Debes completar el formulario.",
      showConfirmButton: false,
      timer: 2500,
    });
  }
};

const clearMarcasAdmin = () => {
  $("#nombreNuevo-marcas-admin").val("");
  $("#descripcionNuevo-marcas-admin").val("");
  $("#imgNuevo-marcas-admin").val("");
};


//Manejar Datos Marcas Editar
const handleEditMarcas = (id, nombre, descripcion, imagen) => {
  $("#idEditar-marcas-admin").val(id);
  $("#nombreEditar-marcas-admin").val(nombre);
  $("#descripcionEditar-marcas-admin").val(descripcion);
  $("#imgEditar-marcas-admin").val(imagen);
};


//Function Editar Marcas
const actualizarMarcasAdmin = () => {
  let idMarca = $("#idEditar-marcas-admin").val();
  let nombreMarca = $("#nombreEditar-marcas-admin").val();
  let descripcionMarca = $("#descripcionEditar-marcas-admin").val();
  let imagenMarca = $("#imgEditar-marcas-admin").val();
  if (idMarca && nombreMarca && descripcionMarca && imagenMarca) {
    Swal.showLoading();
    $.ajax({
      method: "GET",
      url: "/editar",
      dataType: "json",
      data: {
        nombretabla: "marcas",
        nombreid: "Id",
        name: nombreMarca,
        description: descripcionMarca,
        imagen: imagenMarca,
        id: idMarca,
      },
      success: function (data) {
        if (data.status === "success") {
          $("#editarMarca").modal("hide");
          Swal.close();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Se actualizo la marca exitósamente.",
            showConfirmButton: false,
            timer: 2500,
          });
          clearMarcasAdmin();
        } else {
          Swal.close();
          Swal.fire({
            position: "center",
            icon: "error",
            title: "No se pudo actualizar la marca.",
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
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Debes completar el formulario.",
      showConfirmButton: false,
      timer: 2500,
    });
  }
};

//Eliminar Marcas Admin
const deleteMarcasAdmin = (val) => {
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
      handleDeleteMarcas(val);
    }
  });
};

const handleDeleteMarcas = (val) => {
  Swal.showLoading();
  $.ajax({
    method: "GET",
    url: "/eliminar",
    dataType: "json",
    data: { nombretabla: "marcas", nombreid: "Id", id: val },
    success: function (data) {
      if (data.status === "success") {
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Se elimino el registro correctamente.",
          showConfirmButton: false,
          timer: 2500,
        });
      } else {
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "error",
          title: "El elemento que tratas de eliminar ya no existe.",
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

//Funciones Roles
//Agregar Rol
 
//Manejar Roles data Update
const handleAdminRoles = (id, nombre, descripcion, imagen, estado) => {
  $("#idActualizar-admin-rol").val(id);
  $("#nombreActualizar-admin-rol").val(nombre);
  $("#descripcionActualizar-admin-rol").val(descripcion);
  $("#imgActualizar-admin-rol").val(imagen);
  $("#estadoActualizar-admin-rol").val(estado);
};

//Editar Roles
const EditAdminRoles = () => {
  let nombreRol = $("#nombreActualizar-admin-rol").val();
  let descripcionRol = $("#descripcionActualizar-admin-rol").val();
  let imagenRol = $("#imgActualizar-admin-rol").val();
  let estadoRol = $("#estadoActualizar-admin-rol").val();
  let idRol = $("#idActualizar-admin-rol").val();

  if (idRol && nombreRol && descripcionRol && imagenRol && estadoRol) {
    Swal.showLoading();
    $.ajax({
      method: "GET",
      url: "/editar",
      dataType: "json",
      data: {
        nombretabla: "roles",
        nombreid: "_pk_roles",
        name: nombreRol,
        description: descripcionRol,
        activado: estadoRol,
        id: idRol,
        imagen: imagenRol,
      },
      success: function (data) {
        if (data.status === "success") {
          $("#editarRol").modal("hide");
          Swal.close();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Se actualizo el rol exitósamente.",
            showConfirmButton: false,
            timer: 2500,
          });
        } else {
          Swal.close();
          Swal.fire({
            position: "center",
            icon: "error",
            title: "No se pudo actualizar el rol.",
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
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Debes completar el formulario.",
      showConfirmButton: false,
      timer: 2500,
    });
  }
};

//Eliminar Roles Admin
const deleteRolAdmin = (val) => {
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
      handleDeleteRoles(val);
    }
  });
};

const handleDeleteRoles = (val) => {
  Swal.showLoading();
  $.ajax({
    method: "GET",
    url: "/eliminar",
    dataType: "json",
    data: { nombretabla: "roles", nombreid: "_pk_roles", id: val },
    success: function (data) {
      if (data.status === "success") {
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Se elimino el rol correctamente.",
          showConfirmButton: false,
          timer: 2500,
        });
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



//Funciones Tiendas
//Eliminar Tiendas

const generateExcel2 = (tableName, url, filters) => {
  Swal.showLoading();
  $.ajax({
    method: "GET",
    url: "/generate-data-excel",
    dataType: "json",
    data: { tableName: tableName },
    success: function (data) {
      if (data.type === "success") {
        Swal.close();
        const worksheet = XLSX.utils.json_to_sheet(data.data);
        const workBook = {
          Sheets: {
            data: worksheet,
          },
          SheetNames: ["data"],
        };
        const excelBuffer = XLSX.write(workBook, {
          bookType: "xlsx",
          type: "array",
        });
        saveAsExcel(excelBuffer, "File");
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

function getSecondPart(str) {
  return str.split("-")[1];
}

//Generar Archivo de Descarga
const saveAsExcel = (buffer, filename) => {
  let dataTime = new Date().getTime();
  let EXCEL_TYPE =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  let EXCEL_EXTENSION = ".xlsx";
  let dataJoin = new Blob([buffer], { type: EXCEL_TYPE });
  saveAs(dataJoin, filename + "_export_" + dataTime + EXCEL_EXTENSION);
};

//GenerarPDF
const generatePDF = () => {
  Swal.showLoading();
  const $elementoParaConvertir = "<h1 style='color:red;'>Prueba General</h1>"; // <-- Aquí puedes elegir cualquier elemento del DOM
  html2pdf()
    .set({
      margin: 1,
      filename: "documento.pdf",
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 3, // A mayor escala, mejores gráficos, pero más peso
        letterRendering: true,
      },
      jsPDF: {
        unit: "in",
        format: "a3",
        orientation: "portrait", // landscape o portrait
      },
    })
    .from($elementoParaConvertir)
    .save()
    .catch((err) => console.log(err));
  Swal.close();
};

//Métodos del Crud para Promociones
const AgregarPromocionAdmin = () => {
  let nombrePromocion = $("#nombreNuevo-promocion-admin").val();
  let imagenPromocion = $("#imgNuevo-promocion-admin").val();
  let urlPromocion = $("#urlNuevo-promocion-admin").val();
  let estatusPromocion = $("#activadoNuevo-promocion-admin").val();
  let descripcionPromocion = $("#descripcionNuevo-promocion-admin").val();

  if (
    nombrePromocion &&
    imagenPromocion &&
    urlPromocion &&
    estatusPromocion &&
    descripcionPromocion
  ) {
    Swal.showLoading();
    $.ajax({
      method: "GET",
      url: "/addNuevo",
      dataType: "json",
      data: {
        nombretabla: "promociones",
        nombreid: "id",
        id: null,
        nombre: nombrePromocion,
        imagen: imagenPromocion,
        url: urlPromocion,
        status: estatusPromocion,
        descripcion: descripcionPromocion,
      },
      success: function (data) {
        if (data.status === "success") {
          $("#nuevaPromocionAdministrador").modal("hide");
          Swal.close();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Se agrego la promoción exitósamente.",
            showConfirmButton: false,
            timer: 2500,
          });
          clearPromocionAdmin();
        } else {
          Swal.close();
          Swal.fire({
            position: "center",
            icon: "error",
            title:
              "No se pudo agregar la promoción, inténtalo nuevamente  por favor.",
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
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Debes completar el formulario.",
      showConfirmButton: false,
      timer: 2500,
    });
  }
};

//Limpiar Form
const clearPromocionAdmin = () => {
  $("#nombreNuevo-promocion-admin").val("");
  $("#imgNuevo-promocion-admin").val("");
  $("#urlNuevo-promocion-admin").val("");
  $("#activadoNuevo-promocion-admin").val("1");
  $("#descripcionNuevo-promocion-admin").val("");
};

//Manejar datos al Modal Edit Promociones
const handlingEditPanelAdmin = (
  id,
  nombre,
  descripcion,
  url,
  imagen,
  activado
) => {
  $("#nombreEditar-promocion-admin").val(nombre);
  $("#imgEditar-promocion-admin").val(imagen);
  $("#urlEditar-promocion-admin").val(url);
  $("#activadoEditar-promocion-admin").val(activado);
  $("#descripcionEditar-promocion-admin").val(descripcion);
  $("#idEditar-promocion-admin").val(id);
  $("#editarPromocionAdministrador").modal("show");
};

//Actualizar Promociones por ID
const ActualizarPromocionAdmin = () => {
  let nombrePromocion = $("#nombreEditar-promocion-admin").val();
  let imagenPromocion = $("#imgEditar-promocion-admin").val();
  let urlPromocion = $("#urlEditar-promocion-admin").val();
  let estatusPromocion = $("#activadoEditar-promocion-admin").val();
  let descripcionPromocion = $("#descripcionEditar-promocion-admin").val();
  let idPromocion = $("#idEditar-promocion-admin").val();

  if (
    idPromocion &&
    nombrePromocion &&
    imagenPromocion &&
    urlPromocion &&
    estatusPromocion &&
    descripcionPromocion
  ) {
    Swal.showLoading();
    $.ajax({
      method: "GET",
      url: "/editar",
      dataType: "json",
      data: {
        nombretabla: "promociones",
        nombreid: "id",
        id: idPromocion,
        nombre: nombrePromocion,
        imagen: imagenPromocion,
        url: urlPromocion,
        status: estatusPromocion,
        descripcion: descripcionPromocion,
      },
      success: function (data) {
        if (data.status === "success") {
          $("#editarPromocionAdministrador").modal("hide");
          Swal.close();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Se actualizó la promoción correctamente.",
            showConfirmButton: false,
            timer: 2500,
          });
        } else {
          Swal.close();
          Swal.fire({
            position: "center",
            icon: "error",
            title:
              "No se pudo actualizar la promoción, inténtalo nuevamente por favor.",
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
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Debes completar el formulario.",
      showConfirmButton: false,
      timer: 2500,
    });
  }
};

//Eliminar Promociones por ID
const deletePromocionesAdminPanel = (val) => {
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
      handleDeletePromocionAdmin(val);
    }
  });
};

const handleDeletePromocionAdmin = (val) => {
  Swal.showLoading();
  $.ajax({
    method: "GET",
    url: "/eliminar",
    dataType: "json",
    data: { nombretabla: "promociones", nombreid: "id", id: val },
    success: function (data) {
      if (data.status === "success") {
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Se elimino el registro correctamente.",
          showConfirmButton: false,
          timer: 2500,
        });
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


//Converir Peso de la File a kb,mb,gb,
const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

const niceBytes = (x) => {
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  //include a decimal point and a tenths-place digit if presenting
  //less than ten of KB or greater units
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
};

 

const openModalNew = () => {
  typeOperation = "1";
  $(".empresa-subcategoria").val(0).trigger('change');
  $("#nuevoBannerAdministrador").modal("show");
};
 
 
 




//Agregar Campos Dinámicos
const addDynamicField = () => {
  $("#newRow").append(
    '<div class="input-group mt-3" id="inputFormRow">' +
    '<input class="form-control m-input" type="text" name="filtros[]" placeholder="Ingresa el valor" autocomplete="off"/>' +
    '<div class="input-group-append"><button class="btn btn-danger" id="removeRowDynamic"><i class="fas fa-minus"></i></button></div></div>'
  );
};


 


//Crear Options con DataAnidada de Combobox
const generateOptionsSelected = (id) => {
  let arrayReturn = "";
  for (xs = 0; xs < dataRegionAll.length; xs++) {
    if (dataRegionAll[xs].id == id) {
      arrayReturn +=
        "<option value='" +
        dataRegionAll[xs].id +
        "' selected>" +
        dataRegionAll[xs].nombre +
        "</option>";
    } else {
      arrayReturn +=
        "<option value='" +
        dataRegionAll[xs].id +
        "'>" +
        dataRegionAll[xs].nombre +
        "</option>";
    }
  }
  return arrayReturn;
};

//Manejar Datos de Asignación
const handleVinculosMetodos = (id) => {
  deleteArray = [];
  $("#idHandledEditar").val(id);
  $("#handledVinculos").empty();
  $.ajax({
    method: "GET",
    url: "/get-metodos-vinculados/" + id,
    dataType: "json",
    data: null,
    success: function (data) {
      if (data.length > 0) {
        for (let i = 0; data.length > i; i++) {
          let dataOptionsPersonalize = generateOptionsSelected(data[i].region);
          if (i == 0) {
            $("#handledVinculos").append(
              '<div class="col-md-4" id="inputFormRow" style="margin-bottom:11px;" ><select name="regiones[]" edit="' +
              data[i].id +
              '" class="form-control">' +
              dataOptionsPersonalize +
              "</select></div>" +
              '<div class="col-md-3"><input edit="' +
              data[i].id +
              '" class="form-control m-input" type="number" name="precios[]" value="' +
              data[i].precio +
              '" autocomplete="off"/></div>' +
              '<div class="col-md-4"><input edit="' +
              data[i].id +
              '" class="form-control m-input" type="number" name="tiempos[]" value="' +
              data[i].tiempo +
              '" placeholder="en horas"></div>' +
              '<div class="col-md-1" edit="' +
              data[i].id +
              '"><button style="border-radius:50%" class="btn btn-info" onClick="addFieldMetodo()"><i class="fas fa-plus"></i></button></div>'
            );
          } else {
            $("#handledVinculos").append(
              '<div class="col-md-4"  id="inputFormRow1" style="margin-bottom:11px;"><select name="regiones[]" class="form-control" edit="' +
              data[i].id +
              '">' +
              dataOptionsPersonalize +
              "</select></div>" +
              '<div class="col-md-3" id="inputFormRow2"><input edit="' +
              data[i].id +
              '" class="form-control m-input" type="number" name="precios[]" value="' +
              data[i].precio +
              '" autocomplete="off"/></div>' +
              '<div class="col-md-4" id="inputFormRow3"><input edit="' +
              data[i].id +
              '" class="form-control m-input" type="number" name="tiempos[]" value="' +
              data[i].tiempo +
              '" placeholder="en horas"></div>' +
              '<div class="col-md-1" id="inputFormRow4" edit="' +
              data[i].id +
              '"><button style="border-radius:50%"  class="btn btn-danger" id="removeRowDynamicMetodo"><i class="fas fa-minus"></i></button></div>'
            );
          }
        }
        $("#type-action-values").val("1");
      } else {
        $("#type-action-values").val("2");
        $("#handledVinculos").append(
          '<div class="col-md-4" id="inputFormRow" style="margin-bottom:11px;">' +
          dataSelect +
          "</div>" +
          '<div class="col-md-3"><input class="form-control m-input" type="number" name="precios[]" autocomplete="off"/></div>' +
          '<div class="col-md-4"><input class="form-control m-input" type="number" name="tiempos[]" placeholder="en horas"></div>' +
          '<div class="col-md-1"><button style="border-radius:50%" class="btn btn-info" onClick="addFieldMetodo()"><i class="fas fa-plus"></i></button></div>'
        );
      }
      $("#VinculosModalAdmin").modal("show");
    },
    error: function (e) {
      console.log(e);
    },
  });
};

const addFieldMetodo = () => {
  $("#handledVinculos").append(
    '<div class="col-md-4" id="inputFormRow1" style="margin-bottom:11px;">' +
    dataSelect +
    "</div>" +
    '<div class="col-md-3" id="inputFormRow2"><input class="form-control m-input" type="number" name="precios[]" autocomplete="off"/></div>' +
    '<div class="col-md-4" id="inputFormRow3"><input class="form-control m-input" type="number" name="tiempos[]" placeholder="en horas"></div>' +
    '<div class="col-md-1" id="inputFormRow4"><button style="border-radius:50%"  class="btn btn-danger" id="removeRowDynamicMetodo"><i class="fas fa-minus"></i></button></div>'
  );
};

// const addValuesMethod = (token) => {
//   //Variable para Validar errores
//   let errorHandled = "0";

//   let typeActionData = $("#type-action-values").val();
//   let dataMethodId = $("#idHandledEditar").val();

//   let valuesRegion = [];
//   let valuesPrecio = [];
//   let valuesHoras = [];

//   let valuesRegionEdit = [];
//   let valuesPrecioEdit = [];
//   let valuesHorasEdit = [];
//   let empresa_id = token;
//   let valuesAll = [];
//   let valuesAllEdit = [];

//   $("select[name='regiones[]']").each(function () {
//     if ($(this).attr("edit")) {
//       if ($(this).val() != "") {
//         valuesRegionEdit.push([parseInt($(this).attr("edit")), $(this).val()]);
//       } else {
//         errorHandled = "1";
//       }
//     } else {
//       if ($(this).val() != "") {
//         valuesRegion.push($(this).val());
//       } else {
//         errorHandled = "1";
//       }
//     }
//   });

//   $("input[name='precios[]']").each(function () {
//     if ($(this).attr("edit")) {
//       if ($(this).val() != "") {
//         valuesPrecioEdit.push([parseInt($(this).attr("edit")), $(this).val()]);
//       }
//     } else {
//       if ($(this).val() != "") {
//         valuesPrecio.push($(this).val());
//       } else {
//         errorHandled = "1";
//       }
//     }
//   });

//   $("input[name='tiempos[]']").each(function () {
//     if ($(this).attr("edit")) {
//       if ($(this).val() != "") {
//         valuesHorasEdit.push([parseInt($(this).attr("edit")), $(this).val()]);
//       } else {
//         errorHandled = "1";
//       }
//     } else {
//       if ($(this).val() != "") {
//         valuesHoras.push($(this).val());
//       } else {
//         errorHandled = "1";
//       }
//     }
//   });

//   if (typeActionData == "1") {
//     for (let ma = 0; valuesRegion.length > ma; ma++) {
//       valuesAll.push([
//         dataMethodId,
//         valuesPrecio[ma],
//         valuesRegion[ma],
//         valuesHoras[ma],
//       ]);
//     }

//     for (let za = 0; valuesRegionEdit.length > za; za++) {
//       valuesAllEdit.push([
//         valuesPrecioEdit[za][0],
//         dataMethodId,
//         valuesPrecioEdit[za][1],
//         valuesRegionEdit[za][1],
//         valuesHorasEdit[za][1],
//       ]);
//     }
//     if (valuesAll.length > 0 || valuesAllEdit.length > 0) {
//       if (errorHandled == "1") {
//         Swal.fire({
//           position: "center",
//           icon: "info",
//           html: "<b>Revisa que todos los campos creados hayan sido completados correctamente.</b>",
//           showConfirmButton: false,
//           timer: 2500,
//         });
//       } else {
//         $.ajax({
//           method: "POST",
//           url: "/add-values-methods",
//           dataType: "json",
//           data: {
//             valuesPost: valuesAll,
//             valuesEdit: valuesAllEdit,
//             valuesDelete: deleteArray,
//             empresa_id: token
//           },
//           success: function (data) {
//             if (data.status === "success") {
//               Swal.close();
//               window.location.reload(true);
//             } else {
//               Swal.close();
//               Swal.fire({
//                 position: "center",
//                 icon: "error",
//                 title: "Ocurrió un error interno inténtalo más tarde.",
//                 showConfirmButton: false,
//                 timer: 2500,
//               });
//             }
//           },
//           error: function () {
//             Swal.close();
//             Swal.fire({
//               position: "center",
//               icon: "error",
//               title: "Ocurrió un error interno inténtalo más tarde.",
//               showConfirmButton: false,
//               timer: 2500,
//             });
//           },
//         });
//       }
//     } else {
//       Swal.fire({
//         position: "center",
//         icon: "error",
//         title: "Debes ingresar como mínimo un valor para guardar los datos.",
//         showConfirmButton: false,
//         timer: 2500,
//       });
//     }
//   } else {
//     for (let ma = 0; valuesRegion.length > ma; ma++) {
//       valuesAll.push([
//         dataMethodId,
//         valuesPrecio[ma],
//         valuesRegion[ma],
//         valuesHoras[ma],
//         empresa_id
//       ]);
//     }
//     if (valuesAll.length > 0) {
//       if (errorHandled == "1") {
//         Swal.fire({
//           position: "center",
//           icon: "info",
//           html: "<b>Revisa que todos los campos creados hayan sido completados correctamente.</b>",
//           showConfirmButton: false,
//           timer: 2500,
//         });
//       } else {
//         Swal.showLoading();
//         $.ajax({
//           method: "POST",
//           url: "/add-values-methods",
//           dataType: "json",
//           data: { valuesPost: valuesAll, valuesEdit: [], empresa_id: token },
//           success: function (data) {
//             if (data.status === "success") {
//               Swal.close();
//               window.location.reload(true);
//             } else {
//               Swal.close();
//               Swal.fire({
//                 position: "center",
//                 icon: "error",
//                 title: "Ocurrió un error interno inténtalo más tarde.",
//                 showConfirmButton: false,
//                 timer: 2500,
//               });
//             }
//           },
//           error: function () {
//             Swal.close();
//             Swal.fire({
//               position: "center",
//               icon: "error",
//               title: "Ocurrió un error interno inténtalo más tarde.",
//               showConfirmButton: false,
//               timer: 2500,
//             });
//           },
//         });
//       }
//     } else {
//       Swal.fire({
//         position: "center",
//         icon: "error",
//         html: "<b>Debes ingresar como mínimo un valor para guardar los datos.</b>",
//         showConfirmButton: false,
//         timer: 2500,
//       });
//     }
//   }
// };



const eliminarProductos = (val, db) => {
  if (val.length === 0) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Seleccione items a eliminar.",
      showConfirmButton: false,
      timer: 2500,
    });
  } else {
    Swal.fire({
      title: "Estás Seguro de eliminar estos items?",
      text: `Se eliminaran ${val.length} items`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        accionEliminarMasa(val, db);
      }
    });
  }
};

const accionEliminarMasa = (val, db) => {
  Swal.showLoading();
  $.ajax({
    method: "delete",
    url: "/acciones-masivas",
    data: { val, db },
    dataType: "json",
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
    error: function (err) {
      console.log(err);
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


const handleChangeCalificacion = () => {
  let valueData = $("#calificacionNuevo-producto-admin").val();
  if (valueData == "0") {
    $("#comentarios-container-new").hide();
  } else {
    $("#comentarios-container-new").show();
  }
};

const handleChangeCalificacionEditar = () => {
  let valueData = $("#calificacionEditar-producto-admin").val();
  if (valueData == "0") {
    $("#comentarios-container-edit").hide();
  } else {
    $("#comentarios-container-edit").show();
  }
};



// //Portadas Actualizar
// const choiceImgSinglePortada = () => {
//   let idUpdate = $("#id-selected-portada-img").val();
//   let imagenFinal = $("#selected-img-data").val();
//   cloudinaryUpload(imagenFinal);
//   if (idUpdate && imagenFinal) {
//     Swal.showLoading();
//     $.ajax({
//       method: "GET",
//       url: "/editar",
//       dataType: "json",
//       data: {
//         nombretabla: "portada_pages",
//         nombreid: "id",
//         imagen: imagenFinal,
//         id: idUpdate,
//       },
//       success: function (data) {
//         if (data.status === "success") {
//           $("#image-data-replace" + idUpdate).attr("src", imagenFinal);
//           Swal.close();
//           $("#SelectImageFrame").modal("hide");
//         } else {
//           Swal.close();
//           Swal.fire({
//             position: "center",
//             icon: "error",
//             html: "<b>No se pudo actualizar la foto de portada.</b>",
//             showConfirmButton: false,
//             timer: 3500,
//           });
//         }
//       },
//       error: function () {
//         Swal.close();
//         Swal.fire({
//           position: "center",
//           icon: "error",
//           html: "<b>Ocurrió un error interno inténtalo más tarde.</b>",
//           showConfirmButton: false,
//           timer: 3500,
//         });
//       },
//     });
//   } else {
//     Swal.fire({
//       position: "center",
//       icon: "error",
//       html: "<b>Ocurrió un error interno inténtalo más tarde.</b>",
//       showConfirmButton: false,
//       timer: 3500,
//     });
//   }
// };


//sin uso
function cloudinaryUpload(imagePath) {
  $.ajax({
    method: "GET",
    url: "/cloudinaryUpload",
    dataType: "json",
    data: { "imagePath": imagePath },
    success: function (data) {
      console.log(data);
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
}


//Manejar filtros de SUbcategorias
const handleAddValuesFilterSubcategorias = (id) => {
  deleteArray = [];
  $("#id-grupoFiltros-values").val(id);
  $("#dataLoadingSpinner").show();
  $("#dataCompleteValue").hide();
  $("#dataCompleteValue").empty();
  $("#footerLoadValues").hide();
  $.ajax({
    method: "GET",
    url: "/get-values-filter-subcategorias/" + id,
    dataType: "json",
    data: null,
    success: function (data) {
      if (data.length > 0) {
        for (let i = 0; data.length > i; i++) {
          if (i == 0) {
            $("#dataCompleteValue").append(
              '<div class="input-group" id="inputFormRow" edit="' +
              data[i].id +
              '">' +
              '<input class="form-control m-input" value="' +
              data[i].nombre +
              '" edit="' +
              data[i].id +
              '" type="text" name="filtros[]" placeholder="Ingresa el valor" autocomplete="off"/>' +
              '<div class="input-group-append"><button class="btn btn-info" onClick="addDynamicField()"><i class="fas fa-plus"></i></button></div></div>'
            );
            $("#dataCompleteValue").append('<div id="newRow"></div>');
          } else {
            $("#newRow").append(
              '<div class="input-group mt-3" id="inputFormRow" edit="' +
              data[i].id +
              '">' +
              '<input class="form-control m-input" value="' +
              data[i].nombre +
              '" edit="' +
              data[i].id +
              '" type="text" name="filtros[]" placeholder="Ingresa el valor" autocomplete="off"/>' +
              '<div class="input-group-append"><button class="btn btn-danger" id="removeRowDynamic"><i class="fas fa-minus"></i></button></div></div>'
            );
          }
        }
        $("#type-action-values").val("1");
      } else {
        $("#type-action-values").val("2");
        $("#dataCompleteValue").append(
          '<div class="input-group" id="inputFormRow">' +
          '<input class="form-control m-input" type="text" name="filtros[]" placeholder="Ingresa el valor" autocomplete="off"/>' +
          '<div class="input-group-append"><button class="btn btn-info" onClick="addDynamicField()"><i class="fas fa-plus"></i></button></div></div>'
        );
        $("#dataCompleteValue").append('<div id="newRow"></div>');
      }
      $("#dataLoadingSpinner").hide();
      $("#dataCompleteValue").show();
      $("#footerLoadValues").show();
      $("#addFiltrosDynamic").modal("show");
    },
    error: function (e) {
      console.log(e);
    },
  });
};

// //Create FORM DATA con el PDF FILE
// const AgregarNuevoCatalogoAdmin = async () => {
//   let titulo = $("#titulo-catalogo-new").val();
//   let estado = $("#estado-catalogo-new").val();
//   let fecha_inicio = $("#estado-fecha-inicio-new").val();
//   let fecha_final = $("#estado-fecha-final-new").val();
//   let value_pdf = $("#data-route-file-new").text();
//   if (titulo && estado && fecha_inicio && fecha_final && value_pdf) {
//     var dataForm = new FormData();
//     dataForm.append("file", $("#file-pdf-new")[0].files[0]);
//     dataForm.append("titulo", titulo);
//     dataForm.append("estado", estado);
//     dataForm.append("fecha_inicio", fecha_inicio);
//     dataForm.append("fecha_final", fecha_final);
//     Swal.showLoading();
//     try {
//       let url = "subir-pdf";
//       let data = dataForm;
//       let head = { "Content-Type": "multipart/form-data" };
//       const dataFilesUpload = await axios.post(url, data, head);
//       if (dataFilesUpload.data.status == "success") {
//         Swal.close();
//         window.location.reload(true);
//       } else {
//         Swal.close();
//         Swal.fire({
//           position: "center",
//           icon: "error",
//           title: "Ocurrió un error interno inténtalo nuevamente.",
//           showConfirmButton: false,
//           timer: 2500,
//         });
//       }
//     } catch (e) {
//       console.log(e);
//       Swal.close();
//       Swal.fire({
//         position: "center",
//         icon: "error",
//         title: "Ocurrió un error interno inténtalo nuevamente.",
//         showConfirmButton: false,
//         timer: 2500,
//       });
//     }
//   } else {
//     Swal.fire({
//       position: "center",
//       icon: "info",
//       html: "<b>Debes ingresar los datos requeridos para crear el catálogo.</b>",
//       showConfirmButton: false,
//       timer: 3500,
//     });
//   }
// };

//Eliminar Pdf registro y Archivo
const deleteHandlePdf = (val) => {
  Swal.fire({
    title: "Estás Seguro?",
    html: "<b>No podras revertir esta acción</b>",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Eliminar!",
  }).then((result) => {
    if (result.isConfirmed) {
      handleDeletePDF(val);
    }
  });
};

const handleDeletePDF = (val) => {
  Swal.showLoading();
  $.ajax({
    method: "POST",
    url: "/delete-pdf-row",
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

// //Agregar Nuevo Catálogo por imágenes subidas del usuario
// const AgregarNuevoCatalogoAdminImagenes = async () => {
//   let titulo = $("#titulo-catalogo-new-imagenes").val();
//   let estado = $("#estado-catalogo-new-imagenes").val();
//   let fecha_inicio = $("#estado-fecha-inicio-new-imagenes").val();
//   let fecha_final = $("#estado-fecha-final-new-imagenes").val();
//   let images_data = myDropzone.files.length;
//   if (titulo && estado && fecha_inicio && fecha_final && images_data > 0) {
//     Swal.showLoading();
//     var dataForm = new FormData();
//     myDropzone.files.forEach((file) => {
//       dataForm.append("multimedia", file);
//     });
//     dataForm.append("titulo", titulo);
//     dataForm.append("estado", estado);
//     dataForm.append("fecha_inicio", fecha_inicio);
//     dataForm.append("fecha_final", fecha_final);

//     try {
//       let url = "crear-catalogo-imagenes";
//       let data = dataForm;
//       let head = { "Content-Type": "multipart/form-data" };
//       const dataFilesUpload = await axios.post(url, data, head);
//       if (dataFilesUpload.data.status == "success") {
//         Swal.close();
//         window.location.reload(true);
//       } else {
//         Swal.close();
//         Swal.fire({
//           position: "center",
//           icon: "error",
//           title: "Ocurrió un error interno inténtalo nuevamente.",
//           showConfirmButton: false,
//           timer: 2500,
//         });
//       }
//     } catch (e) {
//       Swal.close();
//       Swal.fire({
//         position: "center",
//         icon: "error",
//         title: "Ocurrió un error interno inténtalo nuevamente.",
//         showConfirmButton: false,
//         timer: 2500,
//       });
//     }
//   } else {
//     Swal.fire({
//       position: "center",
//       icon: "info",
//       html: "<b>Debes ingresar los datos requeridos para crear el catálogo.</b>",
//       showConfirmButton: false,
//       timer: 3500,
//     });
//   }
// };

// //Activar y Desactivar Estado de los Catálogos
// const handleStateCatalogo = (id, val) => {
//   Swal.showLoading();
//   $.ajax({
//     method: "GET",
//     url: "/editar",
//     dataType: "json",
//     data: { nombretabla: "catalogos", nombreid: "id", id: id, estado: val },
//     success: function (data) {
//       if (data.status == "success") {
//         Swal.close();
//         window.location.reload(true);
//       } else {
//         Swal.close();
//         Swal.fire({
//           position: "center",
//           icon: "error",
//           title: "No se pudo actualizar la categoría.",
//           showConfirmButton: false,
//           timer: 2500,
//         });
//       }
//     },
//     error: function () {
//       Swal.close();
//       Swal.fire({
//         position: "center",
//         icon: "error",
//         title: "Ocurrió un error interno inténtalo más tarde.",
//         showConfirmButton: false,
//         timer: 2500,
//       });
//     },
//   });
// };

// //Mostrar Modal con el PDF para previsualización
// const handlePreviewPDF = (pdflink) => {
//   $("#data-pdf-change").attr("src", pdflink);
//   $("#previewPDFModal").modal("show");
// };






//Abrir Modal Editar Multimedia Logo
const handleModalMultimediaEditSistema = () => {
  $(".image-item-galeria-photo").css("filter", "brightness(100%)");
  typeOperation = "2";
  $("#SelectImageFrame").modal("show");
};

//AbrirModalMultimedia FAVICON
const handleModalMultimediaSistema = () => {
  $(".image-item-galeria-photo").css("filter", "brightness(100%)");
  typeOperation = "1";
  $("#SelectImageFrame").modal("show");
};

//Traer la cantidad de imágenes por paginación en Single Perfil
// const getQuantityImagesProduct = async () => {
//   try {
//     let url = "get-multimedia-data";
//     let data = null;
//     let head = { "Content-Type": "application/json" };
//     const dataFileHandled = await axios.get(url, data, head);
//     if (dataFileHandled.data) {
//       let dataFilesUpload = dataFileHandled.data.data2;
//       $("#data-paginate-images-single").attr(
//         "data-total-count",
//         dataFileHandled.data.data1
//       );
//       $("#data-paginate-images-single").pajinatify({
//         onChange: function (currentPage) {
//           let dataGetPage = parseInt(currentPage) - 1;
//           getMultimediaPagedGenericProduct(dataGetPage);
//         },
//       });
//       for (let i = 0; dataFilesUpload.length > i; i++) {
//         $("#dataRowListMultimedia-single").append(
//           "<div onClick=\"selectImageSingleProduct('" +
//           dataFilesUpload[i].id +
//           "','" +
//           dataFilesUpload[i].url +
//           '\')" class="col-6 col-md-3 mb-4 text-center">' +
//           '<div class="selectImg position-relative"><img id="mediaPhotoSingle' +
//           dataFilesUpload[i].id +
//           '" class="image-item-galeria-photo-single" src="' +
//           dataFilesUpload[i].url +
//           '"/></div>' +
//           "</div>"
//         );
//       }
//       $("#loadingDataAjax-single").hide();
//       $("#dataRowListMultimedia-single").show();
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };

//Traer la cantidad de imágenes por paginación
const getQuantityImages = async () => {
  try {
    let url = "get-multimedia-data";
    let data = null;
    let head = { "Content-Type": "application/json" };
    const dataFileHandled = await axios.get(url, data, head);
    if (dataFileHandled.data) {
      let dataFilesUpload = dataFileHandled.data.data2;
      $("#data-paginate-images").attr(
        "data-total-count",
        dataFileHandled.data.data1
      );
      $("#data-paginate-images").pajinatify({
        onChange: function (currentPage) {
          let dataGetPage = parseInt(currentPage) - 1;
          getMultimediaPagedGeneric(dataGetPage);
        },
      });
      for (let i = 0; dataFilesUpload.length > i; i++) {
        $("#dataRowListMultimedia").append(
          "<div onClick=\"selectImageSingle('" +
          dataFilesUpload[i].id +
          "','" +
          dataFilesUpload[i].url +
          '\')" class="col-6 col-md-3 mb-4 text-center">' +
          '<div class="selectImg position-relative"><img id="mediaPhoto' +
          dataFilesUpload[i].id +
          '" class="image-item-galeria-photo" src="' +
          dataFilesUpload[i].url +
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


//Abrir Modal Editar Multimedia Portada
const handleModalMultimediaEditPortada = (id) => {
  $("#id-selected-portada-img").val(id);
  $("#SelectImageFrame").modal("show");
  $(".image-item-galeria-photo").css("filter", "brightness(100%)");
};
//Manejar Imagen Principal del Producto
const handleModalMultimediaSingle = () => {
  $("#SelectImageFrameSingle").modal("show");
};

//Abrir Modal Editar Multimedia
const handleModalMultimediaEditSingle = () => {
  $("#SelectImageFrameSingle").modal("show");
  $(".image-item-galeria-photo-single").css("filter", "brightness(100%)");
};
//AbrirModalMultimedia
const handleModalMultimedia = () => {
  $("#nuevoBannerAdministrador").modal("hide");
  $("#SelectImageFrame").modal("show");
};

//Abrir Modal Editar Multimedia
const handleModalMultimediaEdit = () => {
  $("#editarBannerAdministrador").modal("hide");
  $("#SelectImageFrame").modal("show");
  $(".image-item-galeria-photo").css("filter", "brightness(100%)");
};