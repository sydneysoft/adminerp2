const ServiceSQL = require("../../services/services");
const { getDataSistema } = require('../../helpers/db');
const logger = require("../../helpers/logger");
const bcrypt = require("bcryptjs");

const {catchError, getAllDataSession, notAuthorize} = require('../../helpers/modulo-tv/basicrequest.helpers');
class AdminController {
    constructor() {
        this.usuarios = new ServiceSQL("usuarios");
        this.empresas_usuarios = new ServiceSQL("empresas_usuarios");
        this.modulos = new ServiceSQL("modulos");
    }
    //Admin Usuarios


    renderUserAdmin = async (req, res) => {
        try {
            // const role = req.session.role
            // let token = req.session.token;
            // const dataSession = req.session;
            // const dataSistema = await getDataSistema(req.session.token)
            let {role, token, dataSession, dataSistema} = await getAllDataSession(req);

            let modulos
            let usuarios


            if (role == 1 || role == 2) {
                token = 0
                usuarios = await this.usuarios.getAll()
                modulos = await this.modulos.getAll()
            } else if (role == 3) {
                usuarios = await this.usuarios.getById(token)
                modulos = await this.modulos.getAll()
                //   modulos = await this.modulos.getbyCompany(0)

            }

            let items = {
                usuarios: usuarios,
                modulos: modulos
            }
            res.render("modulo-usuarios/administradores/admin-usuarios", {
                dataSession,
                dataSistema,
                token,
                items
            })

        } catch (error) {
            logger.error("Error al obtener chat", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    // getChat = async (req, res) => {
    //     try {

    //         const role = req.session.role
    //         let token = req.session.token;

    //         let result


    //         if (token) {

    //             if (role == "superadmin" || role == "admin") {
    //                 token = 0
    //                 result = await this.chatbots.getbyCompany(0)

    //             } else if (role == "empresa") {
    //                 result = await this.chatbots.getbyCompany(token)
    //             }


    //             res.status(200).json({chat:result})
    //         } else {
    //             res.redirect("/")
    //         }
    //     } catch (error) {
    //         logger.error("Error al obtener chat", error)
    //         res.status(400).json({
    //             msg: error,
    //         });
    //     }
    // }
    newUser = async (req, res) => {
        try {

            const role = req.session.role
            if (role) {

                if (role == "superadmin" || role == "admin") {
                    req.body.rol = "admin"

                }
            } else if (role == "empresa") {
                req.body.rol = "empresa"
            }

            const check = await this.usuarios.checkExistUser(req.body.correo)
            req.body.clave = bcrypt.hashSync(
                req.body.clave,
                bcrypt.genSaltSync(5),
                null
            );
            if (check.length) {
                res.json({
                    status: "Error",
                    msg: "Existe un usuario con el correo indicado",
                });
            } else {
                await this.usuarios.save(req.body)
            }
            res.json({
                status: "success",
                msg: "Configuración de chat actualizado correctamente",
            });

        } catch (e) {
            logger.error("Error al guardar usuario", e)
            res.json({ status: "error", msg: "Error al ejecutar acción requerida" });
        }


    }
    newRelationships = async (req, res) => {
        try {

            const role = req.session.role
            if (role) {

                if (role == "superadmin" || role == "admin") {
                    req.body.empresa_id = 0

                }
            }

            await this.empresas_usuarios.save(req.body)
            res.status(200).json({
                status: "success",
                msg: "Configuración actualizado correctamente",
            });

        } catch (e) {
            logger.error("Error al guardar usuario", e)
            res.json({ status: "error", msg: "Error al ejecutar acción requerida" });
        }


    }
}

module.exports = AdminController;
