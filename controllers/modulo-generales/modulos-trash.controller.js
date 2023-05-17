const logger = require("../../helpers/logger");
const ServiceSQL = require("../../services/services");


class ModulosController {
    constructor() {
        this.modulos = new ServiceSQL("modulos");
        this.empresas_usuarios = new ServiceSQL("empresas_usuarios");
        this.modulos_habilitado = new ServiceSQL("modulos_habilitado");
        this.modulos_grupos = new ServiceSQL("modulos_grupo");
    }


    getModulos = async (req, res) => {

        let id = req.params.id
        try {
            let result
            const role = req.session.rol_id

            if (role) {
                if (role == 1 || role == 2) {
                    result = await this.modulos.getAll()
                } else if (role == 3) {
                    const empresa = await this.empresas_usuarios.getCompany(req.session.usuario_id)
                    const empresa_id = empresa[0].empresa_id

                    const checkIdGrupo = await this.modulos_habilitado.checkExistModuleGroup(empresa_id);

                    if (checkIdGrupo.length) {
                        const group_id = checkIdGrupo[0].id_grupo
                        const modulo_grupo = await this.modulos_grupos.getIdModulesCompany(group_id);

                        const idsModulos = modulo_grupo.map(i => i.modulos)
                        const arrayData = await this.modulos.getModulesByCategories(idsModulos)

                        result = arrayData
                    }
                }
            }
            if (role == 1 || role == 2 || role == 3) {
                res.status(200).json({
                    status: "success",
                    modulos: result
                });

            } else {

                res.status(403);
                res.render('403');
            }

        } catch (error) {
            logger.error("error al obtener modulos", error)
            res.status(400).json({
                msg: error,
            });
        }
    }
}

module.exports = ModulosController