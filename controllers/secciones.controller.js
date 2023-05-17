const ServiceSQL = require("../services/services");
const { getDataSistema } = require('../helpers/db');
const logger = require("../helpers/logger");
const CryptoJS = require("crypto-js");
const moment = require("moment")
const config = require("../config/config");
const axios = require("axios")

const { getAllDataSession } = require('../helpers/modulo-tv/basicrequest.helpers');

class SeccionesController {
    constructor() {
        this.productos = new ServiceSQL("productos");
        this.stock = new ServiceSQL("stock");
        this.subcategorias = new ServiceSQL("subcategorias");
        this.categorias = new ServiceSQL("categorias");
        this.almacenes = new ServiceSQL("almacenes");
        this.empresas_marketplace = new ServiceSQL("empresas_marketplace");
        this.marketplace = new ServiceSQL("marketplace");
        this.configuracion = new ServiceSQL("configuracion_sistema");
        this.banner = new ServiceSQL("banners");
        this.portadas = new ServiceSQL("portada_pages");
        this.metodos = new ServiceSQL("metodos_pagos");
        this.ventanas = new ServiceSQL("ventanas_emergentes");
        this.marcas = new ServiceSQL("marcas");
        this.filtros = new ServiceSQL("grupo_filtro")
        this.facturas = new ServiceSQL("facturas")
        this.sedes = new ServiceSQL("empresas_sedes")
        this.configuracion_correos = new ServiceSQL("configuracion_correos")
        this.metodos_envio = new ServiceSQL("metodos_envio")
        this.metodos_facturacion = new ServiceSQL("metodos_facturacion")
        this.servicios_entrega = new ServiceSQL("servicios")
        this.servicios_metodos = new ServiceSQL("servicios_metodos")
        this.secciones_configuracion = new ServiceSQL("secciones_configuracion")
        this.modulos = new ServiceSQL("modulos");
        this.categoriasEmpresa = new ServiceSQL("empresas_registradas_categorias");
        this.categoriasModulos = new ServiceSQL("empresas_categorias");

    }

    adminPrendas = async (req, res) => {
        try {

            const {role, token, dataSession, dataSistema} = await getAllDataSession(req)
            let items

            if (token) {

                if (role == 1 || role == 2) {

                    let prendas = await this.productos.getPrendas();
                    let stock = await this.stock.getAll();
                    let almacenes = await this.almacenes.getAll();
                    let subcategorias = await this.subcategorias.getSubCategoriesPrenda();

                    let empresas = await this.empresas_marketplace.getAll();

                    let activo_marketplace = await this.marketplace.getById(1)

                    activo_marketplace = activo_marketplace[0].habilitado
                    items = {
                        prendas: prendas,
                        stock: stock,
                        almacenes: almacenes,
                        subcategorias: subcategorias,
                        empresas: empresas,
                        marketplace: activo_marketplace
                    };
                }


                if (role == 3) {

                    let prendas = await this.productos.getPrendasByCompany(token);
                    let stock = await this.stock.getAll();
                    let almacenes = await this.almacenes.getbyCompany(token);
                    let subcategorias = await this.subcategorias.getSubCategoriesByCompanyPrenda(token)
                    let empresas = await this.empresas_marketplace.getById(token);

                    items = {
                        prendas: prendas,
                        stock: stock,
                        almacenes: almacenes,
                        subcategorias: subcategorias,
                        empresas: empresas,
                        marketplace: false
                    };
                }

                res.render("admin-prendas", {
                    items,
                    dataSession,
                    dataSistema,
                    token
                });
            }
            else {
                res.redirect("/");
            }
        } catch (error) {
            res.status(400).json({
                msg: error,
            });
        }
    };

    adminProductos = async (req, res) => {

        try {
            const {role, token, dataSession, dataSistema} = await getAllDataSession(req)
            let items
            if (token) {

                if (role == 1 || role == 2) {

                    let productos = await this.productos.getProductos();
                    let stock = await this.stock.getAll();
                    let almacenes = await this.almacenes.getAll();
                    let categorias = await this.categorias.getCategories()
                    let empresas = await this.empresas_marketplace.getAll();

                    let activo_marketplace = await this.marketplace.getById(1)

                    activo_marketplace = activo_marketplace[0].habilitado
                    items = {
                        productos: productos,
                        stock: stock,
                        almacenes: almacenes,
                        categorias: categorias,
                        empresas: empresas,
                        marketplace: activo_marketplace
                    };

                }


                if (role == 3) {

                    let productos = await this.productos.getProductosByCompany(token);

                    let stock = await this.stock.getAll();
                    let almacenes = await this.almacenes.getbyCompany(token);
                    let categorias = await this.categorias.getCategoriesByCompany(token)
                    let empresas = await this.empresas_marketplace.getById(token);

                    items = {
                        productos: productos,
                        stock: stock,
                        almacenes: almacenes,
                        categorias: categorias,
                        empresas: empresas,
                        marketplace: false
                    };
                }

                res.render("admin-productos", {
                    items,
                    dataSession,
                    dataSistema,
                    token
                });
            }
            else {
                res.redirect("/");
            }
        } catch (error) {
            res.status(400).json({
                msg: error,
            });
        }
    }
    adminCategorias = async (req, res) => {

        try {
            const {role, token, dataSession, dataSistema} = await getAllDataSession(req)
            let empresas
            let bookStore
            let activo_marketplace
            let marketplace
            if (token) {

                if (role == 1 || role == 2) {


                    bookStore = await this.categorias.getCategoriesFull()

                    empresas = await this.empresas_marketplace.getAll();

                    activo_marketplace = await this.marketplace.getById(1)

                    marketplace = activo_marketplace[0].habilitado

                }

                if (role == 3) {
                    bookStore = await this.categorias.getCategoriesByCompanyFull(token)

                    empresas = await this.empresas_marketplace.getById(token);
                }

                res.render("admin-categorias", {
                    bookStore,
                    dataSession,
                    dataSistema,
                    empresas,
                    marketplace,
                    token
                });
            }
            else {
                res.redirect("/");
            }
        } catch (error) {
            res.status(400).json({
                msg: error,
            });
        }
    }
    adminSubCategorias = async (req, res) => {

        try {
            const {role, token, dataSession, dataSistema} = await getAllDataSession(req)
            let empresa
            let bookStore
            let activo_marketplace
            let marketplace
            let categorias
            if (token) {

                if (role == 1 || role == 2) {


                    bookStore = await this.subcategorias.getAll()
                    categorias = await this.categorias.getAll()
                    empresa = await this.empresas_marketplace.getAll();

                    activo_marketplace = await this.marketplace.getById(1)

                    marketplace = activo_marketplace[0].habilitado

                }

                if (role == 3) {
                    bookStore = await this.subcategorias.getbyCompany(token)
                    categorias = await this.categorias.getbyCompany(token)

                    empresa = await this.empresas_marketplace.getById(token);
                }

                res.render("admin-subcategorias", {
                    bookStore,
                    dataSession,
                    dataSistema,
                    empresa,
                    categorias,
                    marketplace,
                    token
                });
            }
            else {
                res.redirect("/");
            }
        } catch (error) {
            res.status(400).json({
                msg: error,
            });
        }
    }

    getCategories = async (req, res) => {

        try {
            const {role, token} = await getAllDataSession(req)

            let categorias
            let activo_marketplace
            let marketplace
            if (token) {

                if (role == 1 || role == 2) {

                    categorias = await this.categorias.getAll()
                    activo_marketplace = await this.marketplace.getById(1)
                    marketplace = activo_marketplace[0].habilitado

                }

                if (role == 3) {
                    categorias = await this.categorias.getCategoriesByCompany(token)
                }
                res.status(200).json({
                    categorias: categorias,
                    marketplace: marketplace

                });
            } else {
                res.redirect("/")
            }
        } catch (error) {
            res.status(400).json({
                msg: error,
            });
        }
    }
    // configuracion sistema
    saveSEO = async (req, res) => {
        try {
            const {role, token} = await getAllDataSession(req)
            if (token) {
                if (role == 1 || role == 2) {
                    req.body.empresa_id = 0
                }
            }
            const check = await this.configuracion.checkExistCompany(req.body.empresa_id)
            let result
            if (check.length) {

                result = await this.configuracion.actualizarEmpresaId({ meta_etiquetas: req.body.meta_etiquetas }, req.body.empresa_id)
            } else {
                result = await this.configuracion.save(req.body)
            }

            res.status(200).json({
                status: "success",

            });
        } catch (error) {
            res.status(400).json({
                msg: error,
            });
        }
    }
    getConfiguration = async (req, res) => {
        try {
            const {role, token} = await getAllDataSession(req)
            if (token) {
                if (role == 1 || role == 2) {
                    let result = await this.configuracion.getAll()
                    res.status(200).json({
                        status: "success",
                        result: result,
                    });
                } else {
                    res.status(500).json({
                        status: "error",
                    });
                }
            }
        } catch (error) {
            res.status(400).json({
                msg: error,
            });
        }
    }
    saveConfiguration = async (req, res) => {

        try {
            const {role, token} = await getAllDataSession(req)
            if (token) {
                if (role == 1 || role == 2) {
                    req.body.empresa_id = 0
                }
            }
            const check = await this.configuracion.checkExistCompany(req.body.empresa_id)
            let result
            if (check.length) {

                result = await this.configuracion.actualizarLogoEmpresaId(req.body, req.body.empresa_id)
            } else {
                result = await this.configuracion.save(req.body)
            }

            res.status(200).json({
                status: "success",

            });
        } catch (error) {
            res.status(400).json({
                msg: error,
            });
        }
    }

    saveFavicom = async (req, res) => {

        try {
            const {role, token} = await getAllDataSession(req)
            if (token) {
                if (role == 1 || role == 2) {
                    req.body.empresa_id = 0
                }
            }
            const check = await this.configuracion.checkExistCompany(req.body.empresa_id)
            let result
            if (check.length) {
                result = await this.configuracion.actualizarEmpresaId({ favicon: req.body.favicon }, req.body.empresa_id)
            } else {
                result = await this.configuracion.save(req.body)
            }

            res.status(200).json({
                status: "success",

            });
        } catch (error) {
            res.status(400).json({
                msg: error,
            });
        }
    }
    adminConfiguracion = async (req, res) => {

        try {
            const {role, token, dataSession, dataSistema} = await getAllDataSession(req)
            let empresa
            let bookStore
            let activo_marketplace
            let marketplace

            if (token) {

                if (role == 1 || role == 2) {


                    bookStore = await this.configuracion.getAll()
                    empresa = await this.empresas_marketplace.getAll();
                    activo_marketplace = await this.marketplace.getById(1)
                    marketplace = activo_marketplace[0].habilitado

                }

                if (role == 3) {
                    bookStore = await this.configuracion.getbyCompany(token)
                    empresa = await this.empresas_marketplace.getById(token);
                    marketplace = false
                }

                res.render("configuracion-sistema", {
                    bookStore,
                    dataSession,
                    dataSistema,
                    empresa,
                    marketplace,
                    token
                });
            }
            else {
                res.redirect("/");
            }
        } catch (error) {
            res.status(400).json({
                msg: error,
            });
        }
    }
    //  fin configuracion sistema

    //inicio admin banner
    getAdminBanner = async (req, res) => {
        try {

            const {role, token, dataSession, dataSistema} = await getAllDataSession(req)
            let items
            if (token) {
                if (role == 1 || role == 2) {
                    token = 0
                    let result = await this.banner.getbyCompany(0)
                    let empresas = await this.empresas_marketplace.getAll();

                    let activo_marketplace = await this.marketplace.getById(1)

                    activo_marketplace = activo_marketplace[0].habilitado
                    items = {
                        banner: result,
                        empresas: empresas,
                        marketplace: activo_marketplace
                    };
                } else if (role == 3) {
                    let result = await this.banner.getbyCompany(token)

                    items = {
                        banner: result,
                        empresas: null,
                        marketplace: false
                    };
                }
                res.render("admin-banners", {
                    dataSession,
                    dataSistema,
                    items,
                    token
                })
            } else {
                res.redirect("/")
            }
        } catch (error) {
            logger.error("Error al obtener banner", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    updateAdminBanner = async (req, res) => {

        try {

            const {role} = await getAllDataSession(req)
            if (role) {

                if (role == 1 || role == 2) {

                    req.body.empresa_id = 0
                }
            }
            let result = await this.banner.updateById(req.body.id, req.body)
            res.status(200).json({
                status: "success",
                result: result

            });
        } catch (error) {
            logger.error("error al guardar banner", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    saveAdminBanner = async (req, res) => {

        try {
            const {role, token} = await getAllDataSession(req)
            if (role) {

                if (role == 1 || role == 2) {

                    req.body.empresa_id = 0
                }
            }
            let result = await this.banner.save(req.body)
            res.status(200).json({
                status: "success",
                result: result

            });
        } catch (error) {
            logger.error("error al guardar banner", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    deleteAdminBanner = async (req, res) => {

        try {

            const {role, token} = await getAllDataSession(req)
            if (role) {

                if (role == 1 || role == 2) {
                    req.body.empresa_id = 0
                }
            }
            let result = await this.banner.deleteById(req.body.id)
            res.status(200).json({
                status: "success",
                result: result

            });
        } catch (error) {
            logger.error("error al guardar banner", error)
            res.status(400).json({
                msg: error,
            });
        }
    }

    //fin admin banner

    //inicio admin portadas
    getAdminPortadas = async (req, res) => {
        try {

            let {role, token, dataSession, dataSistema} = await getAllDataSession(req)
            let result
            let items
            if (token) {
                if (role == 1 || role == 2) {
                    token = 0
                    result = await this.portadas.getAll()
                    let empresas = await this.empresas_marketplace.getAll();

                    let activo_marketplace = await this.marketplace.getById(1)

                    activo_marketplace = activo_marketplace[0].habilitado
                    items = {
                        portadas: result,
                        empresas: empresas,
                        marketplace: activo_marketplace
                    };
                } else if (role == 3) {

                    let result = await this.portadas.getbyCompany(token)

                    if (!result.length) {

                        let portadas = ["Busqueda", "Oferta", "Novedades"]

                        for (let i = 0; i < portadas.length; i++) {
                            let nuevoRegistro = [{
                                empresa_id: token,
                                nombre: portadas[i],
                                imagen: "http://groundandco.com.au/wp-content/plugins/uix-page-builder/includes/uixpbform/images/default-cover-6.jpg"
                            }]
                            await this.portadas.save(nuevoRegistro)

                        }
                        result = await this.portadas.getbyCompany(token)

                    }

                    items = {
                        portadas: result,
                        empresas: null,
                        marketplace: false,

                    };
                }
                res.render("admin-portadas", {
                    dataSession,
                    dataSistema,
                    items,

                    token
                })
            }
        } catch (error) {
            logger.info("Error al obtener portadas", error)
            res.status(400).json({
                msg: error,
            });
        }
    }

    //fin admin portadas

    //inicio admin metodos pago

    getMethodPayment = async (req, res) => {
        try {

            let {role, token, dataSession, dataSistema} = await getAllDataSession(req)
            let items
            let result


            if (token) {

                if (role == 1 || role == 2) {
                    token = 0
                    result = await this.metodos.getbyCompany(0)

                } else if (role == 3) {
                    result = await this.metodos.getbyCompany(token)
                }

                res.render("admin-metodos-pago", {
                    dataSession,
                    dataSistema,
                    result,
                    token
                })
            } else {
                res.redirect("/")
            }
        } catch (error) {
            logger.error("Error al obtener metodos de pago", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    postMethodPayment = async (req, res) => {
        try {
            const {role, token} = await getAllDataSession(req)
            if (role) {
                if (req.body.token) {

                    let tokenSecret = bcrypt.hashSync(
                        req.body.token,
                        bcrypt.genSaltSync(5),
                        null
                    );
                    req.body.token = tokenSecret
                }
               
                if (req.body.api_key) {

                    let tokenSecret2 = bcrypt.hashSync(
                        req.body.api_key,
                        bcrypt.genSaltSync(5),
                        null
                    );
                    req.body.api_key = tokenSecret2
                }
               
                if (role == 1 || role == 2) {
                    req.body.empresa_id = 0
                }
            }
            const check = await this.metodos.checkExistCompanyAndMethod(req.body.empresa_id, req.body.metodo_id)
            let result
            if (check.length) {
                result = await this.metodos.updateByCompanyIdAndMethod(req.body.empresa_id, req.body.metodo_id, req.body)
            } else {
                result = await this.metodos.save(req.body)
            }
            res.json({
                status: "success",
                msg: "Pasarela actualizada correctamente",
            });

        } catch (e) {
            logger.error("Error al guarda metodo de pago", e)
            res.json({ status: "error", msg: "Error al ejecutar acción requerida" });
        }


    }
    //fin admin metodos pago



    //configuracion nubefact
    postMetodoFact = async (req, res) => {
        try {

            let result
            if (!req.body.id) {
                const role = req.session.rol_id
                if (role) {

                    if (role == 1 || role == 2) {
                        req.body.empresa_id = 0

                    }
                }
            }

            if (req.body.token) {
                let tokenSecret = CryptoJS.AES.encrypt(
                    req.body.token,
                    config.SECRET
                ).toString();

                req.body.token = tokenSecret
            }

            let check = await this.metodos_facturacion.checkExistCompany(req.body.empresa_id)
            if (check.length) {
                result = await this.metodos_facturacion.updateByCompanyId(req.body.empresa_id, req.body)

            } else {
                result = await this.metodos_facturacion.save(req.body)
            }
            res.json({
                status: "success",
                msg: "El método de facturación se actualizo correctamente",
            });

        } catch (e) {
            logger.error("Error al guardar sedes", e)
            res.json({ status: "error", msg: "Error al actualizar el metodo de facturación" });
        }


    }
    getMetodoFactData = async (req, res) => {
        try {
            const {role, token} = await getAllDataSession(req)
            let metodo

            if (role == 1 || role == 2) {
                token = 0
                metodo = await this.metodos_facturacion.getbyCompany(0)

            } else if (role == 3) {
                metodo = await this.metodos_facturacion.getbyCompany(token)
            }

            if (metodo.length) {
                metodo = metodo[0]
            }
            let items = {
                metodo: metodo,
            }

            res.status(200).json({
                items: items
            })

        } catch (error) {
            logger.info("Error al obtener sedes", error)
            res.status(400).json({
                msg: error,
            });
        }
    }

    getMetodoFact = async (req, res) => {
        try {

            // let sql = "SELECT * FROM metodos_facturacion";
    //   let bookStore = await db.query(con, sql);

            let {role, token, dataSession, dataSistema} = await getAllDataSession(req)

            res.render("modulo-financiero/metodos-facturacion/admin-metodos-facturacion", {
                dataSession,
                dataSistema,
                token
            })

        } catch (error) {
            logger.info("Error al obtener sedes", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    //fin configuracion nubefact


    //facturacion
    postBilling = async (req, res) => {

        let razonSocial = req.body.nombre;
        let tipoPago = req.body.tipoPago;
        let tipoDocumento = req.body.tipoDocumento;
        let numeroDocumento = req.body.numeroDocumento;
        let email = req.body.email;
        let celular = req.body.celular;
        let direccion = req.body.direccion;
        let productos = req.body.productos;
        let idInvoice;
        let fechaFinal = moment().format("DD-MM-YYYY");
        let token = req.session.token;
        try {


            let result

            const role = req.session.rol_id
            if (role) {
                if (role == 1 || role == 2) {
                    token = 0
                }
            }

            let responseVerify = await this.metodos_facturacion.getbyCompany(token)

            let responseBoletas = await this.facturas.getbyCompany_Invoices(token, tipoPago)

            if (responseBoletas.length > 0) {
                idInvoice = responseBoletas[0].numero + 1;
            } else {
                idInvoice = 1;
            }

            let productosFixed = productos.map((item) => {
                let igv = parseFloat(item.price) * 0.18;
                let igvPriceFixed = parseFloat(item.price) + igv;
                let igvTotal = parseFloat(item.subtotal) * 0.18;
                let dataDescuento = "";
                if (item.descuento != 0) {
                    dataDescuento = parseFloat(item.price) * parseFloat(item.cantidad);
                    dataDescuento = (dataDescuento * item.descuento) / 100;
                }
                let totalGeneral = parseFloat(item.subtotal) + igvTotal;
                return {
                    unidad_de_medida: "NIU",
                    codigo: item.id,
                    descripcion: "Pago de " + item.name,
                    cantidad: parseFloat(item.cantidad),
                    valor_unitario: parseFloat(item.price),
                    precio_unitario: igvPriceFixed,
                    descuento: dataDescuento,
                    subtotal: parseFloat(item.subtotal),
                    tipo_de_igv: "1",
                    igv: igvTotal,
                    total: totalGeneral,
                    anticipo_regularizacion: false,
                    anticipo_documento_serie: "",
                    anticipo_documento_numero: "",
                };
            });

            let total_gravada = 0;
            let total_igv = 0;
            let total_descuento = 0;
            let precio_total_final = 0;
            productosFixed.forEach(function (obj) {
                total_gravada += parseInt(obj.subtotal);
                total_igv += parseInt(obj.igv);
                if (obj.descuento != "") {
                    total_descuento += parseFloat(obj.descuento);
                }
                precio_total_final += parseInt(obj.total);
            });

            let bytes = CryptoJS.AES.decrypt(responseVerify[0].token, config.SECRET);

            let decryptd = bytes.toString(CryptoJS.enc.Utf8);

            let dataFinalFixed = {
                ruta: responseVerify[0].ruta,
                fechaFinal: fechaFinal,
                total_descuento: total_descuento,
                precio_total_final: precio_total_final,
                total_igv: total_igv,
                total_gravada: total_gravada,
                tipoPago: tipoPago,
                razonSocial: razonSocial,
                tipoDocumento: tipoDocumento,
                numeroDocumento: numeroDocumento,
                email: email,
                celular: celular,
                direccion: direccion,
                productos: productosFixed,
                idInvoice: idInvoice,
                token: decryptd,
            };




            let urlAPI = `https://grupoinsur.pe/nubefact_inkalandia/index.php?action=nubefact`;
            let headJSON = { "Content-Type": "application/json" };
            const respFinal = await axios.post(urlAPI, dataFinalFixed, headJSON);
            let datosJSON = respFinal.data;
            if (datosJSON.errors) {
                res.json({ status: "error", msg: datosJSON.errors });
            } else {
                let queryInsert = await this.facturas.save({
                    enlace: datosJSON.enlace,
                    enlace_pdf: datosJSON.enlace_del_pdf,
                    precio: dataFinalFixed.precio_total_final,
                    tipo: dataFinalFixed.tipoPago,
                    numero: datosJSON.numero,
                    nombre: dataFinalFixed.razonSocial,
                    correo: dataFinalFixed.email,
                    tipo_documento: dataFinalFixed.tipoDocumento,
                    numero_documento: dataFinalFixed.numeroDocumento,
                    direccion: dataFinalFixed.direccion,
                    empresa_id: token

                })
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: "mbarrientos@morangesoft.com", // generated ethereal user
                        pass: "Sprite1234$", // generated ethereal password
                    },
                });
                let typeDataSend;
                if (req.body.tipoPago == "1") {
                    typeDataSend = "Pago de Factura";
                } else {
                    typeDataSend = "Pago de Boleta";
                }
                const mailOptions = {
                    from: "Inkalandia",
                    to: req.body.email, //correo al que se enviara
                    subject: typeDataSend,
                    text: "",
                    html:
                        "<div><b>Puedes revisar el comprobante de tu pago a través del siguiente link </b><a href=" +
                        datosJSON.enlace_del_pdf +
                        ">" +
                        datosJSON.enlace_del_pdf +
                        "</a></div>",
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {

                    }
                });
                res.json({ status: "success", msg: "registro de boleta exitóso" });
            }



        } catch (e) {
            logger.error("Error al guardar facturas", e)
            res.json({ status: "error", msg: "Error al actualizar el metodo de facturación" });
        }


    }


    getBilling = async (req, res) => {
        try {
            const role = req.session.rol_id
            let token = req.session.token;
            const dataSession = req.session;
            const dataSistema = await getDataSistema(req.session.token)
            let facturas
            let productos


            if (role == 1 || role == 2) {
                token = 0
                productos = await this.productos.getbyCompany(0)
                facturas = await this.facturas.getbyCompany(0)


            } else if (role == 3) {
                productos = await this.productos.getbyCompany(token)
                facturas = await this.facturas.getbyCompany(token)

            }

            let items = {
                productos: productos,
                facturas: facturas,


            }

            res.render("modulo-financiero/facturacion/admin-facturas", {
                dataSession,
                dataSistema,
                items,
                token
            })



        } catch (error) {
            logger.info("Error al obtener facturas", error)
            res.status(400).json({
                msg: error,
            });
        }






    }
    cancelInvoice = async (req, res) => {
        try {

            const role = req.session.rol_id
            let token = req.session.token;


            if (role == 1 || role == 2) {
                token = 0
            }

            let responseVerify = await this.metodos_facturacion.getbyCompany(token)
            let numero = req.body.number;
            let tipo = req.body.type;
            let bytes = CryptoJS.AES.decrypt(responseVerify[0].token, config.SECRET);

            let decryptd = bytes.toString(CryptoJS.enc.Utf8);



            let dataFinalFixed = {
                ruta: responseVerify[0].ruta,
                idInvoice: numero,
                tipoPago: tipo,
                token: decryptd,
            };
            let urlAPI = `https://grupoinsur.pe/nubefact_inkalandia/index.php?action=nubefact-cancelar`;
            let headJSON = { "Content-Type": "application/json" };
            const respFinal = await axios.post(urlAPI, dataFinalFixed, headJSON);
            let datosJSON = respFinal.data;
            if (datosJSON.errors) {
                res.json({ status: "error", msg: datosJSON.errors });
            } else {
                let queryUpdate =
                    "UPDATE facturas set estado=2 where id='" + req.body.id + "'";
                await db.query(con, queryUpdate);
                res.json({ status: "success", msg: "anulación de Invoice completada" });
            }
        } catch (e) {

            res.json({
                status: "error",
                msg: "Ocurrió un error interno , intentalo nuevamente por favor.",
            });
        }
    }

    //inicio ventanas emergentes


    getPopUp = async (req, res) => {
        try {

            let {role, token, dataSession, dataSistema} = await getAllDataSession(req)
            let result
            let empresas
            let activo_marketplace
            
            if (role == 1 || role == 2) {
                token = 0
                result = await this.ventanas.getbyCompany(0)
                empresas = await this.empresas_marketplace.getAll();
                activo_marketplace = await this.marketplace.getById(1)
                activo_marketplace = activo_marketplace[0].habilitado

            } else if (role == 3) {
                result = await this.ventanas.getbyCompany(token)
            }

            let items = {
                ventanas: result,
                empresas: empresas,
                marketplace: activo_marketplace,

            }
            res.render("modulo-generales/ventanas-emergentes/admin-ventanas-emergentes", {
                dataSession,
                dataSistema,
                items,
                token
            });


        } catch (error) {
            logger.info("Error al obtener ventanas", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    postPopUp = async (req, res) => {
        try {

            const {role, token} = await getAllDataSession(req)
            let result
            if (role) {

                if (role == 1 || role == 2) {
                    req.body.empresa_id = 0
                }
            }
            if (req.body.id) {
                const check = await this.ventanas.checkExistCompanyAndId(req.body.empresa_id, req.body.id)

                if (check.length) {
                    result = await this.ventanas.updateByCompanyIdAndId(req.body.empresa_id, req.body.id, req.body)
                }
            } else {
                result = await this.ventanas.save(req.body)
            }
            res.json({
                status: "success",
                msg: "Pasarela actualizada correctamente",
            });

        } catch (e) {
            logger.error("Error al guarda metodo de pago", e)
            res.json({ status: "error", msg: "Error al ejecutar acción requerida" });
        }


    }
    deletePopUp = async (req, res) => {

        try {

            const {role, token} = await getAllDataSession(req)

            if (role) {

                if (role == 1 || role == 2) {
                    req.body.empresa_id = 0
                }
            }
            let result = await this.ventanas.deleteById(req.body.id)
            res.status(200).json({
                status: "success",
                result: result

            });
        } catch (error) {
            logger.error("error al guardar banner", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    //fin ventanas emergentes

    //marcas

    getBrands = async (req, res) => {
        try {

            let {role, token, dataSession, dataSistema} = await getAllDataSession(req)
            let result
            let empresas
            let categorias
            let activo_marketplace
            if (token) {
                if (role == 1 || role == 2) {
                    token = 0
                    categorias = await this.categorias.getbyCompanyAndGetId(0)
                    result = await this.marcas.getbyCompany(0)
                    empresas = await this.empresas_marketplace.getAll();
                    activo_marketplace = await this.marketplace.getById(1)
                    activo_marketplace = activo_marketplace[0].habilitado

                } else if (role == 3) {
                    result = await this.marcas.getbyCompany(token)
                    categorias = await this.categorias.getbyCompanyAndGetId(token)
                    empresas: null
                    activo_marketplace: false
                }

                let items = {
                    marcas: result,
                    categorias: categorias,
                    empresas: empresas,
                    marketplace: activo_marketplace,

                }
                console.log(token)
                res.render("admin-marcas", {
                    dataSession,
                    dataSistema,
                    items,
                    token
                })
            } else {
                res.redirect("/")
            }


        } catch (error) {
            logger.info("Error al obtener ventanas", error)
            res.status(400).json({
                msg: error,
            });
        }

    }

    postBrands = async (req, res) => {
        try {
            const {role, token} = await getAllDataSession(req)
            let result
            if (role) {

                if (role == 1 || role == 2) {
                    req.body.empresa_id = 0

                }
            }
            if (req.body.id) {
                const check = await this.marcas.checkExistCompanyAndId(req.body.empresa_id, req.body.id)

                if (check.length) {
                    result = await this.marcas.updateByCompanyIdAndId(req.body.empresa_id, req.body.id, req.body)
                }
            } else {
                result = await this.marcas.save(req.body)
            }
            res.json({
                status: "success",
                msg: "Actualizada correctamente",
            });

        } catch (e) {
            logger.error("Error al guardar ", e)
            res.json({ status: "error", msg: "Error al ejecutar acción requerida" });
        }


    }
    deleteBrands = async (req, res) => {

        try {

            const {role, token} = await getAllDataSession(req)

            if (role) {

                if (role == 1 || role == 2) {
                    req.body.empresa_id = 0
                }
            }
            let result = await this.marcas.deleteById(req.body.id)
            res.status(200).json({
                status: "success",
                result: result

            });
        } catch (error) {
            logger.error("error al guardar banner", error)
            res.status(400).json({
                msg: error,
            });
        }
    }

    getModulos = async (req, res) => {
        let id = req.params.id
        try {
            let result
            const {role} = await getAllDataSession(req)
            if (role) {
                if (role == 1 || role == 2) {
                    result = await this.modulos.getAll()
                }
                if (role == 3) {
                    result = await this.modulos.getAll()
                }
            }

            res.status(200).json({
                status: "success",
                modulos: result
            });
        } catch (error) {
            logger.error("error al obtener modulos", error)
            res.status(400).json({
                msg: error,
            });
        }
    }




}

module.exports = SeccionesController;
