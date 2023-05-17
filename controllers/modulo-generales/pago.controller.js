const logger = require("../../helpers/logger");
const ServiceSQL = require("../../services/services");
const { getDataSistema } = require("../../helpers/db");
const CryptoJS = require("crypto-js");
const config = require("../../config/config");

class PagoController {
    constructor() {
        this.metodos = new ServiceSQL("metodos_pagos");
    }

    //inicio admin metodos pago

    getMethodPayment = async (req, res) => {
        try {

            const role = req.session.rol_id
            let token = req.session.token;

            const dataSession = req.session;
            const dataSistema = await getDataSistema(req.session.token)
            let items
            let result

            if (role == 1 || role == 2) {
                token = 0
                result = await this.metodos.getbyCompany(0)

            } else if (role == 3) {
                result = await this.metodos.getbyCompany(token)
            }

            res.render("modulo-generales/metodos-pagos/admin-metodos-pago", {
                dataSession,
                dataSistema,
                result,
                token
            })

        } catch (error) {
            logger.error("Error al obtener metodos de pago", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    postMethodPayment = async (req, res) => {
        try {

            const role = req.session.rol_id
            if (role) {
                if (req.body.token) {

                    let tokenSecret = CryptoJS.AES.encrypt(
                        req.body.token,
                        config.SECRET
                    ).toString();

                    req.body.token = tokenSecret

                }

                if (req.body.api_key) {



                    let tokenSecret2 = CryptoJS.AES.encrypt(
                        req.body.api_key,
                        config.SECRET
                    ).toString();

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


}

module.exports = PagoController