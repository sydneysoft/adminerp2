const { Router } = require("express"),
  router = Router(),
  CotizacionesController = require("../../controllers/modulo-administrativo/cotizaciones.controller");
const { access_administrative } = require("../../middlewares/jwt");

const { oneOf, check, matchedData } = require('express-validator');
const puppeteer = require("puppeteer");

const { CotizacionClienteController, CotizacionController, CotizacionDetallerController, CotizacionImpuestoController, CotizacionServicioController } = require('../../controllers/modulo-administrativo/cotizaciones/index');
const { ConfiguracionSitemaController } = require('../../controllers/modulo-generales/configuracion/configuracion-sistema.controller');
const { EmpresaMarketplaceController, MarketplaceController } = require('../../controllers/modulo-marketplace');
const { ProductoController } = require('../../controllers/modulo-ecommerce/productos/productos.controller');

const { service: CotizacionService } = CotizacionController;
const { service: CotizacionDetalleService } = CotizacionDetallerController;
const { service: CotizacionClienteService } = CotizacionClienteController;
const { service: CotizacionServicioService } = CotizacionServicioController;
const { service: CotizacionImpuestoService } = CotizacionImpuestoController;
const { service: ConfiguracionSistemaService } = ConfiguracionSitemaController;
const { service: EmpresaMarketplaceService } = EmpresaMarketplaceController;
const { service: MarketplaceService } = MarketplaceController;
const { service: ProductoService } = ProductoController;

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require('../../middlewares/EVResult.middleware');

// this.service = new ServiceSQL("cotizaciones");
// this.service_detail = new ServiceSQL("cotizaciones_detalle");
// this.customer = new ServiceSQL("cotizaciones_clientes");
// this.addService = new ServiceSQL("cotizaciones_servicios");
// this.tax = new ServiceSQL("cotizaciones_impuestos");
// this.setting = new ServiceSQL("configuracion_sistema");
// this.empresa = new ServiceSQL("empresas_marketplace");
// this.marketplace = new ServiceSQL("marketplace");
// this.productos = new ServiceSQL("productos");

// router.get("/", access_administrative, new CotizacionesController().mostrarCotizaciones);
// router.get("/nuevo", access_administrative, new CotizacionesController().crearNuevaCotizacion);
// router.get("/error", new CotizacionesController().obtenerError);
// router.get("/data/:id", new CotizacionesController().obtenerData);
// router.get("/detalle/:id", new CotizacionesController().obtenerDetalle);
// router.get("/:id", new CotizacionesController().obtenerEmail);
// router.get("/visualizar/:id", new CotizacionesController().obtenerPdf);
// router.post("/crear", access_administrative, new CotizacionesController().crear);
// router.put("/actualizar/:id", access_administrative, new CotizacionesController().actualizar);
// router.get("/cliente/:id", access_administrative, new CotizacionesController().cotizacionPreliminar);
// router.post("/nuevo-cliente", access_administrative, new CotizacionesController().guardarCliente);
// router.post("/nuevo-servicio", access_administrative, new CotizacionesController().guardarServicio);
// router.post("/nuevo-impuesto", access_administrative, new CotizacionesController().guardarImpuesto);
// router.get("/pdf/:id", access_administrative, new CotizacionesController().crearPdf);
// router.get("/aceptado/:id", access_administrative, new CotizacionesController().aceptado);
// router.get("/facturado/:id", access_administrative, new CotizacionesController().facturado);
// router.delete("/eliminar/:id", access_administrative, new CotizacionesController().eliminarId);

// router.delete(
//   "/eliminar-cliente/:id", access_administrative,
//   new CotizacionesController().eliminarPorIdCliente
// );

// router.delete(
//   "/eliminar-impuesto/:id", access_administrative,
//   new CotizacionesController().eliminarImpuesto
// );

// router.delete(
//   "/eliminar-servicio/:id", access_administrative,
//   new CotizacionesController().eliminarServicio
// );


calculateData = (data, days) => {
  const today = new Date();

  const result = data.filter((x) => {
    const date = new Date(x.updated_at);
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  });

  return result.map((data) => ({
    id: data.id,
    facturado: data.facturado,
    aceptado: data.aceptado,
    enviado: data.enviado,
    vencido: new Date() <= new Date(data.fecha_vencimiento) === false,
  }));
};


/**
 * @caeher
 * Eliminar cliente
 */
router.delete('/eliminar-cliente/:id', access_administrative,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, CotizacionClienteController.delete);

/**
 * @caeher
 * Eliminar impuesto
 */
router.delete('/eliminar-impuesto/:id', access_administrative,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, CotizacionImpuestoController.delete);

/**
 * @caeher
 * Eliminar servicio
 */
router.delete('/eliminar-servicio/:id', access_administrative,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, CotizacionServicioController.delete);


/**
 * @caeher
 * Datatable para contizaciones
 */

router.get('/datatable/:id?', CotizacionController.datatable);

/**
 * @caeher
 */
// router.get // Que habia aqui :C

/**
 * @caeher
 * Cotizacion detalle datatable
 */

router.get('/detalle/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, CotizacionDetallerController.datatable);

/**
 * @caeher
 * Cotizacion cliente datatable
 */

router.get('/cliente/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, CotizacionClienteController.datatable);

/**
 * @caeher
 * Cotizacion servicio datatable
 */

router.get('/servicio/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, CotizacionServicioController.datatable);

/**
 * @caeher
 * Cotizacion impuesto datatable
 */

router.get('/impuesto/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, CotizacionImpuestoController.datatable);

/**
 * @caeher
 * Cotizacion impuesto datatable
 */

router.get('/impuesto/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, CotizacionImpuestoController.datatable);


/**
 * @caeher
 * datatable empresas
 */

router.get('/empresas/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, EmpresaMarketplaceController.datatable);

/**
 * @caeher
 * datatable productos
 */

router.get('/productos/datatable/:id?',
  check('draw').optional().isInt({ min: 1 }),
  check('start').optional().isInt({ min: 0 }),
  check('length').optional().isInt({ min: 1 }),
  check('order').optional().isArray({ min: 1 }),
  EVResult, ProductoController.datatable);


router.get('/empresas/select2/:id?', EmpresaMarketplaceController.select2); // moverla a marketplace

router.get('/servicios/select2/:id?', CotizacionServicioController.select2);
router.get('/impuestos/select2/:id?', CotizacionImpuestoController.select2);
router.get('/clientes/select2/:id?', CotizacionClienteController.select2);

/**
 * @caeher
 * Ruta para select2 de productos y servicios
 */
router.get('/productos-servicios/select2/:id?',
  check('select').optional(),
  check('id').optional().isNumeric().withMessage('El campo id debe ser numerico')
  , EVResult, async (req, res) => {
    try {

      const { query, params, body } = req;
      console.log(params, body);

      const select = req.query.select;

      let { role, token } = await getAllDataSession(req);

      let productos;
      let servicios;

      if (role === 1 || role === 2) {
        token = null;
        if (req.params.id) {
          token = req.params.id
        }
        if (token) {
          servicios = await CotizacionServicioService.getByColumn({ column: 'empresa_id', value: token }).select(select);
          productos = await ProductoService.getByColumn({ column: 'empresa_id', value: token }).select(select);
        } else {
          servicios = await CotizacionServicioService.getTable().select(select);
          productos = await ProductoService.getTable().select(select);
        }
      } else if (role === 3) {
        servicios = await CotizacionServicioService.getByColumn({ column: 'empresa_id', value: token }).select(select);
        productos = await ProductoService.getByColumn({ column: 'empresa_id', value: token }).select(select);
      }

      data = [...servicios, ...productos];
      return res.json({
        ok: true,
        data
      });
    } catch (error) {
      return catchError(res, error);
    }
  });

router.get("/", access_administrative, async (req, res) => {
  await CotizacionService.checkExist()

    .then(async () => {

      let { role, token, dataSession, dataSistema } = await getAllDataSession(req);

      let cotizaciones = []
      let servicios = []
      let tax = []
      let empresas = []
      let activo_marketplace
      let filtro_30dias
      let filtro_90dias
      let filtro_360dias
      let estadosGenerales

      try {
        if (role == 1 || role == 2) {
          activo_marketplace = await MarketplaceService.getById(1);
          activo_marketplace = activo_marketplace[0].habilitado


          if (activo_marketplace === 1) {
            cotizaciones = await CotizacionService.getAll();
            servicios = await CotizacionServicioService.getAll();
            tax = await CotizacionImpuestoService.getAll();
            empresas = await EmpresaMarketplaceService.getById(0)
          } else {
            cotizaciones = await CotizacionService.getbyCompany(0);
            servicios = await CotizacionServicioService.getbyCompany(0);
            tax = await CotizacionImpuestoService.getbyCompany(0);
          }


        } else if (role == 3) {
          cotizaciones = await CotizacionService.getbyCompany(token);
          servicios = await CotizacionServicioService.getbyCompany(token);
          tax = await CotizacionImpuestoService.getbyCompany(token);
        }


        filtro_30dias = calculateData(cotizaciones, 31);
        filtro_90dias = calculateData(cotizaciones, 90);
        filtro_360dias = calculateData(cotizaciones, 360);

        estadosGenerales = cotizaciones.map((data) => ({
          id: data.id,
          estado:
            data.facturado == 1
              ? "Facturado"
              : data.aceptado == 1
                ? "Aceptado"
                : new Date() <= new Date(data.fecha_vencimiento) === false
                  ? "Vencido"
                  : data.enviado == 1
                    ? "Enviado"
                    : "Borrador",
        }));
        res.render("modulo-administrativo/cotizaciones/admin-cotizaciones", {

          estadosGenerales,
          filtro_30dias,
          filtro_90dias,
          filtro_360dias,
          dataSession,
          dataSistema,
          req,
          tax,
          empresas,
          activo_marketplace,
          servicios,
          cotizaciones,
          token
        });
      } catch (err) {
        return catchError(res, err);
      }

    }).catch((error) => {
      return catchError(res, error);
    });
});

/**
 * @caeher
 * Ruta para mostrar la vista de cotizacion nueva
 */
router.get("/nuevo", access_administrative, async (req, res) => {
  try {
    const { role, token, dataSistema, dataSession } = await getAllDataSession(req);
    let empresa_id = null;
    if (role == 1 || role == 2) {
      activo_marketplace = 1
    } else if (role == 3) {
      activo_marketplace = 0
      empresa_id = token;
    }
    return res.render("modulo-administrativo/cotizaciones/cotizacion-nueva", {
      dataSession,
      dataSistema,
      activo_marketplace,
      empresa_id
    });
  } catch (error) {
    return catchError(res, error);
  }
});

/**
 * @caeher
 * Ruta muestra email error
 */
router.get("/error", async (req, res) => {
  try {
    res.render("modulo-administrativo/cotizaciones/email-error");
  } catch (error) {
    return catchError(res, error);
  }
});

/**
 * @caeher
 */
router.get("/data/:id",
  check('id').isNumeric().withMessage('El id debe ser un numero')
  , EVResult, async (req, res) => {
    try {
      const id = req.params.id;
      let cotizacion = await CotizacionService.getById(id);
      let cotizacion_detalles = await CotizacionDetalleService.getbyInvoice(id);
      if (cotizacion[0].empresa_id == "" || cotizacion[0].empresa_id == null) {
        cotizacion[0].empresa_id = 0
      }
      return res.json({
        status: "success",
        cotizacion: cotizacion,
        detalle: cotizacion_detalles
      });
    } catch (error) {
      return catchError(res, error);
    }
  });

/**
 * @caeher
 * Ruta para mostrar la vista de editar cotizacion
 */
router.get("/detalle/:id", async (req, res) => {
  const id = req.params.id;
  let { role, token, dataSistema, dataSession } = await getAllDataSession(req);
  let activo_marketplace
  try {
    if (role == 1 || role == 2) {
      activo_marketplace = 1;
    }
    else if (role == 3) {
      activo_marketplace = 0
    }
    res.render("modulo-administrativo/cotizaciones/cotizacion-editar", {
      token,
      id,
      dataSession,
      dataSistema,
      activo_marketplace
    });
  } catch (error) {
    return catchError(res, error);
  }
});

/**
 * @caeher
 */
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const role = req.session.rol_id
  let token = req.session.token;
  let datos_empresa;
  let configuraciones
  let url
  try {
    let cotizacion = await CotizacionService.getById(id);
    let cotizacion_detalles = await CotizacionDetalleService.getbyInvoice(id);

    if (role == 1 || role == 2) {
      configuraciones = await ConfiguracionSistemaService.getbyCompany(0);
      datos_empresa = await EmpresaMarketplaceService.getById(0);
      url = datos_empresa[0].url
    }
    else if (role == 3) {
      configuraciones = await ConfiguracionSistemaService.getbyCompany(token);
      datos_empresa = await EmpresaMarketplaceService.getById(token);
      url = datos_empresa[0].url

    }
    let datosEmpresa = {
      configuraciones: configuraciones,
      data: datos_empresa

    }

    res.render("modulo-administrativo/cotizaciones/email", {
      res,
      cotizacion,
      cotizacion_detalles,
      url,
      req,
      datosEmpresa,
    });
  } catch (err) {
    return catchError(err, res);
  }
});

/**
 * @caeher
 */
router.get("/visualizar/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let token = req.session.token;

    let cotizacion = await CotizacionService.getById(id);
    let cotizacion_detalles = await CotizacionDetalleService.getbyInvoice(id);
    let datosEmpresa = await ConfiguracionSistemaService.getAll();

    const role = req.session.rol_id


    let url_

    if (role == 1 || role == 2) {
      url_ = await EmpresaMarketplaceService.getByIdUrl(0)
    } else {
      url_ = await EmpresaMarketplaceService.getByIdUrl(token)

    }
    const url = url_[0].url

    res.render("modulo-administrativo/cotizaciones/pdf", {
      res,
      cotizacion,
      cotizacion_detalles,
      datosEmpresa,
      url,
      req,
    });
  } catch (err) {
    return catchError(err, res);
  }
});

/**
 * @caeher
 */
router.post("/crear", access_administrative, async (req, res) => {
  try {
    await CotizacionService
      .save({
        titulo_cotizacion: req.body.titulo_cotizacion,
        cliente_nombre: req.body.cliente_nombre,
        empresa_id: req.body.empresa_id,
        cliente_email: req.body.cliente_email,
        fecha_vencimiento: req.body.fecha_vencimiento,
        terminos_pago: req.body.terminos_pago,
        nota_comentarios: req.body.nota_comentarios,
        nota_terminos: req.body.nota_terminos,
        subtotal_general: req.body.subtotalGeneral,
        impuestos_general: req.body.impuestosGeneral,
        descuento: req.body.descuento,
        descuento_porcentaje: req.body.descuento_porcentaje,
        total_general: req.body.totalGeneral,
      })
      .then(async (data) => {
        const id = data[0];
        const detalleServicios = req.body.servicios_cotizados;
        try {
          const data = detalleServicios.map((field) => {
            return {
              id_cotizacion: id,
              producto: field.producto,
              descripcion: field.descripcion,
              precio: field.precio,
              cantidad: field.cantidad,
              impuesto: field.impuesto ? field.impuesto : 0,
              impuesto2: field.impuesto2 ? field.impuesto2 : 0,
              impuesto_total: field.impuestoTotal ? field.impuestoTotal : 0,
              total: field.total,
            };
          });

          await CotizacionDetalleService.save(data);
        } catch (err) {
          return catchError(res, err);
        } finally {
          res.status(200).json({ data: id, success: "ok" });
        }
      });
  } catch (error) {
    return catchError(res, error);
  }
});

/**
 * @caeher
 */
router.put("/actualizar/:id", access_administrative, async (req, res) => {
  const id = req.params.id;
  try {
    await CotizacionService
      .updateById(id, {
        titulo_cotizacion: req.body.titulo_cotizacion,
        cliente_nombre: req.body.cliente_nombre,
        cliente_email: req.body.cliente_email,
        fecha_vencimiento: req.body.fecha_vencimiento,
        terminos_pago: req.body.terminos_pago,
        nota_comentarios: req.body.nota_comentarios,
        nota_terminos: req.body.nota_terminos,
        subtotal_general: req.body.subtotalGeneral,
        impuestos_general: req.body.impuestosGeneral,
        descuento_porcentaje: req.body.descuento_porcentaje,
        descuento: req.body.descuento,
        total_general: req.body.totalGeneral,
        empresa_id: req.body.empresa,
      })
      .then(async (data) => {
        const detalleServicios = req.body.servicios_cotizados;

        try {
          const data = detalleServicios.map((field) => {
            return {
              id_cotizacion: id,
              producto: field.producto,
              descripcion: field.descripcion,
              precio: field.precio,
              cantidad: field.cantidad,
              impuesto: field.impuesto ? field.impuesto : 0,
              impuesto2: field.impuesto2 ? field.impuesto2 : 0,
              impuesto_total: field.impuestoTotal ? field.impuestoTotal : 0,
              total: field.total,
            };
          });

          await CotizacionDetalleService
            .deleteByConditionCot(id)
            .then(async () => {
              await CotizacionDetalleService.save(data);
            });
        } catch (err) {
          return catchError(res, err);
        } finally {
          res.status(200).json({ success: "ok" });
        }
      });
  } catch (error) {
    return catchError(res, error);
  }
});

/**
 * @caeher
 */
router.get("/cliente/:id", access_administrative, async (req, res) => {
  const id = req.params.id;

  let { role, token, dataSession, dataSistema } = await getAllDataSession(req);

  let datos_empresa
  let configuraciones
  let url

  try {
    const cotizacion = await CotizacionService.getById(id);
    const cotizacion_detalles = await CotizacionDetalleService.getbyInvoice(id);
    if (role == 1 || role == 2) {
      configuraciones = await ConfiguracionSistemaService.getbyCompany(0);
      datos_empresa = await EmpresaMarketplaceService.getById(0);
      url = datos_empresa[0].url
    }
    else if (role == 3) {
      configuraciones = await ConfiguracionSistemaService.getbyCompany(token);
      datos_empresa = await EmpresaMarketplaceService.getById(token);
      url = datos_empresa[0].url


    }
    let datosEmpresa = {
      configuraciones: configuraciones,
      data: datos_empresa,
      url: url

    }

    res.render("modulo-administrativo/cotizaciones/cotizacion-preliminar", {
      url,
      cotizacion,
      dataSession,
      datosEmpresa,
      cotizacion_detalles,
      dataSistema,

    });
  } catch (err) {
    return catchError(res, err);
  }
});

/**
 * @caeher
 * Ruta para crear nuevo cliente
 */

router.post("/nuevo-cliente",
  check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  check('email').not().isEmpty().withMessage('El email es requerido'),
  check('empresa_id').optional()
  , EVResult, async (req, res) => {
    try {
      console.log(req.body);
      const { role, token } = await getAllDataSession(req);

      let empresa_id = null;
      // En caso de administrador es necesario la empresa_id
      if (role == 1 | role == 2) {
        empresa_id = req.body.empresa_id;
        if (!empresa_id) {
          throw new Error('La empresa es requerida');
        }
      } else if (role == 3) {
        empresa_id = token;
      }

      const existe = await CotizacionClienteService.getbyCompany(empresa_id);
      const allData = matchedData(req);

      const check = existe.filter(i => i.email == allData.email);
      console.log(check);
      if (!check.length) {

        if (!allData.empresa_id) {
          allData.empresa_id = empresa_id;
        }

        await CotizacionClienteService.save(allData).then(() =>
          res.status(200).json({
            success: true,
          })
        )
      } else {
        res.status(200).json({
          success: false,
        })
      }

    } catch (error) {
      return catchError(res, error);
    }
  });

router.post('/nuevo-servicio', access_administrative,
  check('name').not().isEmpty().withMessage('El nombre es requerido'),
  check('description').not().isEmpty().withMessage('La descripcion es requerida'),
  check('precio').not().isEmpty().withMessage('El precio es requerido'),
  check('empresa_id').optional(),
  CotizacionServicioController.save);

// router.post("/nuevo-servicio", access_administrative, async (req, res) => {
//   try {
//     const result = await CotizacionServicioService.save(req.body);
//     return res.status(200).json({
//       ok: true,
//       result,
//     });
//   } catch (error) {
//     return catchError(res, error);
//   }
// });

/**
 * @caeher
 * Ruta para crear un nuevo impuesto
 * 1. Obtiene todos los impuestos de la empresa y verifica que no exista uno con el mismo nombre
 * 2. Guarda el nuevo impuesto
 */
router.post("/nuevo-impuesto", access_administrative,
  check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
  check('tasa').not().isEmpty().withMessage('La tasa es requerida'),
  check('empresa_id').optional()
  , EVResult, async (req, res) => {
    try {
      const { role, token } = await getAllDataSession(req);
      let empresa_id;
      // En caso de administrador es necesario la empresa_id
      if (role == 1 | role == 2) {
        empresa_id = req.body.empresa_id;
        if (!empresa_id) {
          throw new Error('La empresa es requerida');
        }
      } else if (role == 3) {
        empresa_id = token;
      }

      const allData = matchedData(req);
      const existe = await CotizacionImpuestoService.getbyCompany(empresa_id);
      const check = existe.filter(i => i.nombre == allData.nombre)

      if (!check.length) {
        if (!allData.empresa_id) {
          allData.empresa_id = empresa_id;
        }
        await CotizacionImpuestoService.save(allData).then(() =>
          res.status(200).json({
            success: true,
          })
        )
      } else {
        res.status(200).json({
          success: false,
        })
      }

    } catch (error) {
      return catchError(res, error);
    }
  });


router.get("/pdf/:id", access_administrative, async (req, res) => {
  try {
    const role = req.session.rol_id
    const id = req.params.id;
    let url_origin
    let token = req.session.token;
    if (role == 1 || role == 2) {
      url_origin = await EmpresaMarketplaceService.getByIdUrl(0)
    } else {
      url_origin = await EmpresaMarketplaceService.getByIdUrl(token)

    }

    const url = url_origin[0].url + "/cotizaciones/visualizar/" + id;
    console.log(url);
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.emulateMediaType("screen");
    await page.addStyleTag({ path: "public/css/bootstrap.min.css" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      headerTemplate: `
      <style>
      body {
      background: #f5f6fa!important;
      };
      html {
        -webkit-print-color-adjust: exact;
        width:100%;
        background-color:white!important
      };
      </style>`,
      pageRanges: "1",
    });

    res.setHeader(
      "Content-Disposition",
      `inline; filename=cotizacion-${id}.pdf`
    );
    res.status(200).send(pdfBuffer);
  } catch (e) {
    return catchError(res, e);
  }
});


/**
 * @caeher
 * Ruta que cambia el estado de la cotizacion a aceptado
 */
router.get("/aceptado/:id",
  check('id').isNumeric().withMessage('El id debe ser un número')
  , access_administrative, async (req, res) => {
    try {
      const id = req.params.id;
      const result = await CotizacionService.updateBy({ aceptado: true }).where({ id }).timeout(2000);
      return res.status(200).json({
        ok: true,
        estado: "aceptado",
        result,
      });
    } catch (error) {
      return catchError(err, res);
    }
  });

/**
 * @caeher
 * Ruta que cambia el estado de la cotizacion a facturado
 */
router.get("/facturado/:id",
  check('id').isNumeric().withMessage('El id debe ser un número')
  , access_administrative, async (req, res) => {
    try {
      const id = req.params.id;
      const result = await CotizacionService.updateBy({ facturado: true }).where({ id }).timeout(2000);
      return res.status(200).json({
        ok: true,
        estado: "facturado",
        result,
      });
    } catch (error) {
      return catchError(error, res);
    }
  });

/**
 * @caeher
 * Ruta para eliminar la cotizacion_detalle y las cotizaciones
 * 1. Elimina la cotizacion_detalle
 * 2. Elimina la cotizacion
 */
router.delete("/eliminar/:id",
  check('id').isNumeric().withMessage('El id debe ser un número')
  , access_administrative, async (req, res) => {
    try {
      const id = req.params.id;
      await CotizacionDetalleService.deleteBy()
        .where({ id }).timeout(2000).then(async () => {
          await CotizacionService.deleteById(id).then(() => {
            return res.status(200).json({
              ok: true,
              success: 'ok'
            });
          }).catch((error) => {
            return catchError(error, res);
          });
        }).catch((error) => {
          return catchError(error, res);
        });
    } catch (error) {
      return catchError(error, res);
    }
  });

module.exports = router;
