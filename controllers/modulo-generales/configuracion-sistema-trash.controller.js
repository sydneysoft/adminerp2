const ServiceSQL = require("../../services/services");
const logger = require("../../helpers/logger");
const CryptoJS = require("crypto-js");
const { getDataSistema } = require('../../helpers/db');
const config = require("../../config/config");
class ConfiguracionSistemaController {
    constructor() {

        this.configuracion_correos = new ServiceSQL("configuracion_correos")
        this.configuracion = new ServiceSQL("configuracion_sistema");
        this.empresas_marketplace = new ServiceSQL("empresas_marketplace");
        this.galeria_fotos = new ServiceSQL("galeria_fotos");
    }
    // configuracion sistema
    saveSEO = async (req, res) => {
        try {
            const role = req.session.rol_id
            const token = req.session.token;

            if (role == 1 || role == 2) {
                req.body.empresa_id = 0
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
    saveEcommerce = async (req, res) => {
        try {
            const role = req.session.rol_id


            if (role == 1 || role == 2) {
                req.body.empresa_id = 0
            }

            const check = await this.configuracion.checkExistCompany(req.body.empresa_id)
            let result
            if (check.length) {

                result = await this.configuracion.actualizarEmpresaId({ moneda: req.body.moneda }, req.body.empresa_id)
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
    saveTerminos = async (req, res) => {
        try {
            const role = req.session.rol_id


            if (role == 1 || role == 2) {
                req.body.empresa_id = 0
            }

            const check = await this.configuracion.checkExistCompany(req.body.empresa_id)
            let result
            if (check.length) {

                result = await this.configuracion.actualizarEmpresaId({ terminosycondiciones: req.body.terminosycondiciones }, req.body.empresa_id)
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
    savePrivacidad = async (req, res) => {
        try {
            const role = req.session.rol_id


            if (role == 1 || role == 2) {
                req.body.empresa_id = 0
            }

            const check = await this.configuracion.checkExistCompany(req.body.empresa_id)
            let result
            if (check.length) {

                result = await this.configuracion.actualizarEmpresaId({ politicasdeprivacidad: req.body.politicasdeprivacidad }, req.body.empresa_id)
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
 
    saveConfiguration = async (req, res) => {

        try {
            const role = req.session.rol_id
            const token = req.session.token;

            if (role == 1 || role == 2) {
                req.body.empresa_id = 0
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
            const role = req.session.rol_id
            const token = req.session.token;

            if (role == 1 || role == 2) {
                req.body.empresa_id = 0
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
            const role = req.session.rol_id
            let token = req.session.token;


            const dataSession = req.session;
            const dataSistema = await getDataSistema(token)
            let configuracion_general
            let datosCompania
            let items



            if (role == 1 || role == 2) {
                token = 0

                configuracion_general = await this.configuracion.getbyCompany(0)
                datosCompania = await this.empresas_marketplace.getById(0)

                items = {
                    configuracion_general: configuracion_general[0],
                    datosCompania: datosCompania[0]
                }
            } else if (role == 3) {
                configuracion_general = await this.configuracion.getbyCompany(token)
                datosCompania = await this.empresas_marketplace.getById(token)
                console.log("DATOS COMPANIA", datosCompania[0])
                if (!configuracion_general.length > 0) {

                    items = {

                        configuracion_general: {
                            logo: "/images/logo.png",
                            favicon: "/images/logo-favicom.ico",
                            meta_etiquetas: "",
                            empresa_id: token
                        }
                    }
                    await this.configuracion.save(items.configuracion_general)

                } else {
                    items = {
                        configuracion_general: configuracion_general[0],
                        datosCompania: datosCompania[0]
                    }
                }


            }

            if (role == 1 || role == 2 || role == 3) {
                res.render("modulo-generales/configuracion-sistema/configuracion-sistema", {
                    items,
                    dataSession,
                    dataSistema,
                    token
                });

            } else {

                res.status(403);
                res.render('403');
            }



        } catch (error) {
            logger.error("Error en modulo configuracion", error)
            res.status(400).json({
                msg: error,
            });
        }
    }

    adminConfiguracionDatos = async (req, res) => {

        try {
            const role = req.session.rol_id
            const token = req.session.token;
            let correos
            let configuraciones


            if (role == 1 || role == 2) {
                correos = await this.configuracion_correos.getbyCompany(0)
                configuraciones = await this.configuracion.getbyCompany(token)
            }

            if (role == 3) {

                correos = await this.configuracion_correos.getbyCompany(token)
                configuraciones = await this.configuracion.getbyCompany(token)
            }
            let items = {
                correos: correos,
                configuraciones: configuraciones
            }

            res.status(200).json({ items: items });


        } catch (error) {
            res.status(400).json({
                msg: error,
            });
        }
    }


    postRedes = async (req, res) => {
        const id = req.params.id
        try {

            await this.empresas_marketplace.updateById(id, req.body)

            res.status(200).json({
                status: "success",
            });

        } catch (error) {
            logger.error("Error", error)
            res.status(400).json({
                msg: error,
            });
        }
    }



    //inicio configuracion correo

    postConfigEmail = async (req, res) => {

        try {


            if (!req.body.id) {
                const role = req.session.rol_id

                if (role) {

                    if (role == 1 || role == 2) {
                        req.body.empresa_id = 0

                    }
                }
            }

            if (req.body.smpt_password) {
                let tokenSecret = CryptoJS.AES.encrypt(
                    req.body.smpt_password,
                    config.SECRET
                ).toString();

                req.body.smpt_password = tokenSecret
            }

            let result


            const check = await this.configuracion_correos.checkExistCompany(req.body.empresa_id)
            if (check.length) {

                result = await this.configuracion_correos.updateByCompanyId(req.body.empresa_id, req.body)

            } else {
                result = await this.configuracion_correos.save(req.body)
            }
            res.json({
                status: "success",
                msg: "Actualizada correctamente",
            });

        } catch (e) {
            logger.error("Error al guardar configuracion de correos", e)
            res.json({ status: "error", msg: "Error al ejecutar acción requerida" });
        }


    }




}

module.exports = ConfiguracionSistemaController;
