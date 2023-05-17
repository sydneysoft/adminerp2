const ServiceSQL = require("../../services/services");
const { getDataSistema } = require('../../helpers/db');
const logger = require("../../helpers/logger");
class FiltrosController {
    constructor() {

        this.empresas_marketplace = new ServiceSQL("empresas_marketplace");
        this.marketplace = new ServiceSQL("marketplace");
        this.filtros = new ServiceSQL("grupo_filtro")
        this.categorias = new ServiceSQL("categorias");
    }
    getFilters = async (req, res) => {
        try {

            const role = req.session.rol_id
            let token = req.session.token;
            const dataSession = req.session;
            const dataSistema = await getDataSistema(req.session.token)
            let result
            let empresas
            let categorias
            let activo_marketplace

            if (role == 1 || role == 2) {
                token = 0
                categorias = await this.categorias.getbyCompanyAndGetId(0)
                result = await this.filtros.getAll()
                empresas = await this.empresas_marketplace.getAll();
                activo_marketplace = await this.marketplace.getById(1)
                activo_marketplace = activo_marketplace[0].habilitado

            } else if (role == 3) {
                result = await this.filtros.getbyCompany(token)
                categorias = await this.categorias.getbyCompanyAndGetId(token)
                empresas: null
                activo_marketplace: false
            }

            let items = {
                filtros: result,
                categorias: categorias,
                empresas: empresas,
                marketplace: activo_marketplace,

            }

            if (role == 1 || role == 2 || role == 3) {
                res.render("modulo-ecommerce/filtros/admin-filtros", {
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
            logger.info("Error al obtener ventanas", error)
            res.status(400).json({
                msg: error,
            });
        }

    }

}

module.exports = FiltrosController;
