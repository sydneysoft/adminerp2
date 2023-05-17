const ServiceSQL = require("../../services/services");
const logger = require("../../helpers/logger");
const { getDataSistema } = require("../../helpers/db");
const {getAllDataSession, catchError, notAuthorize} = require('../../helpers/modulo-tv/basicrequest.helpers');
class PortadasController {
    constructor() {
        this.portadas = new ServiceSQL("portada_pages");
        this.empresas_marketplace = new ServiceSQL("empresas_marketplace");
        this.marketplace = new ServiceSQL("marketplace");
    }

    //inicio admin portadas
    getAdminPortadas = async (req, res) => {
        try {
            let { role, token, dataSistema, dataSession } = await getAllDataSession(req);
            let result
            let items

            if (role == 1 || role == 2) {
                //muestra todos de todas las empresas
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

            res.render("modulo-marketing/configuracion-portada/admin-portadas", {
                dataSession,
                dataSistema,
                items,
                token
            })

        } catch (error) {
            return catchError(res, error);
        }
    }
    editAdminPortadas = async (req, res) => {
        try {

    
            if (req.body.id) {
              let  result = await this.portadas.updateById(req.body.id, req.body)
                res.status(200).json({ status: "success" });
            }


        } catch (error) {
            logger.error("Error al actualizar imagen", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
}
//fin admin portadas
module.exports = PortadasController;
