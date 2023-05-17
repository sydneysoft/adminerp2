const { Router } = require("express");
const router = Router();
const ProductosController = require("../../controllers/modulo-ecommerce/productos.controller");

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const {EVResult} = require('../../middlewares/EVResult.middleware');

const { ProductoController, StockController } = require('../../controllers/modulo-ecommerce/productos');
const { CategoriaController } = require('../../controllers/modulo-ecommerce/categorias.controller');
const { AlmacenController } = require('../../controllers/modulo-ecommerce/almacenes.controller');
const { EmpresaMarketplaceController } = require('../../controllers/modulo-marketplace/empresas-marketplace.controller');
const { MarketplaceController } = require('../../controllers/modulo-marketplace/marketplace.controller');
const {ProductoGrupoMediaController} = require('../../controllers/modulo-ecommerce/productos-grupo-media.controller');
const {GaleriaFotoController} = require('../../controllers/modulo-generales/galeria-fotos.controller');

const { service: ProductoService } = ProductoController;
const { service: StockService } = StockController;
const { service: CategoriaService } = CategoriaController;
const { service: AlmacenService } = AlmacenController;
const { service: EmpresaMarketplaceService } = EmpresaMarketplaceController;
const { service: MarketplaceService } = MarketplaceController;
const { service: ProductoGrupoMediaService } = ProductoGrupoMediaController;
const { service: GaleriaFotoService } = GaleriaFotoController;


//guardo fotoos de galeria por id_grupo
// this.productos_galeria_media = new ServiceSQL("productos_grupo_media")
// this.galeria_fotos = new ServiceSQL("galeria_fotos")

router.get("/datatable/:id?", ProductoController.datatable);
router.get("/select2/:id?", ProductoController.select2);

router.get("/", async (req, res) => {
    try {
        const { role, token, dataSistema, dataSession } = await getAllDataSession(req);
        if (role == 1 || role == 2) {
            return res.render("modulo-ecommerce/productos/superadmin", {
                dataSession,
                dataSistema,
            });
        }

        return res.render("modulo-ecommerce/productos", {
            dataSession,
            dataSistema,
        });

    } catch (error) {
        return catchError(res, error);
    }
})

router.get("/empresa/:id", async (req, res) => {
    try {
        const { dataSession, dataSistema } = await getAllDataSession(req);

        return res.render("modulo-ecommerce/productos", {
            dataSession,
            dataSistema,
            empresa_id: req.params.id
        });

    } catch (error) {
        return catchError(res, error);
    }
})


router.post("/galeria", async (req, res) => {
    try {
        let last
        let checkLastGroup = await ProductoGrupoMediaService.checkLastNumber()
        if (checkLastGroup[0]) {
            last = checkLastGroup[0].id_grupo
        } else {
            last = 0
        }
        console.log("last", last)
        console.log("nuevoNumero", last)
        const nuevoNumero = last + 1
        nuevoNumero
        await ProductoService.updateById(req.body.producto_id, { galeriaFotos: nuevoNumero })


        if (Array.isArray(req.body.fotos)) {
            const fotos = req.body.fotos.map(picture =>
                ({ id_grupo: nuevoNumero, media_id: picture }));
    
            await ProductoGrupoMediaService.saveAll(fotos);
            return res.status(200).json({
                ok: true,
                msg: "El producto se registro exitósamente",
            });
        }

        return res.status(200).json({
            ok: true,
            msg: "No se registraron fotor"
        });

    } catch (error) {
        return catchError(res, error)
    }
});

router.get("/get-galery-data/:id", async (req, res) => {
    try {
        let result = await ProductoGrupoMediaService.getGaleria(req.params.id)


        res.json(result);
    } catch (e) {
        res.json("");
    }
});
router.post("/update-producto-galeria", async (req, res) => {
    let arrayUpdateImagenes = req.body.arrayUpdate;
        let grupo = req.body.id_grupo
        try {
            const guardoNuevasImagenesenGrupo = arrayUpdateImagenes.map(i => ({ id_grupo: grupo, media_id: i }))
            await ProductoGrupoMediaService.save(guardoNuevasImagenesenGrupo)
            res.json({
                status: "success",
                msg: "Se actualizó la galería de fotos exitósamente",
            });
        } catch (e) {
            return catchError(res, error);
        }
});
router.post("/delete-picture-data/:id", async (req, res) => {
    try {
        let checkGrupo = await ProductoService.getImagenByGroup(req.body.id_producto)
        console.log(checkGrupo)
        console.log(checkGrupo[0].galeriaFotos)

        await ProductoGrupoMediaService.deleteByGroupImagen(req.params.id, checkGrupo[0].galeriaFotos)
        await GaleriaFotoService.deleteById(req.params.id)


        res.json({
            status: "success",
            msg: "Se actualizó la galería de fotos exitósamente",
        });
    } catch (error) {
        return catchError(res, error);
    }
});


router.post("/", 
    check('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
    check('precio').optional().isNumeric().withMessage('El precio debe ser un número'),
    check('status').optional(),
    check('destacado').optional(),
    check('oferta').optional(),
    check('categoria').optional().isNumeric().withMessage('La categoria debe ser un número'),
    check('subcategoria').optional().isNumeric().withMessage('La subcategoria debe ser un número'),
    check('marca').optional(),
    check('filtros').optional(),
    check('descripcion').optional().isString().withMessage('La descripcion debe ser un texto'),
    check('stock').optional().isNumeric().withMessage('El stock debe ser un número'),
    check('ofertaValor').optional(),
    check('descripcionCorta').optional().isString().withMessage('La descripcion corta debe ser un texto'),
    check('urlFotoPrincipal').optional().isString().withMessage('La url de la foto principal debe ser un texto'),
    check('calificacionProducto').optional().isNumeric().withMessage('La calificacion del producto debe ser un número'),
    check('comentariosProducto').optional().isNumeric().withMessage('Los comentarios del producto debe ser un número'),
    check('subFiltro').optional(),
    check('almacenes').optional(),
    check('empresa_id').optional().isNumeric().withMessage('La empresa debe ser un número'),
    EVResult, async (req, res) => {
    // const role = req.session.rol_id
    // let idUsuario
    // if (role == 1 || role == 2) {
    //   idUsuario = 0
    // }else{
    //   idUsuario = req.session.token;
    // }
    
    // let nombre = req.body.nombre;
    // let precio = req.body.precio;
    // let status = req.body.status;
    // let destacado = req.body.destacado;
    // let oferta = req.body.oferta;
    // let categoria = req.body.categoria;
    // let subcategoria = req.body.subcategoria;
    // let marca = req.body.marca;
    // let filtros = req.body.filtros;
    // let descripcion = req.body.descripcion;
    // let stock = req.body.stock;
    // let ofertaValor = req.body.ofertaValor;
    // let descripcionCorta = req.body.descripcionCorta;
    // let urlFotoPrincipal = req.body.urlFotoPrincipal;
    // let calificacionProducto = req.body.calificacionProducto;
    // let comentariosProducto = req.body.comentariosProducto;
    // let filterSubcategorias = req.body.subFiltro;
    // let almacenes = req.body.almacenes;
  
    // let empresa_id = req.body.empresa_id;
  
    try {
    //   let insertQuery;
    const allData = matchedData(req);
    console.log(allData);
  
    //   if (filterSubcategorias) {
    //     insertQuery =
    //       "INSERT INTO productos (subcategoria_opcion,calificaciones_status,comentarios_automaticos,stock,oferta_porcentaje,descripcion_corta,precio,name,description,Categoria,Marca,imagen,activado,destacado,is_oferta,subcategoria,empresa_id,usuario)" +
    //       "values ('" +
    //       filterSubcategorias +
    //       "','" +
    //       calificacionProducto +
    //       "','" +
    //       comentariosProducto +
    //       "'," +
    //       stock +
    //       ",'" +
    //       ofertaValor +
    //       "','" +
    //       descripcionCorta +
    //       "','" +
    //       precio +
    //       "','" +
    //       nombre +
    //       "','" +
    //       descripcion +
    //       "','" +
    //       categoria +
    //       "','" +
    //       marca +
    //       "','" +
    //       urlFotoPrincipal +
    //       "','" +
    //       status +
    //       "','" +
    //       destacado +
    //       "','" +
    //       oferta +
    //       "','" +
    //       subcategoria +
    //       "','" +
    //       empresa_id +
    //       "','" +
    //       idUsuario +
    //       "'" +
    //       ");";
  
    //   } else {
    //     insertQuery =
    //       "INSERT INTO productos (calificaciones_status,comentarios_automaticos,stock,oferta_porcentaje,descripcion_corta,precio,name,description,Categoria,Marca,imagen,activado,destacado,is_oferta,subcategoria,empresa_id,usuario)" +
    //       "values ('" +
    //       calificacionProducto +
    //       "','" +
    //       comentariosProducto +
    //       "'," +
    //       stock +
    //       ",'" +
    //       ofertaValor +
    //       "','" +
    //       descripcionCorta +
    //       "','" +
    //       precio +
    //       "','" +
    //       nombre +
    //       "','" +
    //       descripcion +
    //       "','" +
    //       categoria +
    //       "','" +
    //       marca +
    //       "','" +
    //       urlFotoPrincipal +
    //       "','" +
    //       status +
    //       "','" +
    //       destacado +
    //       "','" +
    //       oferta +
    //       "','" +
    //       subcategoria +
    //       "','" +
    //       empresa_id +
    //       "','" +
    //       idUsuario +
    //       "'" +
    //       ");";
    //   }
  
    //  const productosId= await db.query(con, insertQuery);
    //   if (almacenes) {
  
    //     if (almacenes.length > 0) {
    //       almacenes = almacenes.filter(element => element.almacenNuevo != "null");
    //       almacenes = almacenes.filter(element => element.stockNuevo != "");
  
    //     }
    //     if (almacenes.length > 0) {
  
    //       let queryStock =
    //         "INSERT INTO `stock` (`producto_id`, `almacen_id`, `stock`) VALUES" +
    //         [
    //           almacenes.map((field) => [
    //             "(LAST_INSERT_ID()",
    //             field.almacenNuevo,
    //             field.stockNuevo + ")",
    //           ]),
    //         ];
  
    //       await db.query(con, queryStock);
    //     }
    //   }
  
    //   if (filtros) {
    //     // let finalArrayInsertFiltros = [];
    //     let dataArrayId = filtros.split(",");
    //     let selectQuery =
    //       "SELECT GrupoFiltro FROM filtros where id IN (" + filtros + ")";
    //     let arrayGrupoFiltros = await db.query(con, selectQuery);
    //     // for (let i = 0; arrayGrupoFiltros.length > i; i++) {
    //     //   finalArrayInsertFiltros.push([
    //     //     LAST_INSERT_ID(),
    //     //     arrayGrupoFiltros[i].GrupoFiltro,
    //     //     dataArrayId[i],
    //     //   ]);
    //     // }
  
    //     let queryDataFilter =
    //       "INSERT INTO filtros_productos (id_producto,id_grupo_filtro,id_filtro) VALUES" +
    //       [
    //         arrayGrupoFiltros.map((field) => [
    //           "(LAST_INSERT_ID()",
    //           field.GrupoFiltro,
    //           dataArrayId + ")",
    //         ]),
    //       ];
  
  
    //     await db.query(con, queryDataFilter);
    //   }
  
      res.json({
        ok: false,
        msg: "El producto se registro exitósamente",
        // id: productosId
      });
    } catch (e) {
      console.log(e);
      res.json({ status: "error", msg: "Error al registrar el producto" });
    }
  });

module.exports = router;


