const ServiceSQL = require("../../services/services");
const { getDataSistema } = require("../../helpers/db");
const logger = require("../../helpers/logger");

const bcrypt = require('bcrypt');
const { createSubDomain } = require('../../helpers/subdomains');

class EmpresasController {
  constructor() {
    this.empresas = new ServiceSQL("empresas_marketplace");

    this.modulos = new ServiceSQL("modulos");
    this.modulos_categorias = new ServiceSQL("modulos_categorias");
    this.modulos_habilitados = new ServiceSQL("modulos_habilitado");
    this.modulos_grupos = new ServiceSQL("modulos_grupo");
    this.categoriasEmpresa = new ServiceSQL("empresas_categorias");
  }

  obtenerEmpresas = async (req, res) => {
    await this.empresas
      .checkExist()

      .then(async () => {
        const role = req.session.rol_id
        let dataSession = req.session;
        let dataSistema = await getDataSistema(0);
        const empresas = await this.empresas.getCompanyAndModules();
        const modulo_grupo = await this.modulos_grupos.getNameModulesAll();


        const modulos_categorias = await this.modulos_categorias.getAll();

        if (role == 1 || role == 2) {
          res.render("modulo-superadmin/empresas/admin-empresas", {
            empresas,
            dataSession,
            dataSistema,
            modulos_categorias,
            modulo_grupo
          });
        } else {

          res.status(403);
          res.render('403');
        }



      })

      .catch((error) => {
        logger.error("Error al guardar obtener empresas: ", error);
        res.status(400).json({
          ok: false,
          msg: error,
        });
      });
  };
  obtenerEmpresasPorId = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await this.empresas.getById(id);
      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      logger.error("Error al guardar obtener empresa por ID: ", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };
  actualizarEmpresa = async (req, res) => {
    const id = req.params.id;

    try {
      const result = await this.empresas.updateById(id, req.body);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Error al guardar actualizar empresa:  ", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };

  guardarEmpresa = async (req, res) => {
    try {
      let email_corporativo = req.body.email_corporativo

      const user = await this.empresas.mostrarEmail(email_corporativo);

      if (user.length) {

        res.status(409).json({
          ok: false,
          msg: "Usuario existente"
        })
      } else {

        let password = bcrypt.hashSync(
          req.body.contrasena,
          bcrypt.genSaltSync(5),
          null
        );
        req.body.contrasena = password
        console.log(process.env.ALLOW_SUBDOMAINS);
        let slug = req.body.nombre.replace(/\s/g, "-").toLowerCase();

        const empresas_slug = await this.empresas.getTable().where('slug', slug).select(['id', 'slug']);

        if (Array.isArray(empresas_slug) && empresas_slug.length > 0) {
          slug = slug + "-" + empresas_slug.length;
        }
        allData.slug = slug;

        if (process.env.ALLOW_SUBDOMAINS == 'true') {
          console.log("Se creo el subdominio");
          // createSubDomain(slug)
        } else {
          console.log("No se creo el subdominio");
        }

        const result = await this.empresas.save(req.body);

        return res.status(200).json({
          ok: true,
          result,
        });
      }
    } catch (error) {
      logger.error("Error al guardar empresa: ", error);

      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };
  obtenerCategoriasRegistro = async (req, res) => {
    try {
      const categoriasRegistradas = await this.categoriasEmpresa.getAll();
      res.status(200).json({
        categorias: categoriasRegistradas
      })
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }

  }
  borrarEmpresa = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await this.empresas.deleteById(id);
      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      logger.error("Error al borrar empresa: ", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };

  guardarEmpresaCategoria = async (req, res) => {
    try {
      const checkIdGrupo = await this.modulos_habilitados.checkExistModuleGroup(req.body.empresa_id);

      if (checkIdGrupo.length) {


        const group_id = checkIdGrupo[0].id_grupo


        await this.modulos_grupos.deleteByGroup(group_id).then(() => {


          req.body.modulos.map(async (modulo) => {
            await this.modulos_grupos.save({ modulos: modulo, id_grupo: group_id });

          })

        })

      } else {

        const checkLastGroup = await this.modulos_grupos.checkLastNumber()
        const nuevoNumero = checkLastGroup[0].id_grupo + 1

        req.body.modulos.map(async (modulo) => {
          await this.modulos_grupos.save({ modulos: modulo, id_grupo: nuevoNumero });

        })

        await this.modulos_habilitados.save({ empresa_id: req.body.empresa_id, id_grupo: nuevoNumero });



      }
      return res.status(200).json({
        ok: true,

      });
    } catch (error) {
      logger.error("Error al guardar categoria: ", error);

      res.status(500).json({
        ok: false,
        msg: error,
      });
    }
  };


  obtenerCategorias = async (req, res) => {
    const empresa_id = req.params.id
    let result
    try {
      const checkIdGrupo = await this.modulos_habilitados.checkExistModuleGroup(empresa_id);

      if (checkIdGrupo.length) {

        const group_id = checkIdGrupo[0].id_grupo
        const modulo_grupo = await this.modulos_grupos.getNameModulesCompany(group_id);

        result = modulo_grupo.map(a => a.id)
      } else {
        result = []
      }

      res.status(200).json({
        categorias: result
      })
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }


  }

  eliminarEmpresaCategoria = async (req, res) => {
    const id = req.params.id;

    try {
      await this.categoriasEmpresa
        .deleteById(id)
        .then(async () => {
          res.status(200).json({ success: "ok" });
        })
        .catch((err) => res.status(400).json({ err: err }));
    } catch (error) {
      logger.error("Error en borrar categoria de empresas", error);
      res.status(400);
    }
  };
}
module.exports = EmpresasController;
