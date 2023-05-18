const { Router } = require("express"),
    router = Router();

const multer = require("multer");
const {catchError, getAllDataSession, notAuthorize} = require('../../helpers/modulo-tv/basicrequest.helpers');
const { dbConnection } = require('../../database/config');
const {filtrarData, getDataSistema, listarTableDinamic} = require('../../helpers/db');
const {sendDataTwoViewNew, sendDataView, sendDataViewNew, sendOnlyView} = require('../../helpers/handle-views');

const https = require("https");

const BASE_URL_USER_PHOTO = "https://tiendavirtual.online/public/";
//const BASE_URL_USER_PHOTO="http://morangesoft.com/public/";
const BASE_URL_CLIENTE="https://tiendavirtual.online/";
const url_base="https://tiendavirtual.online/";
let urlBaseSacoCita = "https://tiendavirtual.online";
let urlBaseSacoCita2 = "https://tiendavirtual.online";
let urlBaseSacoCita3 = "https://tiendavirtual.online";
let urlBaseSacoCita4 = "https://morangesoft.com/apis4";
let urlBaseHeroku = "https://tiendavirtual.online";
let urlBase = "https://tiendavirtual.online";
let urlBaseGeneric = "https://tiendavirtual.online";
let urlBaseCentroMedicoGeneric = "https://tiendavirtual.online";

let urlBaseClinicaConcebir = "https://tiendavirtual.online";
//const BASE_URL_CLIENTE="http://localhost:3000/";

//Función para Ejecutar Query
const update2 = async (query, res) => {
  try {
    let dataQuery1 = await db.query(con, query);
    if (dataQuery1.affectedRows > 0) {
      res.json({ status: "success", msg: "El registro fue actualizado exitósamente" });
    } else {

      res.json({ status: "error", msg: "No existe ningun registro con el id ingresado" });
    }
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: "Ocurrió un error interno intentalo nuevamente" });
  }
}



//Roles -- Converted
router.get("/admin-roles", (req, res) => {
  let dataView = "admin-roles";
  sendDataViewNew("roles", res, dataView, req);
});

router.get("/admin-tiendas", async (req, res) => {
  let dataView = "admin-tiendas";
  sendDataViewNew("tiendas", res, dataView, req);
});

router.get("/get-multimedia-data", async (req, res) => {
  try {
    let querySelect = "SELECT COUNT(*) from galeria_fotos";
    let result = await db.query(con, querySelect);
    let queryData =
      "SELECT * FROM galeria_fotos order by id DESC limit 16 offset 0";
    let result2 = await db.query(con, queryData);
    res.json({ data1: result[0]["COUNT(*)"], data2: result2 });
  } catch (e) {
    console.log(e);
    res.json({ data1: 0, data2: [] });
  }
});

//Conexión a la Base de Datos Interna
const { db, con } = dbConnection();

    router.get("/filtrar-datos", async (req, res) => {
      let bookStore = await filtrarData(
        req.query.tablename,
        req.query.id,
        req.query.nombreid,
        req.query.numerico
      );
      res.json(bookStore);
    });
    
    //Endpoint para crear un nuevo registro de manera genérica
    router.get("/addNuevo", async (req, res) => {
      var q = req.query;
      if (
        (q.nombretabla != undefined) &
        (q.nombretabla != "") &
        (q.nombreid != undefined) &
        (q.nombreid != "")
      ) {
        var fields = "";
        var values = "";
    
        var contador = 0;
        for (const key in q) {
          if (
            key != "id" &&
            key != "numeros" &&
            key != "nombretabla" &&
            key != "nombreid"
          ) {
            if (contador == 0) {
              fields = fields + "" + key + "";
              values = values + '"' + q[key] + '"';
            } else {
              fields = fields + ", " + key + "";
              values = values + ', "' + q[key] + '"';
            }
            contador = contador + 1;
          }
        }
    
        if ((q.numeros != "") & (q.numeros != undefined)) {
          var numeros = q.numeros;
          for (const key in numeros) {
            if ((numeros[key] == "") & (numeros[key] == undefined)) {
              res.json({
                status: "error",
                msg: "Uno de los elementos númericos no esta definido",
              });
            } else {
              if (key != "nombretabla" && key != "nombreid") {
                var streetfield = numeros[key].split(":")[0];
                var streetvalue = numeros[key].split(":")[1];
                if (contador == 0) {
                  fields = streetfield;
                  values = streetvalue;
                } else {
                  fields = fields + ", " + streetfield;
                  values = values + ", " + streetvalue;
                }
                contador = contador + 1;
              }
            }
          }
        }
    
        var nombretabla = q.nombretabla;
        var nombreid = q.nombreid;
        var querycheck =
          "SELECT * FROM " +
          nombretabla +
          " where " +
          nombreid +
          "='" +
          q.id +
          "' limit 1";
        if (q.id) {
          fields = nombreid + ", " + fields;
          values = "'" + q.id + "', " + values;
        }
    
        var query =
          "INSERT INTO " + nombretabla + " (" + fields + ") VALUES(" + values + ")";
        return await add3(querycheck, query, res, q);
      }
    });
    
    //Endpoint para Editar Tablas Genéricas
    router.get("/editar", async (req, res) => {
      var q = req.query;
      var set = "";
      if (
        (q.nombretabla != undefined) &
        (q.nombretabla != "") &
        (q.id != undefined) &
        (q.id != "") &
        (q.nombreid != undefined) &
        (q.nombreid != "")
      ) {
        var contador = 0;
        for (const key in q) {
          if ((q[key] == "") & (q[key] == undefined)) {
            res.json({
              status: "error",
              msg: "Uno de los valores String no esta definido",
            });
          } else {
            if (
              key != "id" &&
              key != "numeros" &&
              key != "nombretabla" &&
              key != "nombreid"
            ) {
              if (contador == 0) {
                set = "SET " + key + "= '" + q[key] + "'";
              } else {
                set = set + ", " + key + "= '" + q[key] + "'";
              }
              contador = contador + 1;
            }
          }
        }
        if ((q.numeros != "") & (q.numeros != undefined)) {
          var numeros = q.numeros;
          for (const key in numeros) {
            if ((numeros[key] == "") & (numeros[key] == undefined)) {
              res.json({
                status: "error",
                msg: "Uno de los valores Númericos no esta definido",
              });
            } else {
              if (key != "id" && key != "nombretabla" && key != "nombreid") {
                var streetfield = numeros[key].split(":")[0];
                var streetvalue = numeros[key].split(":")[1];
                if (contador == 0) {
                  set = " SET " + streetfield + "= " + streetvalue;
                } else {
                  set = set + ", " + streetfield + "= " + streetvalue;
                }
                contador = contador + 1;
              }
            }
          }
        }
    
        var nombretabla = q.nombretabla;
        var nombreid = q.nombreid;
    
        var query =
          "UPDATE " +
          nombretabla +
          " " +
          set +
          " where " +
          nombreid +
          "='" +
          q.id +
          "'";
    
        return await update2(query, res);
      }
    });
    
    //Endpoint para eliminar registros de cualquier tabla
    router.get("/eliminar", async (req, res) => {
      var q = req.query;
      if (
        (q.nombretabla != undefined) &
        (q.nombretabla != "") &
        (q.id != undefined) &
        (q.id != "") &
        (q.nombreid != undefined) &
        (q.nombreid != "")
      ) {
        var nombretabla = q.nombretabla;
        var nombreid = q.nombreid;
    
        var query =
          "DELETE FROM " + nombretabla + " where " + nombreid + "='" + q.id + "'";
        let dataQuery1 = await db.query(con, query);
    
        if (dataQuery1.affectedRows === 1) {
          res.json({
            status: "success",
            msg: "El registro se elimino corectamente",
          });
        } else {
          res.json({
            status: "error",
            msg: "El elemento que tratas de eliminar no existe",
          });
        }
      }
    });
    
    
    //Función para los combobox data
    router.get("/data-table", async (req, res) => {
      let tableName = req.query.tableName;
      let dataTable = await listarTableDinamic(tableName);
      res.json(dataTable);
    });
    
    router.get("/", async (req, res) => {
      let dataSistema = await getDataSistema(0);
    
      res.render("modulo-usuarios/login/admin-login", { dataSistema });
    });
    
     
    
    //Módulos -- Converted
    // router.get("/admin-modulos", async (req, res) => {
    //   let token = req.session.token;
    //   let dataSession = req.session;
    //   let bookStore;
    //   let dataSistema = await getDataSistema(token);
    
    
    //   let data1 = await listarTableDinamic("modulos");
    //   let data2 = await listarTableDinamic("roles");
    
    //   if (data1.status === "error" || data2.status === "error") {
    //     res.json([]);
    //   } else {
    //     bookStore = { modulos: data1, roles: data2 };
    //     res.render("modulo-usuarios/modulos/admin-modulos", {
    //       bookStore,
    //       dataSession,
    //       dataSistema,
    //     });
    //   }
    
    // });
    
     
    
    //Promociones -- no Necesario
    router.get("/admin-promociones", (req, res) => {
      let dataView = "admin-promociones";
      sendDataViewNew("promociones", res, dataView, req);
    });
    
    
    //Cerrar sesión
    router.get("/cerrarSesion", async function (req, res) {
      try {
        const dataSession = req.session;
     
        if (dataSession.user) {
          const { correo, id } = dataSession.dataUsuario
          if (correo && id) {
            await updateSessionStatus({ correo, id }, { sessionStatus: moment().format("DD/MM/YYYY HH:mm:ss") });
          }
          res.clearCookie('authcookie');
          req.session.destroy((err) => {
    
    
    
            if (err) next(err);
          });
        }
        res.redirect("/");
      } catch (error) {
        res.redirect("/");
        console.log(error);
      }
    });
    
    router.get("/admin-categorias-almacenes/empresa/:id", async (req, res) => {
      const id = req.params.id
    
      try {
        let categoria_consulta = "SELECT * FROM categorias WHERE empresa_id=" + id;
        let categoriaFiltrada = await db.query(con, categoria_consulta);
    
        let almacenes_consulta = "SELECT * FROM almacenes WHERE empresa_id = " + id
        let almacenesFiltrada = await db.query(con, almacenes_consulta);
        res.status(200).json({ categorias: categoriaFiltrada, almacenes: almacenesFiltrada })
      } catch (e) {
        console.log(e);
        res.json("Error al procesar la solicitud");
      }
    });
    
    router.get("/admin-categorias-almacenes-prendas/empresa/:id", async (req, res) => {
      const id = req.params.id
    
      try {
        let categoria_consulta = "SELECT * FROM categorias WHERE name='Prendas' AND  empresa_id=" + id;
        let categoriaFiltrada = await db.query(con, categoria_consulta);
    
        let almacenes_consulta = "SELECT * FROM almacenes WHERE empresa_id = " + id
        let almacenesFiltrada = await db.query(con, almacenes_consulta);
        res.status(200).json({ categorias: categoriaFiltrada, almacenes: almacenesFiltrada })
      } catch (e) {
        console.log(e);
        res.json("Error al procesar la solicitud");
      }
    });
    
    //Admin - Categorías por empresa
    // router.get("/admin-categorias/empresa/:id", async (req, res) => {
    //   const id = req.params.id
    //   try {
    //     let categoria_consulta = "SELECT * FROM categorias WHERE empresa_id=" + id;
    //     let categoriaFiltrada = await db.query(con, categoria_consulta);
    
    //     res.status(200).json({ categorias: categoriaFiltrada })
    //   } catch (e) {
    //     console.log(e);
    //     res.json("Error al procesar la solicitud");
    //   }
    // });
    //Admin - SubCategorias detalle
    router.get("/get-all-subcategories/:id", async (req, res) => {
      const id = req.params.id
      try {
        let querySubCategorias =
          "SELECT * FROM  subcategorias WHERE id='" +
          id +
          "'";
    
        let resultSubCategorias = await db.query(con, querySubCategorias);
        let queryCategorias =
          "SELECT * FROM categorias WHERE empresa_id='" +
          resultSubCategorias[0].empresa_id +
          "'";
        let resultCategorias = await db.query(con, queryCategorias);
        res.json({
          status: "success",
          dataSubcategorias: resultSubCategorias,
          dataCategorias: resultCategorias,
        });
      } catch (e) {
        console.log(e);
        res.json({
          status: "error",
          message: "Error al obtener la data del Producto",
        });
      }
    });
    
    
    router.get("/grupo-filtro-obtener/:id", async (req, res) => {
      try {
    
        let queryFiltros =
          "SELECT * FROM grupo_filtro where id='" + req.params.id + "'";
    
        let resultFiltros = await db.query(con, queryFiltros);
        console.log(resultFiltros);
        let queryCategorias =
          "SELECT * FROM categorias WHERE empresa_id='" +
          resultFiltros[0].empresa_id +
          "'";
        let resultCategorias = await db.query(con, queryCategorias);
    
        res.json({
          status: "success",
          dataFiltros: resultFiltros,
          dataCategorias: resultCategorias,
        });
      } catch (e) {
        console.log(e);
        res.json({ status: "error" });
      }
    });
    
    
    //Admin - Categorías
    router.get("/admin-subcategorias-almacenes/empresa/:id", async (req, res) => {
      const id = req.params.id
      try {
        let subcategoria_consulta = "SELECT * FROM subcategorias WHERE empresa_id=" + id + " AND categoria=9999";
        let subcategoriaFiltrada = await db.query(con, subcategoria_consulta);
    
        let almacenes_consulta = "SELECT * FROM almacenes WHERE empresa_id = " + id
        let almacenesFiltrada = await db.query(con, almacenes_consulta);
        res.status(200).json({ subcategorias: subcategoriaFiltrada, almacenes: almacenesFiltrada })
      } catch (e) {
        console.log(e);
        res.json("Error al procesar la solicitud");
      }
    });
    
    
    
    
    //Admin - Catálogo
    router.get("/admin-catalogo", (req, res) => {
      let dataView = "admin-catalogo";
      sendDataViewNew("catalogos", res, dataView, req);
    });
    
     
     
    
    //Verificar Contraseña de PHP
    router.get("/verify-password/:password", (req, res) => {
      var hash = req.params.password;
      hash = hash.replace(/^\$2y(.+)$/i, "$2a$1");
      bcrypt.compare("123456", hash, function (err, resa) {
    
        res.json(resa);
      });
    });
    
    router.get("/encrypt-password/:password", (req, res) => {
      bcrypt.hash(req.params.password, 10, function (err, hash) {
        hash = hash.replace("$2a$", "$2y$");
        hash = hash.replace("$2b$", "$2y$");
        res.json(hash);
      });
    });
    
    
    //Configuración Multer
    const configuracionMulter = {
      storage: (fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, __dirname + "/public/uploads/");
        },
        filename: (req, file, cb) => {
          const extension = file.mimetype.split("/")[1];
          cb(null, `${shortid.generate()}.${extension}`);
        },
      })),
    };
    
    // //Subir varios archivos multimedia
    // const uploadMultimedia = multer(configuracionMulter).array("multimedia", 30);
    
    
    // //Subir todo el contenido Multimedia
    // router.post("/subir-multimedia", function (req, res, next) {
    //   uploadMultimedia(req, res, function (error) {
    //     if (error) {
    //       res.json({ status: "error", msg: error });
    //     } else {
    //       next();
    //     }
    //   });
    // });

//Subir todo el contenido Multimedia
router.post("/subir-pdf", function (req, res, next) {
  uploadSingle(req, res, function (error) {
    if (error) {
      res.json(error);
    } else {
      next();
    }
  });
});

router.post("/subir-pdf", function (req, res) {
  let file = __dirname + "/public/uploads/" + req.file.filename;

  let opts = {
    format: "jpg",
    out_dir: path.dirname(file),
    out_prefix: path.basename(file, path.extname(file)),
    page: 1,
  };

  pdf
    .convert(file, opts)
    .then(
      (success = async () => {
        let pdf_url = BASE_URL_USER_PHOTO + "uploads/" + req.file.filename;
        let foto_pdf_url = pdf_url.slice(0, -4);
        foto_pdf_url = foto_pdf_url + "-1.jpg";
        try {
          let queryData =
            "INSERT INTO catalogos (titulo,url,estado,fecha_inicio,fecha_fin,foto) VALUES ('" +
            req.body.titulo +
            "','" +
            pdf_url +
            "','" +
            req.body.estado +
            "','" +
            req.body.fecha_inicio +
            "','" +
            req.body.fecha_final +
            "','" +
            foto_pdf_url +
            "')";
          await db.query(con, queryData);
          res.json({
            status: "success",
            msg: "Se realizo el registro exitosamente.",
          });
        } catch (e) {
          console.log(e);
          res.json({
            status: "error",
            msg: "Error al registrar los datos intentalo nuevamente",
          });
        }
      })
    )
    .catch((error) => {
      console.log(error);
      res.json({
        status: "error",
        msg: "No se pudo crear el PDF debido a un error interno",
      });
    });
});


router.post("/crear-catalogo-imagenes", async (req, res) => {
  try {
    let archivosArray = req.files;
    let firstData = archivosArray[0].filename;
    firstData = firstData.split(".");
    firstData = firstData[0];
    const pdfkit = new PDFDocument({ size: [538, 807] });
    pdfkit.pipe(
      fs.createWriteStream(__dirname + "/public/uploads/" + firstData + ".pdf")
    );

    for (let xt = 0; xt < archivosArray.length; xt++) {
      if (xt == 0) {
        let imgTemporal =
          __dirname + "/public/uploads/" + archivosArray[xt].filename;
        pdfkit.image(imgTemporal, 0, 0);
      } else {
        pdfkit.addPage();
        let imgTemporal =
          __dirname + "/public/uploads/" + archivosArray[xt].filename;
        pdfkit.image(imgTemporal, 0, 0);
        fs.unlink(imgTemporal, (error) => {
          if (error) {
            return false;
          }
        });
      }
    }
    pdfkit.end();
    let pdf_url = BASE_URL_USER_PHOTO + "uploads/" + firstData + ".pdf";
    let foto_pdf_url =
      BASE_URL_USER_PHOTO + "uploads/" + archivosArray[0].filename;
    let queryData =
      "INSERT INTO catalogos (titulo,url,estado,fecha_inicio,fecha_fin,foto) VALUES ('" +
      req.body.titulo +
      "','" +
      pdf_url +
      "','" +
      req.body.estado +
      "','" +
      req.body.fecha_inicio +
      "','" +
      req.body.fecha_final +
      "','" +
      foto_pdf_url +
      "')";
    await db.query(con, queryData);
    res.json({ status: "success", msg: "Se creo el pdf correctamente" });
  } catch (e) {
    console.log(e);
    res.json({ status: "error" });
  }
});


router.post("/delete-multimedia", async (req, res) => {
  try {
    let linkFoto = req.body.foto;
    let dataId = req.body.id;
    let queryData = "DELETE FROM galeria_fotos WHERE id='" + dataId + "'";
    await db.query(con, queryData);
    const imagenAnteriorPath = __dirname + `/public/uploads/${linkFoto}`;
    fs.unlink(imagenAnteriorPath, (error) => {
      if (error) {
        return false;
      }
    });
    res.json({ status: "success" });
  } catch (e) {
    console.log(e);
    res.json({ status: "error" });
  }
});

router.post("/delete-pdf-row", async (req, res) => {
  let hostData = BASE_URL_USER_PHOTO + "uploads/";
  try {
    let queryData =
      "SELECT url,foto FROM catalogos WHERE id='" + req.body.id + "'";
    let result = await db.query(con, queryData);
    let pdf_name = result[0].url.replace(hostData, "");
    let foto_data = result[0].foto.replace(hostData, "");
    pdf_name = __dirname + `/public/uploads/${pdf_name}`;
    foto_data = __dirname + `/public/uploads/${foto_data}`;
    fs.unlink(pdf_name, (error) => {
      if (error) {
        return false;
      }
    });
    fs.unlink(foto_data, (error) => {
      if (error) {
        return false;
      }
    });
    let queryDelete = "DELETE FROM catalogos WHERE id='" + req.body.id + "'";
    await db.query(con, queryDelete);
    res.json({
      status: "success",
      msg: "Se elimino el registro con los archivos correctamente",
    });
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: "Error al eliminar los archivos" });
  }
});

//Cerrar sesión
router.get("/cerrarSesion", async function (req, res) {
  try {
    let queryData =
      "INSERT INTO grupo_filtro (categoria,nombre,empresa_id) VALUES ('" +
      req.body.categoria +
      "','" +
      req.body.nombre +
      "','" +
      req.body.empresa_id +
      "')";
    await db.query(con, queryData);
    res.json({ status: "success", msg: "Registro Exitóso" });
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: e });
  }
});

router.post("/update-grupoFiltros", async (req, res) => {
  try {
    let queryData =
      "UPDATE grupo_filtro set categoria='" +
      req.body.categoria +
      "',nombre='" +
      req.body.nombre +

      "' WHERE id='" +
      req.body.id +
      "'";
    await db.query(con, queryData);
    res.json({ status: "success", msg: "Actualización Exitósa" });
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: e });
  }
});

router.get("/get-values-filter/:id", async (req, res) => {
  try {
    let queryData =
      "SELECT * FROM filtros where GrupoFiltro='" + req.params.id + "'";
    let result = await db.query(con, queryData);
    res.json(result);
  } catch (e) {
    res.json([]);
  }
});

router.post("/add-values-filter", async (req, res) => {
  let arrayPost = req.body.valuesPost;

  let arrayEdit = req.body.valuesEdit;
  let arrayDelete = req.body.valuesDelete;

  try {
    if (arrayPost) {
      if (arrayPost.length > 0) {
        const sql = "SELECT categoria FROM grupo_filtro WHERE id = ?";
        let result = await db.query(con, sql, [arrayPost[0][0]]);
        arrayPost.forEach((element) => {
          element[2] = result[0].categoria
        });
        console.log(arrayPost);
        let queryData =
          "INSERT INTO filtros (GrupoFiltro,name,Categoria) VALUES ?";
        await db.query(con, queryData, [arrayPost]);
      }
    }

    if (arrayEdit) {
      if (arrayEdit.length > 0) {
        let queryEdit =
          "INSERT INTO filtros (id,name) VALUES ? ON DUPLICATE KEY UPDATE name=VALUES(name)";
        await db.query(con, queryEdit, [arrayEdit]);
      }
    }

    if (arrayDelete) {
      if (arrayDelete.length > 0) {
        let queryDelete = "DELETE FROM filtros WHERE id in (?)";
        await db.query(con, queryDelete, [arrayDelete]);
        let queryProductosFiltros =
          "DELETE FROM filtros_productos WHERE id_filtro in (?)";
        await db.query(con, queryProductosFiltros, [arrayDelete]);
      }
    }
    res.json({
      status: "success",
      msg: "Los Valores fueron Agregados Correctamente",
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: "error",
      msg: "Error al agregar los valores del filtro",
    });
  }
});

router.post("/obtain-data-by-category", async (req, res) => {
  let categoria = req.body.categoria;
  try {
    let queryDataMarcas =
      "SELECT * FROM marcas WHERE categoria='" + categoria + "'";
    let queryDataSubcategorias =
      "SELECT * FROM subcategorias WHERE categoria='" + categoria + "'";
    let queryDataFiltros =
      "SELECT fil.id,fil.name,gru.nombre as grupo_filtro FROM filtros as fil INNER JOIN grupo_filtro as gru on gru.id=fil.GrupoFiltro WHERE fil.categoria='" +
      categoria +
      "'";
    let result1 = await db.query(con, queryDataMarcas);
    let result2 = await db.query(con, queryDataSubcategorias);
    let result3 = await db.query(con, queryDataFiltros);
    res.json({ marcas: result1, subcategorias: result2, filtros: result3 });
  } catch (e) {
    console.log(e);
    res.json({ marcas: [], subcategorias: [], filtros: [] });
  }
});
 
//nuevo
router.get("/add-producto-admin/clonar/:id", async (req, res) => {
  try {
    let queryData =
      "INSERT INTO productos (subcategoria_opcion,calificaciones_status,comentarios_automaticos,stock,oferta_porcentaje,descripcion_corta,precio,name,description,Categoria,Marca,imagen,activado,destacado,galeriaFotos,is_oferta,subcategoria,usuario,tallas,colores,empresa_id) " +
      "SELECT subcategoria_opcion,calificaciones_status,comentarios_automaticos,stock,oferta_porcentaje,descripcion_corta,precio,name,description,Categoria,Marca,imagen,activado,destacado,galeriaFotos,is_oferta,subcategoria,usuario,tallas,colores,empresa_id" +
      " from productos where id=" +
      parseInt(req.params.id);

    let result = await db.query(con, queryData);
    return res.status(200).json(result);
  } catch (error) {
    throw error;
  }
});

router.get("/producto-admin-empresa/:id", async (req, res) => {
  try {

    let queryProduct =
      "SELECT * FROM productos WHERE empresa_id='" + req.params.id + "'";
    let resultProduct = await db.query(con, queryProduct);

    let queryServices =
      "SELECT * FROM cotizaciones_servicios WHERE empresa_id='" + req.params.id + "'";
    let resultServices = await db.query(con, queryServices);

    let queryTax =
      "SELECT * FROM cotizaciones_impuestos WHERE empresa_id='" + req.params.id + "'";
    let resultTax = await db.query(con, queryTax);

    let queryCustomer =
      "SELECT * FROM cotizaciones_clientes WHERE empresa_id='" + req.params.id + "'";
    let resultCustomer = await db.query(con, queryCustomer);

    return res.status(200).json({ sucess: true, servicios: resultServices, impuestos: resultTax, clientes: resultCustomer, productos: resultProduct });
  } catch (error) {
    throw error;
  }
});
router.post("/add-producto-admin", async (req, res) => {
  const role = req.session.rol_id
  let idUsuario
  if (role == 1 || role == 2) {
    idUsuario = 0
  }else{
    idUsuario = req.session.token;
  }
  
  let nombre = req.body.nombre;
  let precio = req.body.precio;
  let status = req.body.status;
  let destacado = req.body.destacado;
  let oferta = req.body.oferta;
  let categoria = req.body.categoria;
  let subcategoria = req.body.subcategoria;
  let marca = req.body.marca;
  let filtros = req.body.filtros;
  let descripcion = req.body.descripcion;
  let stock = req.body.stock;
  let ofertaValor = req.body.ofertaValor;
  let descripcionCorta = req.body.descripcionCorta;
  let urlFotoPrincipal = req.body.urlFotoPrincipal;
  let calificacionProducto = req.body.calificacionProducto;
  let comentariosProducto = req.body.comentariosProducto;
  let filterSubcategorias = req.body.subFiltro;
  let almacenes = req.body.almacenes;

  let empresa_id = req.body.empresa_id;

  try {
    let insertQuery;

    if (filterSubcategorias) {
      insertQuery =
        "INSERT INTO productos (subcategoria_opcion,calificaciones_status,comentarios_automaticos,stock,oferta_porcentaje,descripcion_corta,precio,name,description,Categoria,Marca,imagen,activado,destacado,is_oferta,subcategoria,empresa_id,usuario)" +
        "values ('" +
        filterSubcategorias +
        "','" +
        calificacionProducto +
        "','" +
        comentariosProducto +
        "'," +
        stock +
        ",'" +
        ofertaValor +
        "','" +
        descripcionCorta +
        "','" +
        precio +
        "','" +
        nombre +
        "','" +
        descripcion +
        "','" +
        categoria +
        "','" +
        marca +
        "','" +
        urlFotoPrincipal +
        "','" +
        status +
        "','" +
        destacado +
        "','" +
        oferta +
        "','" +
        subcategoria +
        "','" +
        empresa_id +
        "','" +
        idUsuario +
        "'" +
        ");";

    } else {
      insertQuery =
        "INSERT INTO productos (calificaciones_status,comentarios_automaticos,stock,oferta_porcentaje,descripcion_corta,precio,name,description,Categoria,Marca,imagen,activado,destacado,is_oferta,subcategoria,empresa_id,usuario)" +
        "values ('" +
        calificacionProducto +
        "','" +
        comentariosProducto +
        "'," +
        stock +
        ",'" +
        ofertaValor +
        "','" +
        descripcionCorta +
        "','" +
        precio +
        "','" +
        nombre +
        "','" +
        descripcion +
        "','" +
        categoria +
        "','" +
        marca +
        "','" +
        urlFotoPrincipal +
        "','" +
        status +
        "','" +
        destacado +
        "','" +
        oferta +
        "','" +
        subcategoria +
        "','" +
        empresa_id +
        "','" +
        idUsuario +
        "'" +
        ");";
    }

   const productosId= await db.query(con, insertQuery);
    if (almacenes) {

      if (almacenes.length > 0) {
        almacenes = almacenes.filter(element => element.almacenNuevo != "null");
        almacenes = almacenes.filter(element => element.stockNuevo != "");

      }
      if (almacenes.length > 0) {

        let queryStock =
          "INSERT INTO `stock` (`producto_id`, `almacen_id`, `stock`) VALUES" +
          [
            almacenes.map((field) => [
              "(LAST_INSERT_ID()",
              field.almacenNuevo,
              field.stockNuevo + ")",
            ]),
          ];

        await db.query(con, queryStock);
      }
    }

    if (filtros) {
      // let finalArrayInsertFiltros = [];
      let dataArrayId = filtros.split(",");
      let selectQuery =
        "SELECT GrupoFiltro FROM filtros where id IN (" + filtros + ")";
      let arrayGrupoFiltros = await db.query(con, selectQuery);
      // for (let i = 0; arrayGrupoFiltros.length > i; i++) {
      //   finalArrayInsertFiltros.push([
      //     LAST_INSERT_ID(),
      //     arrayGrupoFiltros[i].GrupoFiltro,
      //     dataArrayId[i],
      //   ]);
      // }

      let queryDataFilter =
        "INSERT INTO filtros_productos (id_producto,id_grupo_filtro,id_filtro) VALUES" +
        [
          arrayGrupoFiltros.map((field) => [
            "(LAST_INSERT_ID()",
            field.GrupoFiltro,
            dataArrayId + ")",
          ]),
        ];


      await db.query(con, queryDataFilter);
    }

    res.json({
      status: "success",
      msg: "El producto se registro exitósamente",
      id: productosId
    });
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: "Error al registrar el producto" });
  }
});

router.post("/add-prenda-admin", async (req, res) => {
  const role = req.session.rol_id
  let idUsuario
  if (role == 1 || role == 2) {
    idUsuario = 0
  } else {
    idUsuario = req.session.token;
  }

 
  let nombre = req.body.nombre;
  let precio = req.body.precio;
  let status = req.body.status;
  let destacado = req.body.destacado;
  let oferta = req.body.oferta;
  let categoria = req.body.categoria;
  let subcategoria = req.body.subcategoria;
  let marca = req.body.marca;
 
  let descripcion = req.body.descripcion;
  let stock = req.body.stock;
  let ofertaValor = req.body.ofertaValor;
  let descripcionCorta = req.body.descripcionCorta;
 
  let urlFotoPrincipal = req.body.urlFotoPrincipal;
  let calificacionProducto = req.body.calificacionProducto;
  let comentariosProducto = req.body.comentariosProducto;
  let filterSubcategorias = req.body.subFiltro;
  let colores = req.body.colores;
  let tallas = req.body.tallas;
  let empresa_id = req.body.empresa_id;
  let almacenes = req.body.almacenes;

  if (filterSubcategorias) {
    filterSubcategorias = filterSubcategorias
  } else {
    filterSubcategorias = 0
  }

  try {
    let insertQuery = "";
    insertQuery =
      "INSERT INTO productos (subcategoria_opcion,calificaciones_status,comentarios_automaticos,stock,oferta_porcentaje,descripcion_corta,precio,name,description,Categoria,Marca,imagen,activado,destacado,is_oferta,subcategoria,usuario,tallas,colores,empresa_id)" +
      "values ('" +
      filterSubcategorias +
      "','" +
      calificacionProducto +
      "','" +
      comentariosProducto +
      "'," +
      stock +
      ",'" +
      ofertaValor +
      "','" +
      descripcionCorta +
      "','" +
      precio +
      "','" +
      nombre +
      "','" +
      descripcion +
      "','" +
      categoria +
      "','" +
      marca +
      "','" +
      urlFotoPrincipal +
      "','" +
      status +
      "','" +
      destacado +
      "','" +
      oferta +
      "','" +
      subcategoria +
      "','" +
      idUsuario +
      "','" +
      tallas +
      "','" +
      colores +
      "','" +
      empresa_id +
      "')";
    const productosId = await db.query(con, insertQuery);

    if (almacenes) {

      if (almacenes.length > 0) {
        almacenes = almacenes.filter(element => element.almacenNuevo != "null");
        almacenes = almacenes.filter(element => element.stockNuevo != "");

      }
      if (almacenes.length > 0) {

        let queryStock =
          "INSERT INTO `stock` (`producto_id`, `almacen_id`, `stock`) VALUES" +
          [
            almacenes.map((field) => [
              "(LAST_INSERT_ID()",
              field.almacenNuevo,
              field.stockNuevo + ")",
            ]),
          ];

        await db.query(con, queryStock);
      }
    }
    res.json({
      status: "success",
      msg: "El producto se registro exitósamente",
      id: productosId
    });
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: "Error al registrar el producto" });
  }
});

router.get("/eliminar-producto-admin/:id", async (req, res) => {
  try {
    let idProducto = req.params.id;
    let queryDelete = "DELETE FROM productos WHERE id='" + idProducto + "'";
    let queryDeleteFiltros =
      "DELETE FROM filtros_productos WHERE id_producto='" + idProducto + "'";

    let queryAlmacenesElimin =
      "DELETE FROM stock WHERE producto_id='" + idProducto + "'";
    await db.query(con, queryAlmacenesElimin);

    await db.query(con, queryDelete);
    await db.query(con, queryDeleteFiltros);
    res.json({
      ok: true,
      msg: "El producto fue eliminar correctamente",
    });
  } catch (e) {
    res.json({ status: "error", msg: "El producto no se pudo eliminar" });
  }
});

// router.get("/get-all-data-tienda/:id", async (req, res) => {
//   try {
//     let queryProduct =
//       "SELECT * FROM tiendas WHERE id='" + req.params.id + "' limit 1";
//     let resultTienda = await db.query(con, queryProduct);
//     res.json({ status: "success", dataTienda: resultTienda[0] });
//   } catch (e) {
//     console.log(e);
//     res.json({
//       status: "error",
//       message: "Error al obtener la data del Producto",
//     });
//   }
// });



router.get("/get-all-data-product/:id", async (req, res) => {
  try {
    let queryProduct =
      "SELECT * FROM productos WHERE id='" + req.params.id + "' limit 1";
    let resultProduct = await db.query(con, queryProduct);
    let queryMarcas =
      "SELECT * FROM marcas WHERE categoria='" +
      resultProduct[0].categoria +
      "'";

    let queryCategorias =
      "SELECT * FROM categorias WHERE empresa_id='" +
      resultProduct[0].empresa_id +
      "'";



    let querySubcategorias =
      "SELECT * FROM subcategorias WHERE categoria='" +
      resultProduct[0].categoria +
      "'";
    let queryFiltros =
      "SELECT fil.id,fil.name,gru.nombre as grupo_filtro FROM filtros as fil INNER JOIN grupo_filtro as gru on gru.id=fil.GrupoFiltro WHERE fil.categoria='" +
      resultProduct[0].categoria +
      "'";
    let queryFiltrosProductos =
      "SELECT id_filtro from filtros_productos WHERE id_producto='" +
      req.params.id +
      "'";
    let resultOptions;
    if (resultProduct[0].subcategoria) {
      let queryDataOpcionesSubcategoria =
        "SELECT * FROM subcategorias_opciones WHERE subcategoria='" +
        resultProduct[0].subcategoria +
        "'";
      resultOptions = await db.query(con, queryDataOpcionesSubcategoria);
    } else {
      resultOptions = [];
    }
    let queryAlmacenes =
      "SELECT * FROM stock WHERE producto_id='" + req.params.id + "'";
    let getAlmacenes =
      "SELECT * FROM almacenes WHERE empresa_id='" + resultProduct[0].empresa_id +
      "'";
    let resultMarcas = await db.query(con, queryMarcas);
    let resultSubcategorias = await db.query(con, querySubcategorias);
    let resultCategorias = await db.query(con, queryCategorias);
    let resultFiltros = await db.query(con, queryFiltros);
    let resultFiltrosProducto = await db.query(con, queryFiltrosProductos);
    let resultAlmacenes = await db.query(con, queryAlmacenes);
    let resultGetAlmacenes = await db.query(con, getAlmacenes);
    res.json({
      status: "success",
      dataProducto: resultProduct[0],
      dataMarcas: resultMarcas,
      dataSubcategorias: resultSubcategorias,
      dataCategorias: resultCategorias,
      dataFiltros: resultFiltros,
      filtrosProducto: resultFiltrosProducto,
      resultOptions: resultOptions,
      almacenesCantidad: resultAlmacenes,
      almacenes: resultGetAlmacenes
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: "error",
      message: "Error al obtener la data del Producto",
    });
  }
});


router.post("/update-producto-admin", async (req, res) => {
  try {
    let id = req.body.id;
    let nombre = req.body.nombre;

    let precio = req.body.precio;
    let status = req.body.status;
    let destacado = req.body.destacado;
    let oferta = req.body.oferta;
    let categoria = req.body.categoria;
    let subcategoria = req.body.subcategoria;
    let marca = req.body.marca;
    let porcentajeOferta = req.body.porcentajeOferta;
    let stock = req.body.stock;
    let descripcion_corta = req.body.descripcionCorta;
    let filtros = req.body.filtros;
    let descripcion = req.body.descripcion;
    let typeUpdate = req.body.typeUpdate;
    let filtrosDelete = req.body.filtrosDelete;
    let calificacionProducto = req.body.calificacionProducto;
    let comentariosProducto = req.body.comentariosProducto;
    let urlFotoPrincipal = req.body.urlFotoPrincipal;
    let subcategoria_opciones = req.body.subcategorias_opciones;
    let almacenes = req.body.almacenes;
    let colores = req.body.colores;
    let tallas = req.body.tallas;
    let empresa = req.body.empresa_id;

    if (subcategoria_opciones) {
      let queryUpdateProducto =
        "UPDATE productos set subcategoria_opcion='" +
        subcategoria_opciones +
        "',imagen='" +
        urlFotoPrincipal +
        "',colores='" +
        colores +
        "',tallas='" +
        tallas +
        "',calificaciones_status='" +
        calificacionProducto +
        "',comentarios_automaticos='" +
        comentariosProducto +
        "',name='" +
        nombre +
        "',precio=" +
        precio +
        ",activado='" +
        status +
        "',destacado='" +
        destacado +
        "',is_oferta='" +
        oferta +
        "',empresa_id='" +
        empresa +
        "',Categoria='" +
        categoria +
        "',subcategoria='" +
        subcategoria +
        "',Marca='" +
        marca +
        "',oferta_porcentaje='" +
        porcentajeOferta +
        "',stock=" +
        stock +
        ",descripcion_corta='" +
        descripcion_corta +
        "',description='" +
        descripcion +
        "' WHERE Id='" +
        id +
        "' ";


      await db.query(con, queryUpdateProducto);
    } else {
      let queryUpdateProducto =
        "UPDATE productos set imagen='" +
        urlFotoPrincipal +
        "',calificaciones_status='" +
        calificacionProducto +
        "',comentarios_automaticos='" +
        comentariosProducto +
        "',name='" +
        nombre +
        "',precio=" +
        precio +
        ",activado='" +
        status +
        "',destacado='" +
        destacado +
        "',colores='" +
        colores +
        "',tallas='" +
        tallas +
        "',is_oferta='" +
        oferta +
        "',empresa_id='" +
        empresa +
        "',Categoria='" +
        categoria +
        "',subcategoria='" +
        subcategoria +
        "',Marca='" +
        marca +
        "',oferta_porcentaje='" +
        porcentajeOferta +
        "',stock=" +
        stock +
        ",descripcion_corta='" +
        descripcion_corta +
        "',description='" +
        descripcion +
        "' WHERE Id='" +
        id +
        "' ";
      await db.query(con, queryUpdateProducto);
    }

    if (almacenes) {
      if (almacenes.length > 0) {
        almacenes = almacenes.filter(element => element.almacenEditar != "null");
        almacenes = almacenes.filter(element => element.stockEditar != "");
      }
      if (almacenes.length > 0) {

        try {
          let queryAlmacenesEliminar =
            "DELETE FROM stock WHERE producto_id='" + id + "'";
          await db.query(con, queryAlmacenesEliminar);


          let queryStock =
            "INSERT INTO `stock` (`producto_id`, `almacen_id`, `stock`) VALUES" +
            [
              almacenes.map((field) => [
                "(" + id,
                field.almacenEditar,
                field.stockEditar + ")",
              ]),
            ];

          await db.query(con, queryStock);
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      let queryAlmacenesEliminar =
        "DELETE FROM stock WHERE producto_id='" + id + "'";
      await db.query(con, queryAlmacenesEliminar);
    }

    if (filtros) {
      if (typeUpdate == 1) {
        if (filtrosDelete) {
          if (filtrosDelete.length > 0) {
            let queryDelete =
              "DELETE FROM filtros_productos WHERE id_filtro in (?)";
            await db.query(con, queryDelete, [filtrosDelete]);
          }
        }

        if (filtros.length > 0) {
          let finalArrayInsertFiltros = [];
          let finalArrayFiltros = [];
          let querySelectPrev =
            "SELECT id_filtro FROM filtros_productos WHERE id_filtro in (" +
            filtros +
            ") AND id_producto='" +
            id +
            "'";
          let resultsRepeat = await db.query(con, querySelectPrev);
          let dataArrayId = filtros.split(",");

          resultsRepeat = resultsRepeat.map((item) => {
            return item.id_filtro;
          });

          for (let i = 0; dataArrayId.length > i; i++) {
            if (!resultsRepeat.includes(parseInt(dataArrayId[i]))) {
              finalArrayFiltros.push(dataArrayId[i]);
            }
          }

          if (finalArrayFiltros.length > 0) {
            let stringArrayFiltros = finalArrayFiltros.join(",");
            let selectQuery =
              "SELECT GrupoFiltro FROM filtros where id IN (" +
              stringArrayFiltros +
              ")";
            let arrayGrupoFiltros = await db.query(con, selectQuery);

            for (let xs = 0; arrayGrupoFiltros.length > xs; xs++) {
              finalArrayInsertFiltros.push([
                id,
                arrayGrupoFiltros[xs].GrupoFiltro,
                finalArrayFiltros[xs],
              ]);
            }
            let queryData =
              "INSERT INTO filtros_productos (id_producto,id_grupo_filtro,id_filtro) VALUES ?";
            await db.query(con, queryData, [finalArrayInsertFiltros]);
          }
        }
      } else {
        let queryDelete =
          "DELETE FROM filtros_productos WHERE id_producto='" + id + "'";
        await db.query(con, queryDelete);
        if (filtros.length > 0) {
          let finalArrayInsertFiltros = [];
          let dataArrayId = filtros.split(",");
          let selectQuery =
            "SELECT grupo_filtro FROM filtros where id IN (" + filtros + ")";
          let arrayGrupoFiltros = await db.query(con, selectQuery);
          for (let i = 0; arrayGrupoFiltros.length > i; i++) {
            finalArrayInsertFiltros.push([
              id,
              arrayGrupoFiltros[i].GrupoFiltro,
              dataArrayId[i],
            ]);
          }
          let queryData =
            "INSERT INTO filtros_productos (id_producto,id_grupo_filtro,id_filtro) VALUES ?";
          await db.query(con, queryData, [finalArrayInsertFiltros]);
        }
      }
    }
    res.json({ status: "success", msg: "Actualización exitósa" });
  } catch (e) {
    res.json({ status: "error", msg: "Ocurrió un error interno", e: e });
  }
});

// GET GALERY DATA
router.get("/get-galery-data/:id", async (req, res) => {
  try {
    let queryData =
      "SELECT galeria_fotos FROM  productos where id ='" + req.params.id + "'";
    let result = await db.query(con, queryData);
    res.json(result[0].galeriaFotos);
  } catch (e) {
    res.json("");
  }
});

router.get("/grupo-filtro-delete/:id", async (req, res) => {
  try {
    let queryDelete =
      "DELETE FROM grupo_filtro where id='" + req.params.id + "'";
    let queryDelete2 =
      "DELETE FROM filtros_productos where id_grupo_filtro='" +
      req.params.id +
      "'";
    await db.query(con, queryDelete);
    await db.query(con, queryDelete2);
    res.json({ status: "success" });
  } catch (e) {
    console.log(e);
    res.json({ status: "error" });
  }
});

router.post("/get-products-by-name", async (req, res) => {
  try {
    let querySearch =
      "SELECT * FROM productos where name LIKE '" + req.body.query + "%'";
    let responseProductos = await db.query(con, querySearch);
    res.json(responseProductos);
  } catch (e) {
    console.log(e);
    res.json([]);
  }
});



// router.post("/data-invoice-send", async (req, res) => {
//   let razonSocial = req.body.nombre;
//   let tipoPago = req.body.tipoPago;
//   let tipoDocumento = req.body.tipoDocumento;
//   let numeroDocumento = req.body.numeroDocumento;
//   let email = req.body.email;
//   let celular = req.body.celular;
//   let direccion = req.body.direccion;
//   let productos = req.body.productos;
//   let idInvoice;
//   let fechaFinal = moment().format("DD-MM-YYYY");
//   try {
//     let queryVerify = "SELECT * FROM metodos_facturacion where id=1";
//     let responseVerify = await db.query(con, queryVerify);
//     let querySearch =
//       "SELECT numero FROM facturas where tipo='" +
//       tipoPago +
//       "' order by id desc limit 1";
//     let responseBoletas = await db.query(con, querySearch);
//     if (responseBoletas.length > 0) {
//       idInvoice = responseBoletas[0].numero + 1;
//     } else {
//       idInvoice = 1;
//     }

//     let productosFixed = productos.map((item) => {
//       let igv = parseFloat(item.price) * 0.18;
//       let igvPriceFixed = parseFloat(item.price) + igv;
//       let igvTotal = parseFloat(item.subtotal) * 0.18;
//       let dataDescuento = "";
//       if (item.descuento != 0) {
//         dataDescuento = parseFloat(item.price) * parseFloat(item.cantidad);
//         dataDescuento = (dataDescuento * item.descuento) / 100;
//       }

//       let totalGeneral = parseFloat(item.subtotal) + igvTotal;
//       return {
//         unidad_de_medida: "NIU",
//         codigo: item.id,
//         descripcion: "Pago de " + item.name,
//         cantidad: parseFloat(item.cantidad),
//         valor_unitario: parseFloat(item.price),
//         precio_unitario: igvPriceFixed,
//         descuento: dataDescuento,
//         subtotal: parseFloat(item.subtotal),
//         tipo_de_igv: "1",
//         igv: igvTotal,
//         total: totalGeneral,
//         anticipo_regularizacion: false,
//         anticipo_documento_serie: "",
//         anticipo_documento_numero: "",
//       };
//     });

//     let total_gravada = 0;
//     let total_igv = 0;
//     let total_descuento = 0;
//     let precio_total_final = 0;
//     productosFixed.forEach(function (obj) {
//       total_gravada += parseInt(obj.subtotal);
//       total_igv += parseInt(obj.igv);
//       if (obj.descuento != "") {
//         total_descuento += parseFloat(obj.descuento);
//       }
//       precio_total_final += parseInt(obj.total);
//     });

//     let dataFinalFixed = {
//       ruta: responseVerify[0].ruta,
//       fechaFinal: fechaFinal,
//       total_descuento: total_descuento,
//       precio_total_final: precio_total_final,
//       total_igv: total_igv,
//       total_gravada: total_gravada,
//       tipoPago: tipoPago,
//       razonSocial: razonSocial,
//       tipoDocumento: tipoDocumento,
//       numeroDocumento: numeroDocumento,
//       email: email,
//       celular: celular,
//       direccion: direccion,
//       productos: productosFixed,
//       idInvoice: idInvoice,
//       token: responseVerify[0].token,
//     };
//     let urlAPI = `https://grupoinsur.pe/nubefact_inkalandia/index.php?action=nubefact`;
//     let headJSON = { "Content-Type": "application/json" };
//     const respFinal = await axios.post(urlAPI, dataFinalFixed, headJSON);
//     let datosJSON = respFinal.data;
//     if (datosJSON.errors) {
//       res.json({ status: "error", msg: datosJSON.errors });
//     } else {
//       let queryInsert =
//         "INSERT INTO facturas (enlace,enlace_pdf,precio,tipo,numero,nombre,correo,tipo_documento,numero_documento,direccion) VALUES ('" +
//         datosJSON.enlace +
//         "','" +
//         datosJSON.enlace_del_pdf +
//         "','" +
//         dataFinalFixed.precio_total_final +
//         "','" +
//         dataFinalFixed.tipoPago +
//         "'," +
//         datosJSON.numero +
//         ",'" +
//         dataFinalFixed.razonSocial +
//         "','" +
//         dataFinalFixed.email +
//         "','" +
//         dataFinalFixed.tipoDocumento +
//         "','" +
//         dataFinalFixed.numeroDocumento +
//         "','" +
//         dataFinalFixed.direccion +
//         "')";
//       await db.query(con, queryInsert);
//       const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//           user: "mbarrientos@morangesoft.com", // generated ethereal user
//           pass: "Sprite1234$", // generated ethereal password
//         },
//       });
//       let typeDataSend;
//       if (req.body.tipoPago == "1") {
//         typeDataSend = "Pago de Factura";
//       } else {
//         typeDataSend = "Pago de Boleta";
//       }

//       const mailOptions = {
//         from: "Inkalandia",
//         to: req.body.email, //correo al que se enviara
//         subject: typeDataSend,
//         text: "",
//         html:
//           "<div><b>Puedes revisar el comprobante de tu pago a través del siguiente link </b><a href=" +
//           datosJSON.enlace_del_pdf +
//           ">" +
//           datosJSON.enlace_del_pdf +
//           "</a></div>",
//       };

//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.log(error);
//         }
//       });
//       res.json({ status: "success", msg: "registro de boleta exitóso" });
//     }
//   } catch (e) {
//     console.log(e);
//     res.json({
//       status: "error",
//       msg: "Ocurrió un error interno inténtalo nuevamente más tarde.",
//     });
//   }
// });


//ENVIO MODULO 

router.post("/eliminar-data-metodos", async (req, res) => {
  let idData = req.body.id;
  try {
    let queryDelete = "DELETE FROM metodos_envio WHERE id='" + idData + "'";
    let queryDeleteGroup =
      "DELETE FROM metodos_metodos_envio_vinculados WHERE metodo='" + idData + "'";
    await db.query(con, queryDelete);
    await db.query(con, queryDeleteGroup);
    res.json({
      status: "success",
      msg: "Los registros fueron eliminados correctamente",
    });
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: e });
  }
});

router.get("/get-metodos-vinculados/:id", async (req, res) => {
  let idData = req.params.id;
  try {
    let queryData =
      "SELECT * FROM metodos_envio_vinculados WHERE metodo='" + idData + "'";
    let dataResponse = await db.query(con, queryData);
    res.json(dataResponse);
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: e });
  }
});

// router.post("/add-values-methods", async (req, res) => {
//   let arrayPost = req.body.valuesPost;
//   let arrayEdit = req.body.valuesEdit;
//   let arrayDelete = req.body.valuesDelete;
//   let empresa_id = req.body.empresa_id;

//   try {
//     if (arrayPost) {
//       if (arrayPost.length > 0) {
//         let queryData =
//           "INSERT INTO metodos_envio_vinculados (metodo,precio,region,tiempo) VALUES ?";
//         await db.query(con, queryData, [arrayPost]);
//       }
//     }

//     if (arrayEdit) {
//       if (arrayEdit.length > 0) {
//         let queryEdit =
//           `INSERT INTO metodos_envio_vinculados (id,metodo,precio,region,tiempo) VALUES ? ON DUPLICATE KEY UPDATE metodo=VALUES(metodo),precio=VALUES(precio),region=VALUES(region),tiempo=VALUES(tiempo)`;
//         await db.query(con, queryEdit, [arrayEdit]);
//       }
//     }

//     if (arrayDelete) {
//       if (arrayDelete.length > 0) {
//         let queryDelete = "DELETE FROM metodos_envio_vinculados WHERE id in (?)";
//         await db.query(con, queryDelete, [arrayDelete]);
//       }
//     }
//     res.json({
//       status: "success",
//       msg: "Los Valores fueron Agregados Correctamente",
//     });
//   } catch (e) {
//     console.log(e);
//     res.json({
//       status: "error",
//       msg: "Error al agregar los valores del filtro",
//     });
//   }
// });


// FIN ENVIO MODULO 


// router.post("/add-service-admin", async (req, res) => {
//   let metodos = req.body.metodos;
//   let dataArrayHandled = [];
//   try {
//     let queryData =
//       "INSERT INTO servicios (nombre,telefono) VALUES ('" +
//       req.body.nombre +
//       "','" +
//       req.body.telefono +
//       "')";
//     let responseData = await db.query(con, queryData);
//     for (let i = 0; metodos.length > i; i++) {
//       dataArrayHandled.push([responseData.insertId, parseInt(metodos[i])]);
//     }
//     let queryDataInsert =
//       "INSERT INTO servicios_metodos (id_servicio,id_metodo) VALUES ?";
//     await db.query(con, queryDataInsert, [dataArrayHandled]);
//     res.json({ status: "success", msg: "registro exitóso" });
//   } catch (e) {
//     console.log(e);
//     res.json({ status: "error", msg: e });
//   }
// });



router.post("/get-services-join", async (req, res) => {
  try {
    let queryData1 = "SELECT * FROM servicios WHERE id='" + req.body.val + "'";
    let queryData2 =
      "SELECT id_metodo FROM servicios_metodos WHERE id_servicio='" +
      req.body.val +
      "'";
    let response1 = await db.query(con, queryData1);
    let response2 = await db.query(con, queryData2);
    res.json({ data1: response1, data2: response2 });
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: e });
  }
});

//actualizar servicios
router.post("/update-servicio-admin", async (req, res) => {
  let arrayPost = req.body.dataMetodos;
  let arrayDelete = req.body.dataDelete;
  let nombre = req.body.nombre;
  let telefono = req.body.telefono;
  let id = req.body.id;
  try {
    let queryData =
      "UPDATE servicios set nombre='" +
      nombre +
      "',telefono='" +
      telefono +
      "' WHERE id='" +
      id +
      "'";
    await db.query(con, queryData);

    if (arrayPost) {
      if (arrayPost.length > 0) {
        let finalArrayFiltros = [];
        let querySelectPrev =
          "SELECT id_metodo FROM servicios_metodos WHERE id_metodo in (" +
          arrayPost +
          ")";
        let resultsRepeat = await db.query(con, querySelectPrev);
        let dataArrayId = arrayPost.split(",");

        resultsRepeat = resultsRepeat.map((item) => {
          return item.id_metodo;
        });

        for (let i = 0; dataArrayId.length > i; i++) {
          if (!resultsRepeat.includes(parseInt(dataArrayId[i]))) {
            finalArrayFiltros.push([dataArrayId[i], id]);
          }
        }

        if (finalArrayFiltros.length > 0) {
          let queryData =
            "INSERT INTO servicios_metodos (id_metodo,id_servicio) VALUES ?";
          await db.query(con, queryData, [finalArrayFiltros]);
        }
      }
    }

    if (arrayDelete) {
      if (arrayDelete.length > 0) {
        let queryDelete =
          "DELETE FROM servicios_metodos WHERE id_metodo in (?) AND id_servicio='" +
          id +
          "'";
        await db.query(con, queryDelete, [arrayDelete]);
      }
    }
    res.json({ status: "success", msg: "se actualizo correctamenter" });
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: e });
  }
});

// //Método para actualizarlosdatos del Chatbot
// router.post("/update-method-chatbot", async (req, res) => {
//   try {
//     let id = req.body.type;
//     let instrucciones = req.body.instrucciones;
//     let script = req.body.script;
//     let state = req.body.state;

//     if (state == "1") {
//       let queryFirstUpdate = "UPDATE chatbots set estado='0' WHERE 1>0";
//       await db.query(con, queryFirstUpdate);
//     }

//     let queryUpdate =
//       "UPDATE chatbots set script=?,instrucciones='" +
//       instrucciones +
//       "',estado='" +
//       state +
//       "' WHERE id='" +
//       id +
//       "'";
//     await db.query(con, queryUpdate, [script]);
//     res.json({
//       status: "success",
//       msg: "Se actualizo correctamente el registro",
//     });
//   } catch (e) {
//     console.log(e);
//     res.json({ status: "error", msg: "Error al realizar la petición" });
//   }
// });



// //Renderizando Vistas de Pago
// //Método Culqi
// router.post("/pago-culqi/:precio", async (req, res) => {
//   let precioData = req.params.precio + "00";
//   try {
//     let queryData = "SELECT * FROM metodos_pagos WHERE id=1 ";
//     let result = await db.query(con, queryData);
//     let carrito = req.body.carrito;
//     let token = req.body.token;
//     let valor_servicio = req.body.valor_servicio;
//     let valor_envio = req.body.valor_envio;
//     let direccion_entrega = req.body.valorAddress;
//     let valor_pago_general = req.body.sumaTotal;
//     //Crear Url de Registro Para el Pedido Temporal
//     var id_array = [];
//     var cantidad_array = [];
//     var precios_array = [];
//     for (let i = 0; carrito.length > i; i++) {
//       id_array.push(carrito[i].id);
//       cantidad_array.push(carrito[i].cantidad);
//       precios_array.push(carrito[i].precio);
//     }
//     id_array = id_array.join(",");
//     cantidad_array = cantidad_array.join(",");
//     precios_array = precios_array.join(",");

//     res.json({
//       status: "success",
//       apiKey: result[0].api_key,
//       precioData,
//       url:
//         BASE_URL_USER_PHOTO +
//         "approve-order-payment/1/" +
//         valor_pago_general +
//         "/" +
//         direccion_entrega +
//         "/" +
//         token +
//         "/" +
//         valor_servicio +
//         "/" +
//         valor_envio +
//         "/" +
//         id_array +
//         "/" +
//         precios_array +
//         "/" +
//         cantidad_array,
//     });
//   } catch (e) {
//     res.json({ status: "success", msg: "Debes enviar los datos requeridos" });
//   }
// });

// //Método Payu
// router.post("/pago-payu/:precio", async (req, res) => {
//   let precioData = req.params.precio;
//   try {
//     let queryData = "SELECT * FROM metodos_pagos WHERE id=4";
//     let result = await db.query(con, queryData);
//     let referenceCode = "InkalandiaPago-" + getUniqueValue();
//     //Generar la firma (signature) con MD5
//     let dataAllJoin =
//       result[0].api_key +
//       "~" +
//       result[0].merchant_id +
//       "~" +
//       referenceCode +
//       "~" +
//       precioData +
//       "~PEN";
//     let signature = md5(dataAllJoin);
//     let carrito = req.body.carrito;
//     let token = req.body.token;
//     let valor_servicio = req.body.valor_servicio;
//     let valor_envio = req.body.valor_envio;
//     let direccion_entrega = req.body.valorAddress;
//     let valor_pago_general = req.body.sumaTotal;
//     //Crear Url de Registro Para el Pedido Temporal
//     var id_array = [];
//     var cantidad_array = [];
//     var precios_array = [];
//     for (let i = 0; carrito.length > i; i++) {
//       id_array.push(carrito[i].id);
//       cantidad_array.push(carrito[i].cantidad);
//       precios_array.push(carrito[i].precio);
//     }
//     id_array = id_array.join(",");
//     cantidad_array = cantidad_array.join(",");
//     precios_array = precios_array.join(",");
//     let dataQueryAdress =
//       "SELECT correo FROM direcciones WHERE id=" + direccion_entrega + "";
//     let resultQuery = await db.query(con, dataQueryAdress);
//     res.json({
//       status: "success",
//       correo: resultQuery[0].correo,
//       signature: signature,
//       referenceCode: referenceCode,
//       accountId: result[0].token,
//       merchant_id: result[0].merchant_id,
//       precioData,
//       url:
//         BASE_URL_USER_PHOTO +
//         "approve-order-payment/4/" +
//         valor_pago_general +
//         "/" +
//         direccion_entrega +
//         "/" +
//         token +
//         "/" +
//         valor_servicio +
//         "/" +
//         valor_envio +
//         "/" +
//         id_array +
//         "/" +
//         precios_array +
//         "/" +
//         cantidad_array,
//     });
//   } catch (e) {
//     console.log(e);
//     res.json({ status: "error" });
//   }
// });

// //Metodo para generar Pago con PAGOEFECTIVO
// router.post("/pago-efectivo", async (req, res) => {
//   let pago = req.body.sumaTotal;
//   let pagoConcepto = req.body.descripcion;
//   let pagoInfo = req.body.infoAdicional;
//   let userPago = req.body.email;
//   let nombreUser = req.body.nombre;
//   let apellidoUser = req.body.apellido;
//   let userCountry = "PERU";
//   let userId = req.body.token;
//   let transactionId = getUniqueValue();
//   try {
//     let queryData = "SELECT * FROM metodos_pagos WHERE id=5";
//     let result = await db.query(con, queryData);
//     let dataFinalFixed = {
//       data: {
//         currency: "PEN",
//         amount: pago,
//         transactionCode: transactionId,
//         dataExpiry: "",
//         paymentConcept: pagoConcepto,
//         additionalData: pagoInfo,
//         adminEmail: "admin@inkaladia.com",
//         userEmail: userPago,
//         userName: nombreUser,
//         userLastName: apellidoUser,
//         userCountry: userCountry,
//         userId: userId,
//         serviceId: 20,
//       },
//       id_comercio: result[0].merchant_id,
//       acces_key: result[0].api_key,
//       secret_key: result[0].token,
//     };
//     let urlAPI = "https://grupoinsur.pe/pago-efectivo-api/index.php?type=dev";
//     let headJSON = { "Content-Type": "application/json" };
//     const respFinal = await axios.post(urlAPI, dataFinalFixed, headJSON);

//     let carrito = req.body.carrito;
//     let token = req.body.token;
//     let valor_servicio = req.body.valor_servicio;
//     let valor_envio = req.body.valor_envio;
//     let direccion_entrega = req.body.valorAddress;
//     let valor_pago_general = req.body.sumaTotal;
//     //Crear Url de Registro Para el Pedido Temporal
//     var id_array = [];
//     var cantidad_array = [];
//     var precios_array = [];
//     for (let i = 0; carrito.length > i; i++) {
//       id_array.push(carrito[i].id);
//       cantidad_array.push(carrito[i].cantidad);
//       precios_array.push(carrito[i].precio);
//     }

//     let queryInsertPedido =
//       "INSERT INTO pedidos (usuario,tipo_pago,valor_servicio,valor_env,direccion_entrega,suma_subtotal,estado,cip) VALUES" +
//       " (" +
//       token +
//       ",5," +
//       valor_servicio +
//       "," +
//       valor_envio +
//       "," +
//       direccion_entrega +
//       ",'" +
//       valor_pago_general +
//       "','0','" +
//       respFinal.data.data.cip +
//       "')";
//     let resultQuery = await db.query(con, queryInsertPedido);

//     if (resultQuery.insertId) {
//       let finalArrayDataInsert = [];
//       for (let i = 0; precios_array.length > i; i++) {
//         finalArrayDataInsert.push([
//           id_array[i],
//           resultQuery.insertId,
//           parseFloat(cantidad_array[i]),
//           parseFloat(precios_array[i]),
//         ]);
//       }

//       let queryData2 =
//         "INSERT INTO pedido_productos (id_producto,id_pedido,cantidad,precio) VALUES ?";
//       await db.query(con, queryData2, [finalArrayDataInsert]);

//       res.json({ status: "success", pagoResponse: respFinal.data });
//     } else {
//       res.json({ status: "error" });
//     }
//   } catch (e) {
//     console.log(e);
//     res.json({ status: "error", msg: "Error al realizar la transacción" });
//   }
// });

// //Método para generar Pago Paypal
// router.post("/pago-paypal/:pago", async (req, res) => {
//   let pago = req.params.pago;
//   try {
//     let queryData = "SELECT * FROM metodos_pagos WHERE id=7";
//     let carrito = req.body.carrito;
//     let token = req.body.token;
//     let valor_servicio = req.body.valor_servicio;
//     let valor_envio = req.body.valor_envio;
//     let direccion_entrega = req.body.valorAddress;
//     let valor_pago_general = req.body.sumaTotal;
//     //Crear Url de Registro Para el Pedido Temporal
//     var id_array = [];
//     var cantidad_array = [];
//     var precios_array = [];
//     for (let i = 0; carrito.length > i; i++) {
//       id_array.push(carrito[i].id);
//       cantidad_array.push(carrito[i].cantidad);
//       precios_array.push(carrito[i].precio);
//     }
//     id_array = id_array.join(",");
//     cantidad_array = cantidad_array.join(",");
//     precios_array = precios_array.join(",");

//     let result = await db.query(con, queryData);
//     res.json({
//       status: "success",
//       pago: pago,
//       clientId: result[0].api_key,
//       url:
//         BASE_URL_USER_PHOTO +
//         "approve-order-payment/7/" +
//         valor_pago_general +
//         "/" +
//         direccion_entrega +
//         "/" +
//         token +
//         "/" +
//         valor_servicio +
//         "/" +
//         valor_envio +
//         "/" +
//         id_array +
//         "/" +
//         precios_array +
//         "/" +
//         cantidad_array,
//     });
//   } catch (e) {
//     console.log(e);
//     res.json({ status: "error", msg: "Error al realizar la transacción" });
//   }
// });

// //Método para generar Mercado Pago
// router.post("/mercado-pago/:pago", async (req, res) => {
//   let precio = parseFloat(req.params.pago);
//   try {
//     let queryData = "SELECT * FROM metodos_pagos WHERE id=2";
//     let result = await db.query(con, queryData);
//     mercadopago.configure({
//       access_token: result[0].api_key,
//     });

//     let carrito = req.body.carrito;
//     let token = req.body.token;
//     let valor_servicio = req.body.valor_servicio;
//     let valor_envio = req.body.valor_envio;
//     let direccion_entrega = req.body.valorAddress;
//     let valor_pago_general = req.body.sumaTotal;
//     //Crear Url de Registro Para el Pedido Temporal
//     var id_array = [];
//     var cantidad_array = [];
//     var precios_array = [];
//     for (let i = 0; carrito.length > i; i++) {
//       id_array.push(carrito[i].id);
//       cantidad_array.push(carrito[i].cantidad);
//       precios_array.push(carrito[i].precio);
//     }
//     id_array = id_array.join(",");
//     cantidad_array = cantidad_array.join(",");
//     precios_array = precios_array.join(",");
//     let preference = {
//       items: [
//         {
//           title: "Pago Inkalandia",
//           unit_price: precio,
//           quantity: 1,
//         },
//       ],
//       auto_return: "approved",
//       back_urls: {
//         success:
//           BASE_URL_USER_PHOTO +
//           "approve-order-payment/2/" +
//           valor_pago_general +
//           "/" +
//           direccion_entrega +
//           "/" +
//           token +
//           "/" +
//           valor_servicio +
//           "/" +
//           valor_envio +
//           "/" +
//           id_array +
//           "/" +
//           precios_array +
//           "/" +
//           cantidad_array,
//       },
//     };
//     mercadopago.preferences
//       .create(preference)
//       .then(function (response) {
//         res.json(response);
//       })
//       .catch(function (error) {
//         console.log(error);
//         res.json(error);
//       });
//   } catch (e) {
//     console.log(e);
//     res.json({ status: "error", msg: "Error al realizar la transacción" });
//   }
// });

// //Método para generar Pago Stripe
// router.post("/pago-stripe/:pago", async (req, res) => {
//   let pago = req.params.pago;
//   pago = pago + "00";
//   pago = parseFloat(pago);
//   try {
//     let carrito = req.body.carrito;
//     let token = req.body.token;
//     let valor_servicio = req.body.valor_servicio;
//     let valor_envio = req.body.valor_envio;
//     let direccion_entrega = req.body.valorAddress;
//     let valor_pago_general = req.body.sumaTotal;
//     //Crear Url de Registro Para el Pedido Temporal
//     var id_array = [];
//     var cantidad_array = [];
//     var precios_array = [];
//     for (let i = 0; carrito.length > i; i++) {
//       id_array.push(carrito[i].id);
//       cantidad_array.push(carrito[i].cantidad);
//       precios_array.push(carrito[i].precio);
//     }
//     id_array = id_array.join(",");
//     cantidad_array = cantidad_array.join(",");
//     precios_array = precios_array.join(",");

//     let queryData = "SELECT * FROM metodos_pagos WHERE id=8";
//     let result = await db.query(con, queryData);
//     const stripe = require("stripe")(result[0].token);
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "pen",
//             product_data: {
//               name: "Pago Inkalandia",
//             },
//             unit_amount: pago,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url:
//         BASE_URL_USER_PHOTO +
//         "approve-order-payment/8/" +
//         valor_pago_general +
//         "/" +
//         direccion_entrega +
//         "/" +
//         token +
//         "/" +
//         valor_servicio +
//         "/" +
//         valor_envio +
//         "/" +
//         id_array +
//         "/" +
//         precios_array +
//         "/" +
//         cantidad_array,
//       cancel_url: "https://google.com",
//     });
//     res.json({
//       status: "success",
//       id: session.id,
//       public_key: result[0].api_key,
//     });
//   } catch (e) {
//     console.log(e);
//     res.json({ status: "error", msg: "Error al realizar la operación." });
//   }
// });

// //Método para crear Pago de Niubiz
// router.post("/pago-niubiz", async (req, res) => {
//   try {
//     let queryData = "SELECT * FROM metodos_pagos WHERE id=11";
//     let result = await db.query(con, queryData);
//     const visa = new VisaNet({
//       user: result[0].api_key,
//       password: result[0].token,
//       merchantId: result[0].merchant_id,
//       env: "prod",
//     });
//     let carrito = req.body.carrito;
//     let token = req.body.token;
//     let valor_servicio = req.body.valor_servicio;
//     let valor_envio = req.body.valor_envio;
//     let direccion_entrega = req.body.valorAddress;
//     let valor_pago_general = req.body.sumaTotal;
//     //Crear Url de Registro Para el Pedido Temporal
//     var id_array = [];
//     var cantidad_array = [];
//     var precios_array = [];
//     for (let i = 0; carrito.length > i; i++) {
//       id_array.push(carrito[i].id);
//       cantidad_array.push(carrito[i].cantidad);
//       precios_array.push(carrito[i].precio);
//     }
//     id_array = id_array.join(",");
//     cantidad_array = cantidad_array.join(",");
//     precios_array = precios_array.join(",");
//     let dataQueryAdress =
//       "SELECT correo FROM direcciones WHERE id=" + direccion_entrega + "";
//     let resultQuery = await db.query(con, dataQueryAdress);

//     let amount = req.body.sumaTotal;
//     let clientIp = req.ip;
//     let email = resultQuery[0].correo;

//     const securityToken = await visa.createToken();

//     const body = {
//       amount,
//       channel: visa.channel,
//       antifraud: {
//         clientIp,
//         merchantDefineData: {
//           MDD1: "web",
//           MDD2: "Canl",
//           MDD3: "Canl",
//           MDD4: email,
//           MDD21: 0,
//           MDD32: email,
//           MDD75: "REGISTRADO",
//           MDD77: 7,
//         },
//       },
//     };

//     const { sessionKey, expirationTime } = await visa.createSession(
//       securityToken,
//       body
//     );

//     res.json({
//       status: "success",
//       url:
//         BASE_URL_USER_PHOTO +
//         "render-niubiz-payment/" +
//         securityToken +
//         "/" +
//         amount +
//         "/" +
//         sessionKey +
//         "/" +
//         expirationTime +
//         "/" +
//         visa.merchantId +
//         "/" +
//         amount +
//         "/" +
//         "11~" +
//         valor_pago_general +
//         "~" +
//         direccion_entrega +
//         "~" +
//         token +
//         "~" +
//         valor_servicio +
//         "~" +
//         valor_envio +
//         "~" +
//         id_array +
//         "~" +
//         precios_array +
//         "~" +
//         cantidad_array,
//     });
//   } catch (e) {
//     console.log(e);
//     res.json({ status: "error", msg: "Ocurrió un error interno." });
//   }
// });




//Agregar Nueva Ventana Emergente
router.post("/nueva-ventana-emergente", async (req, res) => {
  let imagen = req.body.imagen;
  let url = req.body.url;
  let status = req.body.estado;
  try {
    if (status == "1") {
      let queryDataUpdate =
        "UPDATE ventanas_emergentes set estado='0' WHERE 1>0";
      await db.query(con, queryDataUpdate);
    }
    let queryInsert =
      "INSERT INTO ventanas_emergentes (imagen,url,estado) VALUES ('" +
      imagen +
      "','" +
      url +
      "','" +
      status +
      "')";
    await db.query(con, queryInsert);
    res.json({
      status: "success",
      msg: "Se registro correctamente la ventana emergente",
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: "error",
      msg: "Ocurrió un error interno, intentalo nuevamente por favor",
    });
  }
});


router.get("/get-values-filter-subcategorias/:id", async (req, res) => {
  try {
    let queryData =
      "SELECT * FROM subcategorias_opciones where subcategoria='" +
      req.params.id +
      "'";
    let result = await db.query(con, queryData);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.json([]);
  }
});

 

//Obtener datos de las opciones de subcategoría
router.get("/get-data-opciones-subcategoria/:id", async (req, res) => {
  try {
    let queryData =
      "SELECT * FROM subcategorias_opciones WHERE subcategoria='" +
      req.params.id +
      "'";
    let result = await db.query(con, queryData);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});



// router.get("/data-test", async (req, res) => {
//   let dataSpace = await verifyMethodInvoice(
//     ["'PROD000121242'", "'PROD000121242472747'"],
//     [10, 2],
//     [50, 20],
//     5
//   );

//   res.json(dataSpace);
// });

// //Agregar un Nuevo Administrador
// router.post("/new-admin-user", async (req, res) => {
//   let tipo_documento = req.body.tipo_documento;
//   let numero_documento = req.body.numero_documento;
//   let nombres = req.body.nombres;
//   let apellidos = req.body.apellidos;
//   let telefono = req.body.telefono;
//   let correo = req.body.correo;
//   let password = req.body.password;
//   let modulos = req.body.modulosUsuario;
//   try {
//     let queryData =
//       "SELECT * FROM usuarios where correo='" + correo + "' limit 1";
//     let resultVerify = await db.query(con, queryData);
//     if (resultVerify.length > 0) {
//       res.json({
//         status: "error",
//         msg: "El correo ingresado esta siendo usado por otro usuario.",
//       });
//     } else {
//       password = await bcrypt.hash(password, 8);
//       let insertQuery =
//         "INSERT INTO usuarios (numero_documento,correo,clave,nombre,celular,estado,rol,tipo_documento,apellido,modulos) VALUES ('" +
//         numero_documento +
//         "','" +
//         correo +
//         "','" +
//         password +
//         "','" +
//         nombres +
//         "','" +
//         telefono +
//         "','2','admin','" +
//         tipo_documento +
//         "','" +
//         apellidos +
//         "','" +
//         modulos +
//         "')";
//       await db.query(con, insertQuery);
//       res.json({
//         status: "success",
//         msg: "Se agrego el usuario correctamente",
//       });
//     }
//   } catch (e) {
//     console.log(e);
//     res.json({
//       status: "error",
//       msg: "Ocurrió un error interno, intentalo nuevamente más tarde por favor.",
//     });
//   }
// });



// //Obtener datos para generar data en excel
// router.get("/generate-data-excel", (req, res) => {
//   let nombreTabla = req.query.tableName;
//   let urlAPI = `${urlBaseGeneric}/listar?nombretabla=` + nombreTabla;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json({ type: "success", data: datosJSON });
//       });
//     })
//     .on("error", (err) => {
//       res.json({ type: "error" });
//     });
// });

 

// //Metodo Vista para mostrar cualquier tabla
// router.get("/admin-test", async (req, res) => {
//   let q = req.query;

//   let bookStore = await listarTableDinamic(q.nombretabla);

//   if (bookStore.status === "error") {
//     res.render("admin-test", {
//       bookStore: [],
//       bookKeys: [],
//       nombretabla: q.nombretabla,
//       nombreid: q.nombreid,
//       id: null,
//       estadonombre: q.estadonombre,
//     });
//   } else {
//     let bookKeys = Object.keys(bookStore[0]);
//     let id = bookStore[0].Id;

//     res.render("admin-test", {
//       bookStore: bookStore,
//       bookKeys: bookKeys,
//       nombretabla: q.nombretabla,
//       nombreid: q.nombreid,
//       id: id,
//       estadonombre: q.estadonombre,
//     });
//   }
// });




//Módulos -- Converted
// router.get("/admin-modulos", async (req, res) => {
//   let token = req.session.token;
//   let bookStore;

//   let data1 = await listarTableDinamic("modulos");
//   let data2 = await listarTableDinamic("roles");

//   if (data1.status === "error" || data2.status === "error") {
//     res.json([]);
//   } else {
//     bookStore = { modulos: data1, roles: data2 };
//     res.render("admin-modulos", {
//       bookStore,
//     });
//   }

// });




// //Endpoint para crear un nuevo registro de manera genérica
// router.get("/addNuevo2", async (req, res) => {
//   var q = req.query;
//   console.log(q)
//   if (
//     (q.nombretabla != undefined) &
//     (q.nombretabla != "")
//   ) {
//     var fields = "";
//     var values = "";

//     var contador = 0;
//     for (const key in q) {
//       if (
//         key != "numeros" &&
//         key != "nombretabla"
//       ) {
//         if (contador == 0) {
//           fields = fields + "" + key + "";
//           values = values + '"' + q[key] + '"';
//         } else {
//           fields = fields + ", " + key + "";
//           values = values + ', "' + q[key] + '"';
//         }
//         contador = contador + 1;
//       }
//     }

//     if ((q.numeros != "") & (q.numeros != undefined)) {
//       var numeros = q.numeros;
//       for (const key in numeros) {
//         if ((numeros[key] == "") & (numeros[key] == undefined)) {
//           res.json({
//             status: "error",
//             msg: "Uno de los elementos númericos no esta definido",
//           });
//         } else {
//           if (key != "nombretabla") {
//             var streetfield = numeros[key].split(":")[0];
//             var streetvalue = numeros[key].split(":")[1];
//             if (contador == 0) {
//               fields = streetfield;
//               values = streetvalue;
//             } else {
//               fields = fields + ", " + streetfield;
//               values = values + ", " + streetvalue;
//             }
//             contador = contador + 1;
//           }
//         } s
//       }
//     }

//     var nombretabla = q.nombretabla;
//     var query =
//       "INSERT INTO " + nombretabla + " (" + fields + ") VALUES(" + values + ")";
//     console.log(query)

//     return await add4(query, res, q);
//   }
// });


// router.post("/add-values-filter-subcategorias", async (req, res) => {
//   let arrayPost = req.body.valuesPost;
//   let arrayEdit = req.body.valuesEdit;
//   let arrayDelete = req.body.valuesDelete;

//   try {
//     if (arrayPost) {
//       if (arrayPost.length > 0) {
//         let queryData =
//           "INSERT INTO subcategorias_opciones (subcategoria,nombre) VALUES ?";
//         await db.query(con, queryData, [arrayPost]);
//       }
//     }

//     if (arrayEdit) {
//       if (arrayEdit.length > 0) {
//         let queryEdit =
//           "INSERT INTO subcategorias_opciones (id,nombre) VALUES ? ON DUPLICATE KEY UPDATE nombre=VALUES(nombre)";
//         await db.query(con, queryEdit, [arrayEdit]);
//       }
//     }

//     if (arrayDelete) {
//       if (arrayDelete.length > 0) {
//         let queryDelete = "DELETE FROM subcategorias_opciones WHERE id in (?)";
//         await db.query(con, queryDelete, [arrayDelete]);
//       }
//     }

//     res.json({
//       status: "success",
//       msg: "Los Valores fueron Agregados Correctamente",
//     });
//   } catch (e) {
//     console.log(e);
//     res.json({
//       status: "error",
//       msg: "Error al agregar los valores del filtro",
//     });
//   }
// });


//Obtener configuración del libreo de reclamaciones
router.get("/configuracion-libro-reclamacion", async (req, res) => {
  try {
    let queryData = "SELECT * FROM secciones_configuracion where id=1";
    let resultData = await db.query(con, queryData);
    res.json(resultData[0]);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

//Obtener configuración del libreo de reclamaciones
router.get("/configuracion-newsletter-mail", async (req, res) => {
  try {
    let queryData = "SELECT * FROM configuracion_correos where id=1";
    let resultData = await db.query(con, queryData);
    res.json(resultData[0]);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

// //Actualizar Datos de Configuración (Libro de Reclamaciónes)
// router.post("/editar-configuracion-libro", async (req, res) => {
//   try {
//     let queryDataUpdate =
//       "UPDATE secciones_configuracion set estado='" +
//       req.body.estado +
//       "',info=?,footer=? WHERE id=1";
//     await db.query(con, queryDataUpdate, [req.body.header, req.body.footer]);
//     res.json({ status: "success", msg: "Actualización correcta." });
//   } catch (e) {
//     console.log(e);
//     res.json({ status: "error", msg: "Error al ejecutar la función" });
//   }
// });

//Método para obtener reclamo por ID
router.get("/obtener-reclamo/:id", async (req, res) => {
  let idData = req.params.id;
  try {
    let queryData = "SELECT * FROM libro_reclamaciones WHERE id=" + idData + "";
    let result = await db.query(con, queryData);
    res.json(result[0]);
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: "Error al traer los datos." });
  }
});

//Obtener datos de las opciones de subcategoría
router.get("/get-data-opciones-subcategoria/:id", async (req, res) => {
  try {
    let queryData =
      "SELECT * FROM subcategorias_opciones WHERE subcategoria='" +
      req.params.id +
      "'";
    let result = await db.query(con, queryData);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

// router.get("/admin-especialidades", (req, res) => {
//   let bookList = [];
//   let urlAPI = `${urlBaseSacoCita2}/crud_base/usuarios.php`;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         bookList = datosJSON;
//         res.render("admin-lista-usuarios", {
//           bookList,
//         });
//       });
//     })
//     .on("error", (err) => {
//       console.log("Error: " + err.message);
//       error = 1;
//       message = "Usuario y/o contraseña no válidos";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

//Metodo para listar status y pintar pug.js
router.get("/admin-status", (req, res) => {
  let finalUrl = `${urlBase}/listarStatus`;
  let dataView = "admin-status";
  let msgErrorFinal = "Error to obtain data marcas";
  sendDataView(finalUrl, res, msgErrorFinal, dataView, req);
});

//Metodo para listar Servicios y pintar pug.js
router.get("/admin-servicios", (req, res) => {
  let finalUrl = `${urlBase}/listarServicios`;
  let dataView = "admin-servicios";
  let msgErrorFinal = "Error to obtain data marcas";
  sendDataView(finalUrl, res, msgErrorFinal, dataView, req);
});

router.get("/admin-citas", (req, res) => {
  let nombretabla = "viewcitas8";
  let nombreid = "status";
  let id = "STA000000000";
  let urlAPI = `${urlBaseGeneric}/listarconcebir?nombretabla=${nombretabla}`;
  let msgerror = "Usuario y/o contraseña no válidos";
  sendDataView(urlAPI, res, msgerror, "admin-citas", req);
});


// //Endpoint Reservas - No COmpletado revisión
// router.get("/admin-reservas", (req, res) => {
//   let dataView = "admin-citas";
//   sendDataViewNew("viewcitas13", res, dataView, req);
// });

// router.get("/admin-visitas", (req, res) => {
//   let nombretabla = "viewVisitas";
//   let urlAPI = `${urlBaseGeneric}/listar?nombretabla=${nombretabla}`;
//   let msgerror = "Usuario y/o contraseña no válidos";
//   sendDataView(urlAPI, res, msgerror, "admin-visitas", req);
// });


// router.post("/removerCita", (req, res) => {
//   let bookList = [];
//   let idCita = req.body._pk_cita;
//   let urlAPI = `${urlBase}/deleteCita?id=${idCita}`;

//   let datos = [idCita];

//   if (validate(datos) != true) {
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.json(bookList);
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// router.post("/profesionalActivar", (req, res) => {
//   let idDoctor = req.body.idDoctor;
//   let data = [idDoctor];

//   let bookList = [];
//   let urlAPI = `https://fathomless-gorge-24202.herokurouter.com/profesionalActivar?id=${idDoctor}`;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         bookList = datosJSON;
//         res.render("admin-lista-usuarios", {
//           bookList,
//         });
//       });
//     })
//     .on("error", (err) => {
//       console.log("Error: " + err.message);
//       error = 1;
//       message = "Usuario y/o contraseña no válidos";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// router.post("/profesionalDesactivar", (req, res) => {
//   let idDoctor = req.body.idDoctor;
//   let datos = [idDoctor];

//   let bookList = [];
//   if (validate(datos) != true) {
//     let urlAPI = `https://fathomless-gorge-24202.herokurouter.com/profesionalDesactivar?id=${idDoctor}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-lista-usuarios", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });


// //Obtener 1 banner
// router.get("/admin-banners-one", (req, res) => {
//   let bookList = [];
//   let idBanner = req.body.idBanner;
//   let datos = [idBanner];
//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita4}/banners.php?_pk_banners=${idBanner}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-banners", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   } else {
//     console.log("Datos incompletos");
//   }
// });

// //Ingresar banner
// router.post("/admin-banners-add", (req, res) => {
//   let bookList = [];
//   let idBanner = req.body.idBanner;
//   let name = req.body.name;
//   let url = req.body.url;
//   let description = req.body.description;
//   let fechadesde = req.body.fechadesde;
//   let fechahasta = req.body.fechahasta;
//   let horadesde = req.body.horadesde;
//   let horahasta = req.body.horahasta;
//   let imagen = req.body.imagen;

//   let datos = [
//     idBanner,
//     name,
//     url,
//     description,
//     fechadesde,
//     fechahasta,
//     horadesde,
//     horahasta,
//     imagen,
//   ];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita4}/banners.php?_pk_banners=${idBanner}&name=${name}&url=${url}&description=${description}&fechadesde=${fechadesde}&fechahasta=${fechahasta}&horadesde=${horadesde}&horahasta=${horahasta}&imagen=${imagen}`;

//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-banners", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// //Ingresar banner
// router.put("/admin-banners-update", (req, res) => {
//   let bookList = [];
//   let idBanner = req.body.idBanner;
//   let name = req.body.name;
//   let url = req.body.url;
//   let description = req.body.description;
//   let fechadesde = req.body.fechadesde;
//   let fechahasta = req.body.fechahasta;
//   let horadesde = req.body.horadesde;
//   let horahasta = req.body.horahasta;
//   let imagen = req.body.imagen;

//   let datos = [
//     idBanner,
//     name,
//     url,
//     description,
//     fechadesde,
//     fechahasta,
//     horadesde,
//     horahasta,
//     imagen,
//   ];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita4}/banners.php?_pk_banners=${idBanner}&name=${name}&url=${url}&description=${description}&fechadesde=${fechadesde}&fechahasta=${fechahasta}&horadesde=${horadesde}&horahasta=${horahasta}&imagen=${imagen}`;

//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-banners", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// //Delete banner
// router.delete("/admin-banners-delete", (req, res) => {
//   let bookList = [];
//   let idBanner = req.body.idBanner;
//   let datos = [idBanner];
//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita4}/banners.php?_pk_banners=${idBanner}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-banners", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   } else {
//     console.log("Datos incompletos");
//   }
// });


// // Obtener categorias
// router.get("/listar-categorias", (req, res) => {
//   let bookList = [];
//   let urlAPI = `${urlBase}/listarCategorias`;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         bookList = datosJSON;
//         res.json(bookList);
//       });
//     })
//     .on("error", (err) => {
//       console.log("Error: " + err.message);
//       error = 1;
//       message = "Usuario y/o contraseña no válidos";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Obtener categorias one
// router.get("/admin-categorias-one", (req, res) => {
//   let bookList = [];
//   let idCategorias = req.query.idCategorias;

//   let datos = [idCategorias];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita3}/categoria.php?_pk_categorias=${idCategorias}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-categorias", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// //Ingresar categorias
// router.post("/admin-categorias-add", (req, res) => {
//   let bookList = [];
//   let idCategorias = req.body.idCategorias;
//   let name = req.body.name;
//   let description = req.body.description;
//   let idCategoriaPadre = req.body.idCategoriaPadre;
//   let fechadesde = req.body.fechadesde;
//   let fechahasta = req.body.fechahasta;
//   let horadesde = req.body.horadesde;
//   let horahasta = req.body.horahasta;
//   let imagen = req.body.imagen;

//   let datos = [
//     idCategorias,
//     name,
//     description,
//     idCategoriaPadre,
//     fechadesde,
//     fechahasta,
//     horadesde,
//     horahasta,
//     imagen,
//   ];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita3}/categoria.php?_pk_categorias=${idCategorias}&name=${name}&description=${description}&_fk_categoria_padre=${idCategoriaPadre}&fechadesde=${fechadesde}&fechahasta=${fechahasta}&horadesde=${horadesde}&horahasta=${horahasta}&imagen=${imagen}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-categorias", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// //Editar categorias
// router.put("/admin-categorias-edit", (req, res) => {
//   let bookList = [];
//   let idCategorias = req.body.idCategorias;
//   let name = req.body.name;
//   let description = req.body.description;
//   let idCategoriaPadre = req.body.idCategoriaPadre;
//   let fechadesde = req.body.fechadesde;
//   let fechahasta = req.body.fechahasta;
//   let horadesde = req.body.horadesde;
//   let horahasta = req.body.horahasta;
//   let imagen = req.body.imagen;

//   let datos = [
//     idCategorias,
//     name,
//     description,
//     idCategoriaPadre,
//     fechadesde,
//     fechahasta,
//     horadesde,
//     horahasta,
//     imagen,
//   ];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita3}/categoria.php?_pk_categorias=${idCategorias}&name=${name}&description=${description}&_fk_categoria_padre=${idCategoriaPadre}&fechadesde=${fechadesde}&fechahasta=${fechahasta}&horadesde=${horadesde}&horahasta=${horahasta}&imagen=${imagen}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-categorias", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// //Delete categorias
// router.delete("/admin-categorias-delete", (req, res) => {
//   let bookList = [];
//   let idCategorias = req.query.idCategorias;

//   let datos = [idCategorias];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita3}/categoria.php?_pk_categorias=${idCategorias}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-categorias", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });


// //Obtener configuraciones
// router.get("/admin-configuraciones", (req, res) => {
//   let bookList = [];
//   let urlAPI = `${urlBaseSacoCita3}/configuraciones.php`;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         bookList = datosJSON;
//         res.render("admin-configuraciones", {
//           bookList,
//         });
//       });
//     })
//     .on("error", (err) => {
//       console.log("Error: " + err.message);
//       error = 1;
//       message = "Usuario y/o contraseña no válidos";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Obtener configuraciones one
// router.get("/admin-configuraciones-one", (req, res) => {
//   let bookList = [];
//   let idConfiguraciones = req.query.idConfiguraciones;

//   let datos = [idConfiguraciones];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita3}/configuraciones.php?_pk_configuraciones=${idConfiguraciones}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-configuraciones", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// //Ingresar configuraciones
// router.post("/admin-configuraciones-add", (req, res) => {
//   let bookList = [];
//   let idConfiguracion = req.body.idConfiguracion;
//   let name = req.body.name;
//   let valor = req.body.valor;
//   let description = req.body.description;
//   let fechadesde = req.body.fechadesde;
//   let fechahasta = req.body.fechahasta;
//   let horadesde = req.body.horadesde;
//   let horahasta = req.body.horahasta;
//   let imagen = req.body.imagen;

//   let datos = [
//     idConfiguracion,
//     name,
//     valor,
//     description,
//     fechadesde,
//     fechahasta,
//     horadesde,
//     horahasta,
//     imagen,
//   ];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita3}/configuraciones.php?_pk_configuraciones=${idConfiguracion}&name=${name}&valor=${valor}&description=${description}&_fk_categoria_padre=${idCategoriaPadre}&fechadesde=${fechadesde}&fechahasta=${fechahasta}&horadesde=${horadesde}&horahasta=${horahasta}&imagen=${imagen}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-configuraciones", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// //Editar categorias
// router.put("/admin-configuraciones-edit", (req, res) => {
//   let bookList = [];
//   let idConfiguracion = req.body.idConfiguracion;
//   let name = req.body.name;
//   let valor = req.body.valor;
//   let description = req.body.description;
//   let fechadesde = req.body.fechadesde;
//   let fechahasta = req.body.fechahasta;
//   let horadesde = req.body.horadesde;
//   let horahasta = req.body.horahasta;
//   let imagen = req.body.imagen;

//   let datos = [
//     idConfiguracion,
//     name,
//     valor,
//     description,
//     fechadesde,
//     fechahasta,
//     horadesde,
//     horahasta,
//     imagen,
//   ];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita3}/configuraciones.php?_pk_configuraciones=${idConfiguracion}&name=${name}&valor=${valor}&description=${description}&_fk_categoria_padre=${idCategoriaPadre}&fechadesde=${fechadesde}&fechahasta=${fechahasta}&horadesde=${horadesde}&horahasta=${horahasta}&imagen=${imagen}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-categorias", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// //Delete configuraciones
// router.delete("/admin-configuraciones-delete", (req, res) => {
//   let bookList = [];
//   let idConfiguraciones = req.query.idConfiguraciones;

//   let datos = [idConfiguraciones];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita3}/configuraciones.php?_pk_configuraciones=${idConfiguraciones}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-configuraciones", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// //Obtener cupones
// router.get("/admin-cupones", (req, res) => {
//   let bookList = [];
//   let urlAPI = `${urlBaseSacoCita3}/cupones.php`;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         bookList = datosJSON;
//         res.render("admin-cupones", {
//           bookList,
//         });
//       });
//     })
//     .on("error", (err) => {
//       console.log("Error: " + err.message);
//       error = 1;
//       message = "Usuario y/o contraseña no válidos";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Obtener cupones one
// router.get("/admin-cupones-one", (req, res) => {
//   let bookList = [];
//   let idCupones = req.query.idCupones;

//   let datos = [idCupones];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita3}/cupones.php&idCupon=${idCupones}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-cupones", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// //Añadir cupon
// router.post("/admin-cupones-add", (req, res) => {
//   let bookList = [];
//   let idCupones = req.body.idCupones;
//   let nombreCupon = req.body.nombreCupon;
//   let descripcionCupon = req.body.descripcionCupon;
//   let codigoCupon = req.body.codigoCupon;
//   let fechaDesdeCupon = req.body.fechaDesdeCupon;
//   let fechaHastaCupon = req.body.fechaHastaCupon;
//   let horaDesdeCupon = req.body.horaDesdeCupon;
//   let horaHastaCupon = req.body.horaHastaCupon;

//   let datos = [
//     idCupones,
//     nombreCupon,
//     descripcionCupon,
//     codigoCupon,
//     fechaDesdeCupon,
//     fechaHastaCupon,
//     horaDesdeCupon,
//     horaHastaCupon,
//   ];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita3}/cupones.php&idCupon=${idCupones}&nombreCupon=${nombreCupon}&descripcionCupon=${descripcionCupon}&codigoCupon=${codigoCupon}&fechaDesdeCupon=${fechaDesdeCupon}&fechaHastaCupon=${fechaHastaCupon}&horaDesdeCupon=${horaDesdeCupon}&horaHastaCupon=${horaHastaCupon}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-cupones", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// //Actualizar cupon
// router.put("/admin-cupones-edit", (req, res) => {
//   let bookList = [];
//   let idCupones = req.body.idCupones;
//   let nombreCupon = req.body.nombreCupon;
//   let descripcionCupon = req.body.descripcionCupon;
//   let codigoCupon = req.body.codigoCupon;
//   let fechaDesdeCupon = req.body.fechaDesdeCupon;
//   let fechaHastaCupon = req.body.fechaHastaCupon;
//   let horaDesdeCupon = req.body.horaDesdeCupon;
//   let horaHastaCupon = req.body.horaHastaCupon;

//   let datos = [
//     idCupones,
//     nombreCupon,
//     descripcionCupon,
//     codigoCupon,
//     fechaDesdeCupon,
//     fechaHastaCupon,
//     horaDesdeCupon,
//     horaHastaCupon,
//   ];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita3}/cupones.php&idCupon=${idCupones}&nombreCupon=${nombreCupon}&descripcionCupon=${descripcionCupon}&codigoCupon=${codigoCupon}&fechaDesdeCupon=${fechaDesdeCupon}&fechaHastaCupon=${fechaHastaCupon}&horaDesdeCupon=${horaDesdeCupon}&horaHastaCupon=${horaHastaCupon}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-cupones", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// //Eliminar cupon
// router.delete("/admin-cupones-edit", (req, res) => {
//   let bookList = [];
//   let idCupones = req.body.idCupones;

//   let datos = [idCupones];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita3}/cupones.php&idCupon=${idCupones}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-cupones", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });



// //Add especialidad one
// router.get("/admin-especialidad-one", (req, res) => {
//   let bookList = [];
//   let idEspecialidad = req.query.idEspecialidad;

//   let datos = [idEspecialidad];

//   if (validate(datos) != true) {
//     let urlAPI = `${urlBaseSacoCita3}/especialidad.php?especialidad_id=${idEspecialidad}`;
//     https
//       .get(urlAPI, (resp) => {
//         let data = "";
//         resp.on("data", (chunk) => {
//           data += chunk;
//         });
//         resp.on("end", () => {
//           datosJSON = JSON.parse(data);
//           bookList = datosJSON;
//           res.render("admin-especialidad", {
//             bookList,
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.log("Error: " + err.message);
//         error = 1;
//         message = "Usuario y/o contraseña no válidos";
//         json_response = {
//           error: error,
//           message: message,
//         };
//         res.json(json_response);
//       });
//   }
// });

// router.get("/getSedes", (req, res) => {
//   let urlAPI = `${urlBase}/listar?nombretabla=sedes`;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// router.get("/admin-manejo-doctores", (req, res) => {
//   let finalUrl = `${urlBase}/webdoctores`;
//   let dataView = "doctoresadmin";
//   let msgErrorFinal = "Error to obtain data marcas";
//   sendDataView(finalUrl, res, msgErrorFinal, dataView, req);
// });

// router.get("/admin-pacientes", (req, res) => {
//   let finalUrl = `${urlBase}/callcenterPacientes`;
//   let dataView = "callcenter-pacientes";
//   let msgErrorFinal = "Error to obtain data marcas";
//   sendDataView(finalUrl, res, msgErrorFinal, dataView, req);
// });

// //Metodos Activar y Desactivar
// router.get("/activar-doctor", (req, res) => {
//   let id_doctor = req.query.id;
//   let urlAPI = `${urlBase}/profesionalActivar?id=` + id_doctor;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// router.get("/desactivar-doctor", (req, res) => {
//   let id_doctor = req.query.id;
//   let urlAPI = `${urlBase}/profesionalDesactivar?id=` + id_doctor;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Metodos para Confirmar y Revertir Reservas
// router.get("/confirmar-reserva", (req, res) => {
//   let id_reserva = req.query.id;
//   let urlAPI = `${urlBase}/confirmarCita?id=` + id_reserva;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// router.get("/revertir-reserva", (req, res) => {
//   let id_reserva = req.query.id;
//   let urlAPI =
//     `${urlBaseGeneric}/revertirCita?id=` + id_reserva + "&status=STA000000009";
//   console.log(urlAPI);
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Metodos para Confirmar y Eliminar Pacientes Admin
// router.get("/confirmar-paciente", (req, res) => {
//   let id_reserva = req.query.id;
//   let urlAPI = `${urlBase}/confirmarPaciente?id=` + id_reserva;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// router.get("/eliminar-paciente", (req, res) => {
//   let id_reserva = req.query.id;
//   let dni_data = req.query.dni;
//   let urlAPI =
//     `${urlBase}/eliminarPaciente?pkpaciente=` + id_reserva + `&dni=` + dni_data;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// router.get("/revertir-paciente", (req, res) => {
//   let id_reserva = req.query.id;
//   let urlAPI = `${urlBase}/revertirPaciente?id=` + id_reserva;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Agregar Categoría
// router.get("/agregar-categoria-admin", (req, res) => {
//   let name = req.query.name;
//   let description = req.query.name;
//   let id = req.query.id;
//   let imagen = req.query.imagen;
//   let status = req.query.status;

//   let urlAPI =
//     `${urlBaseGeneric}/addNuevo?nombretabla=categorias&name=` +
//     name +
//     `&description=` +
//     description +
//     `&activado=` +
//     status +
//     `&nombreid=id&id=` +
//     id +
//     `&imagen=` +
//     imagen;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Editar Categoría Admin
// router.get("/editar-categoria-admin", (req, res) => {
//   let name = req.query.name;
//   let description = req.query.name;
//   let id = req.query.id;
//   let imagen = req.query.imagen;
//   let status = req.query.status;

//   let urlAPI =
//     `${urlBaseGeneric}/editar?nombretabla=categorias&name=` +
//     name +
//     `&description=` +
//     description +
//     `&activado=` +
//     status +
//     `&nombreid=id&id=` +
//     id +
//     `&imagen=` +
//     imagen;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Eliminar Categorías Admin
// router.get("/eliminar-categoria-admin", (req, res) => {
//   let id = req.query.id;

//   let urlAPI =
//     `${urlBaseGeneric}/eliminar?nombretabla=categorias&nombreid=id&id=` + id;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Agregar Status Admin
// router.get("/agregar-status-admin", (req, res) => {
//   let id = req.query.id;
//   let nuevoNombre = req.query.nombre;
//   let urlAPI =
//     `${urlBaseGeneric}/addNuevo?nombretabla=status&nombreid=_pk_status&id=` +
//     id +
//     `&nomstatus=` +
//     nuevoNombre;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Editar Status
// router.get("/editar-status-admin", (req, res) => {
//   let id = req.query.id;
//   let nuevoNombre = req.query.nombre;
//   let urlAPI =
//     `${urlBaseGeneric}/editar?nombretabla=status&nombreid=_pk_status&id=` +
//     id +
//     `&nomstatus=` +
//     nuevoNombre;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Editar Eliminar
// router.get("/eliminar-status-admin", (req, res) => {
//   let id = req.query.id;
//   let urlAPI =
//     `${urlBaseGeneric}/eliminar?nombretabla=status&nombreid=_pk_status&id=` +
//     id;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Agregar Servicios Admin
// router.get("/agregar-servicios-admin", (req, res) => {
//   let id = req.query.id;
//   let nuevoNombre = req.query.nombre;
//   let descripcion = req.query.descripcion;
//   let imagenServicios = req.query.imagen;

//   let urlAPI =
//     `${urlBaseGeneric}/addNuevo?nombretabla=servicios&nombreid=Id&id=` +
//     id +
//     `&nombreServicio=` +
//     nuevoNombre +
//     `&descripcionServicio=` +
//     descripcion +
//     `&imagenUrlServicio=` +
//     imagenServicios;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Editar Servicios Admin
// router.get("/editar-servicios-admin", (req, res) => {
//   let id = req.query.id;
//   let nuevoNombre = req.query.nombre;
//   let descripcion = req.query.descripcion;
//   let imagenServicios = req.query.imagen;
//   let urlAPI =
//     `${urlBaseGeneric}/editar?nombretabla=servicios&nombreid=Id&id=` +
//     id +
//     `&nombreServicio=` +
//     nuevoNombre +
//     `&descripcionServicio=` +
//     descripcion +
//     `&imagenUrlServicio=` +
//     imagenServicios;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Obtener todos los doctores existentes
// router.get("/get-doctores-centro-medico-admin", (req, res) => {
//   let urlAPI = `${urlBaseGeneric}/listar?nombretabla=profesionales3`;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Metodo para Enviar Correo Electónico
// router.get("/send-mail-function", async (req, res) => {
//   try {
//     const codigoAleatorio = Math.round(Math.random() * 999999);
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: "usuario", // generated ethereal user
//         pass: "contraseña", // generated ethereal password
//       },
//     });
//     const mailOptions = {
//       from: "Testing Correo",
//       to: "rojas_miguel12@outlook.com", //correo al que se enviara
//       subject: "Prueba de Correo",
//       text: String(codigoAleatorio),
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         res.json(2);
//       } else {
//         res.json(1);
//       }
//     });
//   } catch (e) {
//     res.json(4);
//   }
// });

// //Agregar Citas
// router.get("/agregar-citas-admin", (req, res) => {
//   let id = req.query.id;
//   let uuid = req.query.uuid;
//   let paciente = req.query.paciente;
//   let doctor = req.query.doctor;
//   let sede = req.query.sede;
//   let fecha = req.query.fecha;
//   let estado = req.query.estado;
//   let tipoCita = req.query.tipoCita;
//   let hora = req.query.hora;
//   let precio = req.query.precio;

//   let urlAPI =
//     `${urlBaseCentroMedicoGeneric}/addNuevoExtra2?nombreproyecto=centromedico2&nombretabla=citas3&nombreid=_pk_cita&id=` +
//     id +
//     `&_pk_citaUUID=` +
//     uuid +
//     `&_fk_Fecha=` +
//     fecha +
//     `&_fk_paciente=` +
//     paciente +
//     `&_fk_medicoTratante=` +
//     doctor +
//     `&status=` +
//     estado +
//     `&Especialidad=` +
//     tipoCita +
//     `&horaInicio=` +
//     hora +
//     `&_fk_ubicacion=` +
//     sede +
//     `&numeros[0]=precio:` +
//     precio +
//     `&numerico=1`;
//   console.log(urlAPI);
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Obtener todos los status
// router.get("/get-status-admin-all", (req, res) => {
//   let urlAPI = `${urlBaseGeneric}/listar?nombretabla=status`;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Obtener todos los especialidad
// router.get("/get-especialidades-admin-all", (req, res) => {
//   let urlAPI = `${urlBaseGeneric}/listar?nombretabla=especialidad`;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Obtener todos los especialidad
// router.get("/get-data-filter-date", (req, res) => {
//   let type = req.query.type;
//   let date = req.query.date;
//   let urlAPI;
//   if (type === "fecha") {
//     urlAPI =
//       `${urlBase}/filtrar?nombretabla=viewcitas13&nombreid=_fk_Fecha&numerico=0&id=` +
//       date;
//   } else {
//     urlAPI =
//       `${urlBaseClinicaConcebir}/buscarFechaEmision?nombretabla=viewcitas19&nombreid=fechaemision&id=` +
//       date;
//   }
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         console.log(datosJSON);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Metodo para Filtrar por Sede
// router.get("/doctores-sede/:idSede", (req, res) => {
//   res.json(req.params.idSede);
// });

// //Obtener todos los especialidad
// router.get("/get-roles-users-all", (req, res) => {
//   let urlAPI = `${urlBaseGeneric}/listar?nombretabla=roles`;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Agregar Banner Admin
// router.get("/agregar-usuario-admin", (req, res) => {
//   let id = req.query.id;
//   let nombres = req.query.nombres;
//   let apellidos = req.query.apellidos;
//   let correo = req.query.correo;
//   let password = req.query.password;
//   let celular = req.query.celular;
//   let dni = req.query.dni;
//   let rol = req.query.rol;

//   let urlAPI =
//     `${urlBaseClinicaConcebir}/addNuevo?nombretabla=usuarios&nombreid=id&id=` +
//     id +
//     `&nombre=` +
//     nombres +
//     `&apellido=` +
//     apellidos +
//     `&correo=` +
//     correo +
//     `&clave=` +
//     password +
//     `&celular=` +
//     celular +
//     `&dni=` +
//     dni +
//     `&rol=` +
//     rol;
//   https
//     .get(urlAPI, (resp) => {
//       let data = "";
//       resp.on("data", (chunk) => {
//         data += chunk;
//       });
//       resp.on("end", () => {
//         datosJSON = JSON.parse(data);
//         res.json(datosJSON);
//       });
//     })
//     .on("error", (err) => {
//       error = 1;
//       message = "Error to connect";
//       json_response = {
//         error: error,
//         message: message,
//       };
//       res.json(json_response);
//     });
// });

// //Obtener todas las citas en un calendario
// router.get("/admin-calendario", (req, res) => {
//   let dataView = "admin-calendario";
//   sendDataViewNew("viewcitas13", res, dataView, req);
// });


module.exports = router;