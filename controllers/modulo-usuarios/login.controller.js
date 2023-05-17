const ServiceSQL = require("../../services/services");
const bcrypt = require('bcrypt');
const logger = require("../../helpers/logger");
const moment = require("moment");

const {verify: hcaptchaVerify} = require('hcaptcha');
const { updateSesionQuery } = require("../../helpers/session");
const CONFIG = require("../../config/config")

const jwt = require('jsonwebtoken');

class LoginController {
    constructor() {
        this.categoriasEmpresa = new ServiceSQL("empresas_registradas_categorias");
        this.categoriasModulos = new ServiceSQL("empresas_categorias");
        this.usuarios = new ServiceSQL("usuarios");
        this.modulos = new ServiceSQL("modulos");
        this.empresas_usuarios = new ServiceSQL("empresas_usuarios");

    }

    authLogin = async (req, res) => {
        let ipData = req.body.ip;
        let { browser, device, platform } = req.body;
        let usuario = req.body.usuario;
        let password = req.body.password;

        try {

            // if (process.env.HCAPTCHA_ACTIVE == "true") {
            //     const _token = req.body._token;
            //     const result = await hcaptchaVerify(process.env.HCAPTCHA_PRIVATE_KEY, _token);
            //     if (!result.success) {
            //         return res.json({
            //             status: "error",
            //             msg: "Error en el captcha."
            //         });
            //     }
            // }

            const user = await this.usuarios.checkExistUser(usuario);
            if (!user.length) {
                res.json({ status: "error", msg: "El correo ingresado no se encuentra registrado" });
            } else {

                const isValid = bcrypt.compareSync(password, user[0].clave);

                if (isValid) {
                    const payload = {
                        id: user[0].id,
                        exp: Date.now() + parseInt(86400),
                        nombre: user[0].nombre,
                        rol: user[0].rol_id
                    };

                    const updateSesion = { ipData, dateConextion: moment().format(), browser, device, platform };
                    const userData = { correo: usuario, id: user[0].id }


                    req.session.usuario_id = user[0].id;
                    req.session.rol_id = user[0].rol_id;

                    req.session.dataUsuario = { nombre: user[0].nombre }
                    await updateSesionQuery(userData, updateSesion)


                    if (req.session.rol_id == 1 || req.session.rol_id == 2) {
                        const token_access = jwt.sign(
                            payload,
                            CONFIG.SECRET
    
                        );
    
                        res.cookie('authcookie', token_access, { maxAge: 90000000, httpOnly: true })

                        res.status(200).json({
                            status: "success", url: "usuario", token_access: token_access
                        });
                    } else if (req.session.rol_id == 3) {

                        const empresa = await this.empresas_usuarios.getbyUserCompany(req.session.usuario_id);

                        if (Array.isArray(empresa) && empresa.length == 1) {

                            payload.empresa_id = empresa[0].empresa_id;

                            const token_access = jwt.sign(
                                payload,
                                CONFIG.SECRET
        
                            );
        
                            res.cookie('authcookie', token_access, { maxAge: 90000000, httpOnly: true })

                            req.session.token = empresa[0].empresa_id;
                            return res.status(200).json({
                                status: "success", url: `usuario`,
                                token_access: token_access
                            });
                        }
                        // error el usuario no tiene una empresa asignada
                        return res.json({
                            status: "error", 
                            msg: "Error al ejecutar la petición intentalo nuevamente.",
                        });


                    }

                } else {
                    res.json({ status: "error", msg: "Contraseña incorrecta" });
                }
            }


        } catch (e) {
            logger.error("error al iniciar session", e);
            res.json({
                status: "error",
                msg: "Error al ejecutar la petición intentalo nuevamente.",
            });
        }

    }


}

module.exports = LoginController;
