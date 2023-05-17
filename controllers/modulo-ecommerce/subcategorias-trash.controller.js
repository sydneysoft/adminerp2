const ServiceSQL = require("../../services/services");
const { getDataSistema } = require('../../helpers/db');
const logger = require("../../helpers/logger");
class SubCategoriasController {
    constructor() {

        this.categorias = new ServiceSQL("categorias");
        this.subcategorias = new ServiceSQL("subcategorias");
        this.empresas_marketplace = new ServiceSQL("empresas_marketplace");
        this.marketplace = new ServiceSQL("marketplace");
        this.subcategorias_opciones = new ServiceSQL("subcategorias_opciones");

    }
    adminSubCategorias = async (req, res) => {

        try {
            const role = req.session.rol_id
            const token = req.session.token;

            const dataSession = req.session;
            const dataSistema = await getDataSistema(req.session.token)
            let empresa
            let bookStore
            let activo_marketplace
            let marketplace
            let categorias


            if (role == 1 || role == 2) {


                bookStore = await this.subcategorias.getAll()
                categorias = await this.categorias.getAll()
                empresa = await this.empresas_marketplace.getAll();

                activo_marketplace = await this.marketplace.getById(1)

                marketplace = activo_marketplace[0].habilitado

            } else if (role == 3) {


                bookStore = await this.subcategorias.getbyCompany(token)
                categorias = await this.categorias.getbyCompany(token)

                empresa = await this.empresas_marketplace.getById(token);
            }
            if (role == 3 || role == 2 || role == 1) {
                res.render("modulo-ecommerce/subcategorias/admin-subcategorias", {
                    bookStore,
                    dataSession,
                    dataSistema,
                    empresa,
                    categorias,
                    marketplace,
                    token
                });
            } else {

                res.status(403);
                res.render('403');
            }

        } catch (error) {
            logger.error("Error al mostrar subcategorias", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    saveSubcategorias = async (req, res) => {
        try {
            const role = req.session.rol_id
            const token = req.session.token;
            let result

            if (req.body.id) {
                result = await this.subcategorias.updateById(req.body.id, req.body)
                res.status(200).json({ status: "success" });
            } else {
                if (role == 1 || role == 2) {
                    req.body.empresa_id = 0
                }
                let checkExist = await this.subcategorias.checkExistCompanyAndName(req.body.empresa_id, req.body.nombre)

                if (!checkExist.length) {
                    result = await this.subcategorias.save(req.body)
                    res.status(200).json({ status: "success" });
                } else {
                    res.status(409).json({ error: "La subcategoria ya existe" });
                }
            }


        } catch (error) {
            logger.error("Error al guardar subcategoria", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
    deleteById = async (req, res) => {
        const id = req.params.id;
        const token = req.session.token;

        try {

            await this.subcategorias.deleteById(id);
            return res.status(200).json({
                status: "success"
            });

        } catch (error) {
            logger.error("Error al borrar por id en subcategorias: ", error);
            res.status(400).json({
                ok: false,
                msg: error,
            });
        }
    };

    postFiltros = async (req, res) => {
        let arrayPost = req.body.valuesPost;
        let arrayEdit = req.body.valuesEdit;
        let arrayDelete = req.body.valuesDelete;

        try {
            if (arrayPost) {
                if (arrayPost.length > 0) {

                    arrayPost.map(async (item) => {
                        await this.subcategorias_opciones.save({ subcategoria: item[0], nombre: item[1] })

                    })

                }
            }


            if (arrayEdit) {
                if (arrayEdit.length > 0) {


                    // arrayEdit.map(async (item) => {
                    //    let body= { subcategoria: item[0], nombre: item[1] }
                    //     await this.subcategorias_opciones.updateByIdAndName({ id: item[0], nombre: item[1], body })

                    // })
                    // let queryEdit =
                    //     "INSERT INTO subcategorias_opciones (id,nombre) VALUES ? ON DUPLICATE KEY UPDATE nombre=VALUES(nombre)";
                    // await db.query(con, queryEdit, [arrayEdit]);
                }
            }

            if (arrayDelete) {
                if (arrayDelete.length > 0) {

                    await this.subcategorias.deleteById(arrayDelete)
                    for (let index = 0; index < arrayDelete.length; index++) {

                        await this.subcategorias_opciones.deleteById(arrayDelete[index])
                    }


                    // let queryDelete = "DELETE FROM subcategorias_opciones WHERE id in (?)";
                    // await db.query(con, queryDelete, [arrayDelete]);
                }
            }

            res.json({
                status: "success",
                msg: "Los Valores fueron Agregados Correctamente",
            });
        } catch (e) {
            logger.error("Error al agregar filtros en subcategorias", e)
            res.json({
                status: "error",
                msg: "Error al agregar los valores del filtro",
            });
        }
    }

}

module.exports = SubCategoriasController;
