const logger = require("../../helpers/logger");
const ServiceSQL = require("../../services/services");
const { getDataSistema } = require("../../helpers/db");


class DeliveryController {
    constructor() {
        this.servicios_entrega = new ServiceSQL("servicios")
        this.servicios_metodos = new ServiceSQL("servicios_metodos")
        this.metodos_envio = new ServiceSQL("metodos_envio")
    }
     
    //inicio  servicios entrega


    postDelivery = async (req, res) => {
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
            if (req.body.id) {

                result = await this.servicios_entrega.updateById(req.body.id, { nombre: req.body.nombre, telefono: req.body.telefono })

            } else {
                result = await this.servicios_entrega.save({ nombre: req.body.nombre, telefono: req.body.telefono, empresa_id: req.body.empresa_id })

                let metodos = req.body.metodos;

                for (let i = 0; metodos.length > i; i++) {
                    await this.servicios_metodos.save({ id_servicio: result, id_metodo: metodos[i], empresa_id: req.body.empresa_id })

                }


            }
            res.json({
                status: "success",
                msg: "Actualizada correctamente",
            });

        } catch (e) {
            logger.error("Error al guardar servicios", e)
            res.json({ status: "error", msg: "Error al ejecutar acción requerida" });
        }


    }

    getDelivery = async (req, res) => {

        try {
            const role = req.session.rol_id
            let token = req.session.token;
            const dataSession = req.session;
            const dataSistema = await getDataSistema(req.session.token)
            let servicios_entrega
            let metodos_envio

            if (role == 1 || role == 2) {
                token = 0
                servicios_entrega = await this.servicios_entrega.getbyCompany(0)
                metodos_envio = await this.metodos_envio.getbyCompany(0)

            } else if (role == 3) {
                servicios_entrega = await this.servicios_entrega.getbyCompany(token)
                metodos_envio = await this.metodos_envio.getbyCompany(token)

            }

            let items = {
                servicios_entrega: servicios_entrega,
                metodos_envio: metodos_envio

            }
            res.render("modulo-generales/servicios-entrega/admin-servicios", {
                dataSession,
                dataSistema,
                items,
                token
            })

        } catch (error) {
            logger.info("Error al obtener metodos de envio", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    deleteDelivery = async (req, res) => {
        const id = req.params.id;

        try {
            await this.servicios_entrega.deleteById(id)
            await this.servicios_metodos.deleteByIdServicio(id)
            res.json({
                status: "success",
                msg: "Se eliminaron los registros correctamente",
            });
        } catch (error) {
            logger.error("error al guardar metodo envio", error)
            res.status(400).json({
                status: "error", msg: "El método no se pudo eliminar"
            });
        }
    }
    //fin servicios entrega
}

module.exports = DeliveryController