const ServiceSQL = require("../../services/services");
const logger = require("../../helpers/logger");
const { getDataSistema } = require("../../helpers/db");
const { getDataUsersSessions } = require("../../helpers/getSesion");
const moment = require("moment");
class SesionesController {
    constructor() {
        this.empresas_marketplace = new ServiceSQL("empresas_marketplace");
        this.usuarios = new ServiceSQL("usuarios");

        this.empresas_usuarios = new ServiceSQL("empresas_usuarios");


    }

    render = async (req, res) => {
        const dataSistema = await getDataSistema(req.session.token);
        const dataSession = req.session;
        let token = req.session.token;
        let query = req.query;
        let hide
        const role = req.session.rol_id
        let { page = 1, search, items = 10, gt, lt, bt } = query;

        try {
            let date = null
            if (!!gt || !!lt) date = [gt, lt];
            if (!!bt) date = bt.split("B");



            if (role == 1 || role == 2) {

                hide = false
                const { data, total, pages } = await getDataUsersSessions({ items, page, search, date });
                res.render("modulo-generales/sesiones/admin-sesiones", {
                    dataSistema,
                    dataSession,
                    dataUsers: [...data.map(d => ({ ...d, ultima_conexion: moment(d.ultima_conexion).format("DD/MM/YYYY HH:mm:ss") }))],
                    paginationOp: {
                        total,
                        listItemsPerPage: [5, 10, 15, -1], // Lista de cantidades de item por pagina para seleccionar
                        selectItemPerPage: parseInt(items) || 10,
                        page: parseInt(page) || 1,
                        pages,
                        search,
                        date
                    },
                    hide

                });
            } else if (role == 3) {

                let empresas_u = await this.empresas_usuarios.getbyCompany(token)

                empresas_u = empresas_u.map(e => e.usuario_id)
                hide = true
                let usuarios = await this.usuarios.getUsersBycompanySelect(empresas_u)

                res.render("modulo-generales/sesiones/admin-sesiones", {
                    dataSistema,
                    dataSession,
                    dataUsers: [...usuarios.map(d => ({ ...d, ultima_conexion: moment(d.ultima_conexion).format("DD/MM/YYYY HH:mm:ss") }))],
                    paginationOp: {
                        total: usuarios.length,
                        listItemsPerPage: [5, 10, 15, -1], // Lista de cantidades de item por pagina para seleccionar
                        selectItemPerPage: parseInt(usuarios.length) || 10,
                        page: parseInt(page) || 1,
                        pages: usuarios.length,
                        search,
                        date
                    },
                    hide


                });
            } else {

                res.status(403);
                res.render('403');
            }

        } catch (e) {
            logger.error("sesiones error", e)
            res.json(e);
        }
    }

}
//fin admin banner
module.exports = SesionesController;
