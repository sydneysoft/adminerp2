const ServiceSQL = require("../../services/services");
const logger = require("../../helpers/logger");
const { getDataSistema } = require("../../helpers/db");
class BannerController {
    constructor() {
        this.banner = new ServiceSQL("banners");
        this.empresas_marketplace = new ServiceSQL("empresas_marketplace");
        this.marketplace = new ServiceSQL("marketplace");
    }
    //inicio admin banner
    getAdminBanner = async (req, res) => {
        try {

            const role = req.session.rol_id
            let token = req.session.token;

            const dataSession = req.session;
            const dataSistema = await getDataSistema(req.session.token)
            let items
    
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

            if (role == 1 || role == 2 || role == 3) {
                res.render("modulo-marketing/banners/admin-banners", {
                    dataSession,
                    dataSistema,
                    items,
                    token
                })
            } else {

                res.status(403);
                res.render('403');
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

            const role = req.session.rol_id

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
            const role = req.session.rol_id
            const token = req.session.token;


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

            const role = req.session.rol_id

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
}
//fin admin banner
module.exports = BannerController;
