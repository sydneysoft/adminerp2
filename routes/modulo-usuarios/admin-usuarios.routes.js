const { Router } = require("express");
const AdminController = require("../../controllers/modulo-usuarios/admin-usuarios.controller"),
    router = Router()

// router.get("/", async (req, res) => {
//     try {
//         // const role = req.session.role
//         // let token = req.session.token;
//         // const dataSession = req.session;
//         // const dataSistema = await getDataSistema(req.session.token)
//         let {role, token, dataSession, dataSistema} = await getAllDataSession(req);

//         let modulos
//         let usuarios


//         if (role == 1 || role == 2) {
//             token = 0
//             usuarios = await this.usuarios.getAll()
//             modulos = await this.modulos.getAll()
//         } else if (role == 3) {
//             usuarios = await this.usuarios.getById(token)
//             modulos = await this.modulos.getAll()
//             //   modulos = await this.modulos.getbyCompany(0)

//         }

//         let items = {
//             usuarios: usuarios,
//             modulos: modulos
//         }
//         res.render("modulo-usuarios/administradores/admin-usuarios", {
//             dataSession,
//             dataSistema,
//             token,
//             items
//         })

//     } catch (error) {
//         logger.error("Error al obtener chat", error)
//         res.status(400).json({
//             msg: error,
//         });
//     }
// });

router.get("/", new AdminController().renderUserAdmin);
router.post("/nuevo", new AdminController().newUser);
router.post("/relacion", new AdminController().newRelationships);

// router.get("/method-chatbot", new AdminController().getChat);

module.exports = router;
