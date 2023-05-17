const ServiceSQL = require("../../services/services");
const { getDataSistema } = require("../../helpers/db");

const logger = require("../../helpers/logger");
const puppeteer = require("puppeteer");

class CotizacionesController {
  constructor() {
    this.service = new ServiceSQL("cotizaciones");
    this.productos = new ServiceSQL("productos");
    this.service_detail = new ServiceSQL("cotizaciones_detalle");
    this.customer = new ServiceSQL("cotizaciones_clientes");
    this.addService = new ServiceSQL("cotizaciones_servicios");
    this.tax = new ServiceSQL("cotizaciones_impuestos");
    this.setting = new ServiceSQL("configuracion_sistema");
    this.empresa = new ServiceSQL("empresas_marketplace");
    this.marketplace = new ServiceSQL("marketplace");
  }

  crearPdf = async (req, res) => {
    try {
      const role = req.session.rol_id
      const id = req.params.id;
      let url_origin
      let token = req.session.token;
      if (role == 1 || role == 2) {
        url_origin = await this.empresa.getByIdUrl(0)
      } else {
        url_origin = await this.empresa.getByIdUrl(token)

      }



      const url = url_origin[0].url + "/cotizaciones/visualizar/" + id;

      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });
      await page.emulateMediaType("screen");
      await page.addStyleTag({ path: "views/js/bootstrap.min.css" });

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
      logger.error("Error al crear pdf: ", e);
    }
  };

  obtenerData = async (req, res) => {
    const id = req.params.id;

    try {

      let cotizacion = await this.service.getById(id);
      let cotizacion_detalles = await this.service_detail.getbyInvoice(id);
      if (cotizacion[0].empresa_id == "" || cotizacion[0].empresa_id == null) {
        cotizacion[0].empresa_id = 0
      }
      let productos = await this.productos.getbyCompany(cotizacion[0].empresa_id);
      let services = await this.addService.getbyCompany(cotizacion[0].empresa_id);
      let impuestos = await this.tax.getbyCompany(cotizacion[0].empresa_id);
      let clientes = await this.customer.getbyCompany(cotizacion[0].empresa_id);
      let product_services = [...services, ...productos];
      product_services = product_services.map((i) => ({
        name: i.name,
        description: i.description,
        price: i.precio
      }))

      res
        .status(200)
        .json({
          status: "success", cotizacion: cotizacion, detalle: cotizacion_detalles, productosEmpresa: product_services, impuestos: impuestos, clientes: clientes
        });
    } catch (error) {
      logger.error("Error al obtener data cotizaciones", error);
    }
  };

  obtenerDetalle = async (req, res) => {
    const role = req.session.rol_id
    const id = req.params.id;
    let token = req.session.token;
    let dataSession = req.session;
    let dataSistema = await getDataSistema(req.session.token);
    let empresa
    let activo_marketplace

    let productos = []
    let services = []
    let product_services = []
    let customer
    let tax

    try {
      if (role == 1 || role == 2) {
        empresa = await this.empresa.getAll();
        activo_marketplace = await this.marketplace.getById(1);
        activo_marketplace = activo_marketplace[0].habilitado
        customer = await this.customer.getAll();
        tax = await this.tax.getAll();

        if (activo_marketplace === 0) {
          customer = await this.customer.getAll(0);
          tax = await this.tax.getbyCompany(0);
          productos = await this.productos.getbyCompany(0);
          services = await this.addService.getbyCompany(0);

        }

      }
      else if (role == 3) {
        activo_marketplace = 0
        customer = await this.customer.getbyCompany(token);
        tax = await this.tax.getbyCompany(token);
        productos = await this.productos.getbyCompany(token);
        services = await this.addService.getbyCompany(token);

      }


      product_services = [...services, ...productos];

      product_services = product_services.map((i) => ({
        name: i.name,
        description: i.description,
        price: i.precio
      }))

      res.render("modulo-administrativo/cotizaciones/cotizacion-editar", {
        token,
        id,
        tax,
        product_services,
        dataSession,
        dataSistema,
        activo_marketplace,
        empresa,
        customer,
        services,


      });
    } catch (err) {
      logger.error("Error en cotizaciones", err);
    }

  };
  cotizacionPreliminar = async (req, res) => {
    const id = req.params.id;
    const role = req.session.rol_id
    let token = req.session.token;
    let dataSession = req.session;
    let datos_empresa
    let configuraciones
    let url
    let dataSistema = await getDataSistema(req.session.token);

    try {
      const cotizacion = await this.service.getById(id);
      const cotizacion_detalles = await this.service_detail.getbyInvoice(id);
      if (role == 1 || role == 2) {
        configuraciones = await this.setting.getbyCompany(0);
        datos_empresa = await this.empresa.getById(0);
        url = datos_empresa[0].url
      }
      else if (role == 3) {
        configuraciones = await this.setting.getbyCompany(token);
        datos_empresa = await this.empresa.getById(token);
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
      logger.error("Error en cotizaciones", err);
    }

  };

  aceptado = async (req, res) => {
    const id = req.params.id;
    await this.service
      .actualizarEstadoAceptado(true, id)

      .then(res.status(200).json({ estado: "aceptado" }))
      .catch((err) => {
        logger.error("Error en cotizaciones", err);
      });
  };
  facturado = async (req, res) => {
    const id = req.params.id;
    await this.service
      .actualizarEstadoFacturado(true, id)
      .then(res.status(200).json({ estado: "facturado" }))
      .catch((err) => {
        logger.error("Error en cotizaciones", err);
      });
  };
  obtenerError = (req, res) => {
    res.render("modulo-administrativo/cotizaciones/email-error");
  };

  obtenerEmail = async (req, res) => {
    const id = req.params.id;
    const role = req.session.rol_id
    let token = req.session.token;
    let datos_empresa;
    let configuraciones
    let url
    try {
      let cotizacion = await this.service.getById(id);
      let cotizacion_detalles = await this.service_detail.getbyInvoice(id);



      if (role == 1 || role == 2) {
        configuraciones = await this.setting.getbyCompany(0);
        datos_empresa = await this.empresa.getById(0);
        url = datos_empresa[0].url
      }
      else if (role == 3) {
        configuraciones = await this.setting.getbyCompany(token);
        datos_empresa = await this.empresa.getById(token);
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
      logger.error("Ocurrio un error", err)
      res.render("modulo-administrativo/cotizaciones/email-error", {
        res,
        req,
      });
    }
  };
  obtenerPdf = async (req, res) => {
    const id = req.params.id;
    try {
      let token = req.session.token;

      let cotizacion = await this.service.getById(id);
      let cotizacion_detalles = await this.service_detail.getbyInvoice(id);
      let datosEmpresa = await this.setting.getAll();

      const role = req.session.rol_id


      let url_

      if (role == 1 || role == 2) {
        url_ = await this.empresa.getByIdUrl(0)
      } else {
        url_ = await this.empresa.getByIdUrl(token)

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
      logger.error("Error en cotizaciones", err);
      res.render("modulo-administrativo/cotizaciones/email-error", {
        res,
        req,
      });
    }
  };

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

  mostrarCotizaciones = async (req, res) => {
    await this.service.checkExist()

      .then(async () => {
        const role = req.session.rol_id
        let token = req.session.token;
        let dataSession = req.session;
        let dataSistema = await getDataSistema(req.session.token);
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
            activo_marketplace = await this.marketplace.getById(1);
            activo_marketplace = activo_marketplace[0].habilitado


            if (activo_marketplace === 1) {
              cotizaciones = await this.service.getAll();
              servicios = await this.addService.getAll();
              tax = await this.tax.getAll();
              empresas = await this.empresa.getById(0)
            } else {
              cotizaciones = await this.service.getbyCompany(0);
              servicios = await this.addService.getbyCompany(0);
              tax = await this.tax.getbyCompany(0);
            }


          } else if (role == 3) {
            cotizaciones = await this.service.getbyCompany(token);
            servicios = await this.addService.getbyCompany(token);
            tax = await this.tax.getbyCompany(token);
          }


          filtro_30dias = this.calculateData(cotizaciones, 31);
          filtro_90dias = this.calculateData(cotizaciones, 90);
          filtro_360dias = this.calculateData(cotizaciones, 360);

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
          logger.error("Error en cotizaciones", err);
        }

      })

      .catch((error) => {
        logger.error("Error en cotizaciones", error);
        res.status(400).json({
          ok: false,
          msg: error,
        });
      });
  };

  crearNuevaCotizacion = async (req, res) => {
    await this.customer.checkExist();
    await this.addService
      .checkExist()
      .then(async () => {
        const role = req.session.rol_id
        let token = req.session.token;
        let dataSession = req.session;
        let dataSistema = await getDataSistema(req.session.token);
        let activo_marketplace
        let productos = []
        let services = []
        let product_services = []
        let tax = []
        let customer = []
        let empresa

        try {
          if (role == 1 || role == 2) {
            empresa = await this.empresa.getAll();
            activo_marketplace = await this.marketplace.getById(1);
            activo_marketplace = activo_marketplace[0].habilitado


            if (activo_marketplace === 0) {
              productos = await this.productos.getbyCompany(0);
              services = await this.addService.getbyCompany(0);
              customer = await this.customer.getbyCompany(0);
              tax = await this.tax.getbyCompany(0);

            }

          } else if (role == 3) {
            productos = await this.productos.getbyCompany(token);
            services = await this.addService.getbyCompany(token);
            customer = await this.customer.getbyCompany(token);
            tax = await this.tax.getbyCompany(token);
            activo_marketplace = 0

          }
          product_services = [...services, ...productos];

          product_services = product_services.map((i) => ({
            name: i.name,
            description: i.description,
            price: i.precio
          }))
          res.render("modulo-administrativo/cotizaciones/cotizacion-nueva", {
            res,
            dataSession,
            dataSistema,
            req,
            tax,
            product_services,
            services,
            activo_marketplace,
            customer,
            empresa,
            token
          });
        } catch (err) {
          logger.error("Error en cotizaciones", err);
        }

      })

      .catch((error) => {
        res.status(400).json({
          ok: false,
          msg: error,
        });
      });
  };


  guardarCliente = async (req, res) => {

    try {
      const data = req.body

      const existe = await this.customer.getbyCompany(data.empresa_id)
      const check = existe.filter(i => i.email == data.email)
      if (!check.length) {

        await this.customer.save(req.body).then(() =>
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
      logger.error("Error en cotizaciones", error);
      res.status(500).json({
        ok: false,
        msg: error,
      });
    }
  };
  guardarImpuesto = async (req, res) => {
    try {
      const data = req.body
      const existe = await this.tax.getbyCompany(data.empresa_id)
      const check = existe.filter(i => i.nombre == data.nombre)

      if (!check.length) {

        await this.tax.save(req.body).then(() =>
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
      logger.error("Error en cotizaciones", error);
      res.status(500).json({
        ok: false,
        msg: error,
      });
    }
  };

  guardarServicio = async (req, res) => {
    try {
      const result = await this.addService.save(req.body);
      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      logger.error("Error en cotizaciones", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };

  crear = async (req, res) => {

    try {
      await this.service
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

            await this.service_detail.save(data);
          } catch (err) {
            logger.error("Error en cotizaciones", err);
          } finally {
            res.status(200).json({ data: id, success: "ok" });
          }
        });
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };
  actualizar = async (req, res) => {
    const id = req.params.id;
    try {
      await this.service
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

            await this.service_detail
              .deleteByConditionCot(id)
              .then(async () => {
                await this.service_detail.save(data);
              });
          } catch (err) {
            logger.error("Error en cotizaciones", err);
          } finally {
            res.status(200).json({ success: "ok" });
          }
        });
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };

  eliminarId = async (req, res) => {
    const id = req.params.id;
    try {
      await this.service_detail
        .deleteByConditionCot(id)
        .then(async () => {
          await this.service.deleteById(id);
          res.status(200).json({ success: "ok" });
        })
        .catch((err) => res.status(400).json({ err: err }));
    } catch (error) {
      logger.error("Error en cotizaciones", error);
      res.status(400);
    }
  };
  eliminarImpuesto = async (req, res) => {
    const id = req.params.id;
    try {
      await this.tax
        .deleteById(id)
        .then(async () => {
          res.status(200).json({ success: "ok" });
        })
        .catch((err) => res.status(400).json({ err: err }));
    } catch (error) {
      logger.error("Error en cotizaciones", error);
      res.status(400);
    }
  };
  eliminarServicio = async (req, res) => {
    const id = req.params.id;
    try {
      await this.addService
        .deleteById(id)
        .then(async () => {
          res.status(200).json({ success: "ok" });
        })
        .catch((err) => res.status(400).json({ err: err }));
    } catch (error) {
      logger.error("Error en cotizaciones", error);
      res.status(400);
    }
  };
  eliminarPorIdCliente = async (req, res) => {
    const id = req.params.id;
    try {
      await this.customer
        .deleteById(id)
        .then(async () => {
          res.status(200).json({ success: "ok" });
        })
        .catch((err) => res.status(400).json({ err: err }));
    } catch (error) {
      logger.error("Error en cotizaciones", error);
      res.status(400);
    }
  };
}

module.exports = CotizacionesController;
