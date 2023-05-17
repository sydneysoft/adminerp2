const { Router } = require("express"),
    router = Router();
    // ConfiguracionSistemaController = require("../../controllers/modulo-generales/configuracion-sistema-trash.controller");
const { authenticateJWT } = require("../../middlewares/jwt");

const CryptoJS = require("crypto-js");

const {ConfiguracionCorreoController} = require('../../controllers/modulo-generales/configuracion/configuracion-correos.controller');
const {ConfiguracionSitemaController} = require('../../controllers/modulo-generales/configuracion/configuracion-sistema.controller');
const {EmpresaMarketplaceController} = require('../../controllers/modulo-marketplace/empresas-marketplace.controller');

const { service: ConfiguracionCorreoService } = ConfiguracionCorreoController;
const { service: ConfiguracionSitemaService } = ConfiguracionSitemaController;
const { service: EmpresaMarketplaceService } = EmpresaMarketplaceController;

const {catchError, getAllDataSession, notAuthorize} = require('../../helpers/modulo-tv/basicrequest.helpers');
const config = require("../../config/config");

// router.get("/", authenticateJWT, new ConfiguracionSistemaController().adminConfiguracion);
// router.get("/datos", authenticateJWT, new ConfiguracionSistemaController().adminConfiguracionDatos);
// router.post("/", authenticateJWT, new ConfiguracionSistemaController().saveConfiguration);
// router.post("/icon", authenticateJWT, new ConfiguracionSistemaController().saveFavicom);
// router.post("/seo", authenticateJWT, new ConfiguracionSistemaController().saveSEO);
// router.post("/save-ecommerce", authenticateJWT, new ConfiguracionSistemaController().saveEcommerce);
// router.post("/save-terminos", authenticateJWT, new ConfiguracionSistemaController().saveTerminos);
// router.post("/save-privacidad", authenticateJWT, new ConfiguracionSistemaController().savePrivacidad);


// router.post("/configuracion-correo", authenticateJWT, new ConfiguracionSistemaController().postConfigEmail)
// router.post("/configuracion-redes/:id", authenticateJWT, new ConfiguracionSistemaController().postRedes)


/**
 * @caeher
 * @description: esta ruta obtiene datos de empresas_marketplace y configuracion_sistema
 * 
 */
router.get("/", authenticateJWT, async (req, res) => {
    try {
       
        const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
       
        let configuracion_general
        let datosCompania
        let items



        if (role == 1 || role == 2) {
            return res.render("modulo-generales/configuracion-sistema/superadmin", {
                dataSession,
                dataSistema
            });
            configuracion_general = await ConfiguracionSitemaService.getbyCompany(0); // Configuracion superadmin
            datosCompania = await EmpresaMarketplaceService.getById(0) // Datos de la empresa superadmin

            items = {
                configuracion_general: configuracion_general[0],
                datosCompania: datosCompania[0]
            }
        }

        configuracion_general = await ConfiguracionSitemaService.getbyCompany(token)
        datosCompania = await EmpresaMarketplaceService.getById(token)

        if (!configuracion_general.length > 0) {

            items = {

                configuracion_general: {
                    logo: "/images/logo.png",
                    favicon: "/images/logo-favicom.ico",
                    meta_etiquetas: "",
                    empresa_id: token
                },
                datosCompania: datosCompania[0]
            }
            await ConfiguracionSitemaService.save(items.configuracion_general)

        } else {
            items = {
                configuracion_general: configuracion_general[0],
                datosCompania: datosCompania[0]
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
        return catchError(res, error);
    }
});

router.get("/empresa/:id", async (req, res) => {
    try {
        const {dataSession, dataSistema} = await getAllDataSession(req);
        configuracion_general = await ConfiguracionSitemaService.getbyCompany(req.params.id)
        datosCompania = await EmpresaMarketplaceService.getById(req.params.id)

        if (!configuracion_general.length > 0) {

            items = {

                configuracion_general: {
                    logo: "/images/logo.png",
                    favicon: "/images/logo-favicom.ico",
                    meta_etiquetas: "",
                    empresa_id: req.params.id
                },
                datosCompania: datosCompania[0]
            }
            await ConfiguracionSitemaService.save(items.configuracion_general)

        } else {
            items = {
                configuracion_general: configuracion_general[0],
                datosCompania: datosCompania[0]
            }
        }

        res.render("modulo-generales/configuracion-sistema/configuracion-sistema", {
            dataSession,
            dataSistema,
            items,
            empresa_id: req.params.id
        });


    } catch (error) {
        return catchError(res, error);
    }
});

/**
 * @caeher
 * @description: esta ruta obtiene datos de configuracion_correo y configuracion_sistema
 */
router.get('/datos', authenticateJWT, async (req, res) => {
    try {
        const { role, token } = await getAllDataSession(req);
        let correos
        let configuraciones

        if (role == 1 || role == 2) {
            const empresa_id = req.query.empresa_id;
            correos = await ConfiguracionCorreoService.getbyCompany(empresa_id)
            configuraciones = await ConfiguracionSitemaService.getbyCompany(empresa_id)
        }
        if (role == 3) {

            correos = await ConfiguracionCorreoService.getbyCompany(token)
            configuraciones = await ConfiguracionSitemaService.getbyCompany(token)
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
});

/**
 * 
 */
router.post('/', authenticateJWT, async (req, res) => {
    try {

        const {role, token} = await getAllDataSession(req);

        if (role == 1 || role == 2) {
            req.body.empresa_id = 0
        }

        const check = await ConfiguracionSitemaService.checkExistCompany(req.body.empresa_id)
        let result
        if (check.length) {

            result = await ConfiguracionSitemaService.actualizarLogoEmpresaId(req.body, req.body.empresa_id)
        } else {
            result = await ConfiguracionSitemaService.save(req.body)
        }

        res.status(200).json({
            status: "success",

        });
    } catch (error) {
        return catchError(res, error);
    }
});

/**
 * 
 */
router.post('/icon', authenticateJWT, async (req, res) => {
    try {
        const {role, token} = await getAllDataSession(req);

        if (role == 1 || role == 2) {
            req.body.empresa_id = 0
        }

        const check = await ConfiguracionSitemaService.checkExistCompany(req.body.empresa_id)
        let result
        if (check.length) {

            result = await ConfiguracionSitemaService.actualizarLogoEmpresaId(req.body, req.body.empresa_id)
        } else {
            result = await ConfiguracionSitemaService.save(req.body)
        }

        res.status(200).json({
            status: "success",

        });
    } catch (error) {
        return catchError(res, error);
    }
});

/**
 * 
 */
router.post("/seo", authenticateJWT, async (req, res) => {
    try {
        const {role, token} = await getAllDataSession(req);

        if (role == 1 || role == 2) {
            req.body.empresa_id = 0
        }

        const check = await ConfiguracionSitemaService.checkExistCompany(req.body.empresa_id)
        let result
        if (check.length) {

            result = await ConfiguracionSitemaService.actualizarEmpresaId({ meta_etiquetas: req.body.meta_etiquetas }, req.body.empresa_id)
        } else {
            result = await ConfiguracionSitemaService.save(req.body)
        }

        res.status(200).json({
            status: "success",

        });
    } catch (error) {
        return catchError(res, error);
    }
});

/**
 * 
 */
router.post("/save-ecommerce", authenticateJWT, async (req, res) => {
    try {
        const {role, token} = await getAllDataSession(req);

        if (role == 1 || role == 2) {
            req.body.empresa_id = 0
        }

        const check = await ConfiguracionSitemaService.checkExistCompany(req.body.empresa_id)
        let result
        if (check.length) {

            result = await ConfiguracionSitemaService.actualizarEmpresaId({ moneda: req.body.moneda }, req.body.empresa_id)
        } else {
            result = await ConfiguracionSitemaService.save(req.body)
        }

        res.status(200).json({
            status: "success",

        });
    } catch (error) {
        return catchError(res, error);
    }
});

/**
 * 
 */
router.post("/save-terminos", authenticateJWT, async (req, res) => {
    try {
        const {role, token} = await getAllDataSession(req);

        if (role == 1 || role == 2) {
            req.body.empresa_id = 0
        }

        const check = await ConfiguracionSitemaService.checkExistCompany(req.body.empresa_id)
        let result
        if (check.length) {

            result = await ConfiguracionSitemaService.actualizarEmpresaId({ terminosycondiciones: req.body.terminosycondiciones }, req.body.empresa_id)
        } else {
            result = await ConfiguracionSitemaService.save(req.body)
        }

        res.status(200).json({
            status: "success",

        });
    } catch (error) {
        return catchError(res, error);
    }
});

/**
 * 
 */
router.post("/save-privacidad", authenticateJWT, async (req, res) => {
    try {
        const {role, token} = await getAllDataSession(req);

        if (role == 1 || role == 2) {
            req.body.empresa_id = 0
        }

        const check = await ConfiguracionSitemaService.checkExistCompany(req.body.empresa_id)
        let result
        if (check.length) {

            result = await ConfiguracionSitemaService.actualizarEmpresaId({ politicasdeprivacidad: req.body.politicasdeprivacidad }, req.body.empresa_id)
        } else {
            result = await ConfiguracionSitemaService.save(req.body)
        }

        res.status(200).json({
            status: "success",

        });
    } catch (error) {
        return catchError(res, error);
    }
});

/**
 * 
 */
router.post("/configuracion-correo", authenticateJWT, async (req, res) => {
    try {
        // Obtimizar luego.
        const check = await ConfiguracionCorreoService.checkExistCompany(req.body.empresa_id);
        const {token, role} = await getAllDataSession(req);
        if (role == 3) {
            req.body.empresa_id = token;
        }
        if (check.length) {

            if (req.body.smpt_password) {
                if (req.body.smpt_password == check[0].smpt_password) {
                    delete req.body.smpt_password;
                } else {
                    req.body.smpt_password  = CryptoJS.AES.encrypt(
                        req.body.smpt_password,
                        config.SECRET
                    ).toString();
                }
            }
    
            let result
    
            if (req.body.empresa_id == check[0].empresa_id) {
                result = await ConfiguracionCorreoService.updateByCompanyId(req.body.empresa_id, req.body)
            } else {
                return res.json({ status: "error", msg: "Error al ejecutar acción requerida" });
            }

        } else {
            result = await ConfiguracionCorreoService.save(req.body);
            
        }

        return res.json({
            status: "success",
            msg: "Actualizada correctamente",
        });

    } catch (e) {
        res.json({ status: "error", msg: `Error al ejecutar acción requerida: ${e.message}` });
    }
})

/**
 * 
 */
router.post("/configuracion-redes/:id", authenticateJWT, async (req, res) => {
    const id = req.params.id
        try {

            await EmpresaMarketplaceService.updateById(id, req.body)

            res.status(200).json({
                status: "success",
            });

        } catch (error) {
            logger.error("Error", error)
            res.status(400).json({
                msg: error,
            });
        }
})

module.exports = router;