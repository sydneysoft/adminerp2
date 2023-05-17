const ServiceSQL = require("../../services/services");
const { getDataSistema } = require("../../helpers/db");
const logger = require("../../helpers/logger");

class UsuarioController {
    constructor() {
        this.usuario = new ServiceSQL("usuarios");
        this.modulos = new ServiceSQL("modulos");
        this.empresa_marketplace = new ServiceSQL("empresas_marketplace");
        this.registroCategoria = new ServiceSQL("empresas_registradas_categorias");
        this.categoriasEmpresa = new ServiceSQL("empresas_categorias");


    }

    render = async (req, res) => {
        try {

            let token = req.session.token;

            let dataSistema = await getDataSistema(req.session.token);
            let dataSession = req.session;
            console.log("REQ", dataSession)

            const role = req.session.rol_id;

            const usuario = await this.usuario.getById(dataSession.usuario_id);

            const categorias = await this.categoriasEmpresa.getCategoriesRegister();
            if (role == 1 || role == 2 || role == 3) {
                res.render("modulo-usuarios/usuario/pagina-usuario", {
                    dataSession,
                    dataSistema,
                    categorias,
                    usuario
                });
            } else {
                res.status(403);
                res.render('403');
            }
        } catch (error) {
            logger.error("Error al mostrar perfil", error)
        }

    };

    getTables = async (req, res) => {
        const id = req.params.id

        let arrayModulos
        try {
            const user = await this.registro.getById(id)

            if (user[0].rol == "superadmin" || user[0].rol == "admin") {
                arrayModulos = await this.modulos.getAll()
            } else if (user[0].rol == "empresa") {

                const categoriasInscriptas = await this.registroCategoria.getbyCompany(id);

                const categoriasInscr = []
                const modulosMostrar = []
                let data = ""
                let modulo = ""
                if (categoriasInscriptas) {
                    for (let i = 0; i < categoriasInscriptas.length; i++) {

                        data = await this.categoriasEmpresa.checkModulos(categoriasInscriptas[i].categoria)
                        categoriasInscr.push(...JSON.parse(data[0].modulos))
                    }

                }

                if (categoriasInscr.length) {

                    for (let i = 0; i < categoriasInscr.length; i++) {

                        modulo = await this.modulos.getByName(categoriasInscr[i])
                        modulosMostrar.push(...modulo)
                    }

                }

                const dataNueva = Object.values(modulosMostrar.reduce((c, v) => Object.assign(c, { [v.id]: v }), {}));

                arrayModulos = dataNueva
            }
            res.status(200).json({ modulos: arrayModulos })
        } catch (error) {
            logger.error("Error al obtener modulos", error)
            arrayModulos = []
            res.status(400).json({ modulos: arrayModulos })
        }

    }
    obtenerCategorias = async (req, res) => {
        const id = req.params.id
        let arrayCategorias
        try {
            const categorias = await this.registroCategoria.getbyCompany(id)
            arrayCategorias = categorias.map(i => i.categoria);
            res.status(200).json({ categorias: arrayCategorias })
        } catch (error) {
            logger.error("Error al obtener categoria", error)
            arrayCategorias = []
            res.status(400).json({ categorias: arrayCategorias })
        }

    }
    actualizar = async (req, res) => {
        const id = req.params.id

        await this.usuario.getById(id).then(async () => {
            let result
            if (req.body.contrasena) {

                let password = bcrypt.hashSync(
                    req.body.contrasena,
                    bcrypt.genSaltSync(5),
                    null
                );
                req.body.contrasena = password
                result = await this.usuario.updateById(id, { nombre: req.body.nombre_empresa, clave: req.body.contrasena });
            } else {
                result = await this.usuario.updateById(id, { nombre: req.body.nombre_empresa });
            }



            return res.status(200).json({
                ok: true,
                result: id,
            });
        });
    }
    actualizarCategorias = async (req, res) => {
        const id = req.params.id

        try {
            const check = await this.registroCategoria.getbyCompany(id)
            if (check.length) {
                await this.registroCategoria.deleteByUsuario(id)
            }

            await this.registroCategoria.save(req.body)



        } catch (error) {
            return res.status(500).json({
                ok: false
            });
        }


    }
    obtenerDatos = async (req, res) => {
        const id = req.params.id
        try {
            const data = await this.registroCategoria.getbyCompany(id)
            res.status(200).json({ usuario: data })
        } catch (error) {
            return res.status(500).json({
                ok: false
            });
        }


    }


}

module.exports = UsuarioController;
