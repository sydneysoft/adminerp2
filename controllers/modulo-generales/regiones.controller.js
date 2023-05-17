const logger = require("../../helpers/logger");
const ServiceSQL = require("../../services/services");
const { getDataSistema } = require("../../helpers/db");


class RegionesController {
    constructor() {
        this.regiones = new ServiceSQL("regiones_entrega")
        this.paises = new ServiceSQL("pais")
        this.ciudades = new ServiceSQL("ciudad")
        this.region_grupo = new ServiceSQL("regiones_entrega_grupo")

    }
    //inicio configuracion regiones
    getRegiones = async (req, res) => {
        try {
            const role = req.session.rol_id
            let token = req.session.token;
            const dataSession = req.session;
            const dataSistema = await getDataSistema(req.session.token)
            let regiones

            if (role == 1 || role == 2) {
                token = 0
                regiones = await this.regiones.getAll()


            } else if (role == 3) {
                regiones = await this.regiones.getbyCompany(token)
            }

            let grupos = await this.region_grupo.getNameCityAndPlaces()
            let paises = await this.paises.getAll()

            let items = {
                regiones: regiones,
                paises: paises,
                grupos: grupos
            }
            if (role == 1 || role == 2 || role == 3) {
                res.render("modulo-generales/regiones/admin-regiones", {
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
            logger.info("Error al obtener sedes", error)
            res.status(400).json({
                msg: error,
            });
        }
    }

    postRegiones = async (req, res) => {


        let result
        if (!req.body.id) {
            const role = req.session.rol_id
            if (role) {

                if (role == 1 || role == 2) {
                    req.body.empresa_id = 0

                }
            }
        }

        try {
 
 
            const checkIdGrupo = await this.regiones.checkExistModuleGroupName(req.body.empresa_id, req.body.nombre);
            console.log(checkIdGrupo);
            if (checkIdGrupo.length) {


                const group_id = checkIdGrupo[0].id_grupo


                await this.region_grupo.deleteByGroup(group_id).then(() => {


                    req.body.states.map(async (state) => {
                        await this.region_grupo.save({ ciudadID: state, id_grupo: group_id });

                    })

                })

            } else {
                let last
                const checkLastGroup = await this.region_grupo.checkLastNumber()
                if (checkLastGroup[0].id_grupo) {
                    last = checkLastGroup[0].id_grupo
                } else {
                    last = 0
                }
                const nuevoNumero = last + 1

                req.body.states.map(async (state) => {
                    await this.region_grupo.save({ ciudadID: state, id_grupo: nuevoNumero });

                })

                await this.regiones.save({ empresa_id: req.body.empresa_id, nombre: req.body.nombre, id_grupo: nuevoNumero, pais: req.body.pais })

            }
            res.json({
                status: "success",
                msg: "Actualizada correctamente",
            });



        } catch (e) {
            logger.error("Error al guardar sedes", e)
            res.json({ status: "error", msg: "Error al ejecutar acción requerida" });
        }


    }

    deleteRegiones = async (req, res) => {
        const id = req.params.id;
        try {
            await this.regiones.deleteById(id)
            res.json({
                status: "success",
                msg: "El método fue eliminado correctamente",
            });
        } catch (error) {
            logger.error("error al guardar metodo envio", error)
            res.status(400).json({
                status: "error", msg: "El método no se pudo eliminar"
            });
        }
    }
    getRegionesJson = async (req, res) => {
        try {
            const role = req.session.rol_id
            let token = req.session.token;

            let regiones


            if (role == 1 || role == 2) {
                token = 0
                regiones = await this.regiones.getbyCompany(0)

            } else if (role == 3) {
                regiones = await this.regiones.getbyCompany(token)
            }
            let items = {
                regiones: regiones,
            }
            res.status(200).json({
                items: items, token: token
            })



        } catch (error) {
            logger.info("Error al obtener regiones", error)
            res.status(400).json({
                msg: error,
            });
        }
    }

    getDistritos = async (req, res) => {
        const pais = req.params.id
        try {
            let ciudades = await this.ciudades.getbyCountry(pais)

            res.status(200).json({
                ciudades: ciudades,

            })



        } catch (error) {
            logger.info("Error al obtener distritos", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    getByCity = async (req, res) => {
        const city = req.params.id
        try {
            let distrito = await this.ciudades.getByCity(city)

            res.status(200).json({
                distrito: distrito,

            })



        } catch (error) {
            logger.info("Error al obtener distritos", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    getByGroup = async (req, res) => {
        const id_grupo = req.params.id
        try {
            let ciudades = await this.region_grupo.getCityByGroup(id_grupo)

            res.status(200).json({
                ciudades: ciudades,

            })



        } catch (error) {
            logger.info("Error al obtener ciudades", error)
            res.status(400).json({
                msg: error,
            });
        }
    }


}



module.exports = RegionesController;
