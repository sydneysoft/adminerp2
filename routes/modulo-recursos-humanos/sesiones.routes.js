const { Router } = require("express");
const SesionesController = require("../../controllers/modulo-recursos-humanos/sesiones.controller");
const router = Router();

const {getDataUsersSessions} = require("../../helpers/getSesion");
const moment = require("moment");
const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require('../../middlewares/EVResult.middleware');
const { check, oneOf, matchedData } = require('express-validator');

const { EmpresaUsuarioController, EmpresaMarketplaceController } = require("../../controllers/modulo-marketplace");
const { UsuariosController } = require("../../controllers/modulo-usuarios/usuarios.controller")

const { service: EmpresaUsuarioService } = EmpresaUsuarioController;
const { service: EmpresaMarketplaceService } = EmpresaMarketplaceController;
const { service: UsuariosService } = UsuariosController;

// router.get("/", new SesionesController().render);

router.get("/", async (req, res) => {
    let { token, role, dataSession, dataSistema } = await getAllDataSession(req);
    
    let hide
    const query = req.query;
    let { page = 1, search, items = 10, gt, lt, bt } = query;

    try {
        let date = null
        if (!!gt || !!lt) date = [gt, lt];
        if (!!bt) date = bt.split("B");



        if (role == 1 || role == 2) {

            hide = false
            const { data, total, pages } = await getDataUsersSessions({ items, page, search, date });
            res.render("modulo-recursos-humanos/sesiones/admin-sesiones", {
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

            let empresas_u = await EmpresaUsuarioService.getbyCompany(token)

            empresas_u = empresas_u.map(e => e.usuario_id)
            hide = true
            let usuarios = await UsuariosService.getUsersBycompanySelect(empresas_u)

            res.render("modulo-recursos-humanos/sesiones/admin-sesiones", {
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

    } catch (error) {
        return catchError(res, error);
    }
});



module.exports = router;
