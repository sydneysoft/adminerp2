// const RestBuilder = require('../builder.controller');

// const EmpresaMarketplaceBuilder = new RestBuilder();

// const EmpresaMarketplaceController = EmpresaMarketplaceBuilder.setTable('empresas_marketplace').setName('Empresa Marketplace')
//   .setTimeStamps();

// module.exports = {EmpresaMarketplaceController}

const RestBuilder = require('../builder-test.controller')
const bcrypt = require('bcrypt');
const { slugify } = require("../../helpers/slug");
const { createSubDomain } = require('../../helpers/subdomains');
const { SendEmail } = require("../../helpers/sendEmail.helpers");

const { matchedData } = require("express-validator");

class EmpresaMarketplaceController extends RestBuilder {
  constructor() {
    super()
    this.setTable('empresas_marketplace').setName('Empresa Marketplace').setPagination()
      .setTimeStamps().notCompany();
    this.modulos_categorias = this.setService("modulos_categorias");
    this.modulos_grupo = this.setService("modulos_grupo");
    this.modulos_habilitado = this.setService("modulos_habilitado");
    this.empresas_categorias = this.setService("empresas_categorias");
    this.usuarios = this.setService("usuarios");
    this.empresas_usuarios = this.setService("empresas_usuarios");
    this.configuracion_correos = this.setService("configuracion_correos");
  }

  renderHome = async (req, res) => {
    try {
      let { role, token, dataSession, dataSistema } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        const modulo_grupo = await this.modulos_grupo.getNameModulesAll();
        const modulos_categorias = await this.modulos_categorias.getAll();

        return this.renderView(res, "modulo-superadmin/empresas/admin-empresas", {
          dataSession,
          dataSistema,
          modulos_categorias,
          modulo_grupo
        })

      } else {
        res.status(403);
        throw new Error("No tienes permisos para acceder a esta sección");
      }

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  apiModulosHabilitados = async (req, res) => {
    try {
      const paramsData = matchedData(req, { locations: ['params'] });
      if (isNaN(paramsData.empresa_id)) {
        throw new Error("El id de la empresa debe ser un número");
      }
      const result = await this.modulos_habilitado.getbyCompany(paramsData.empresa_id);
      return res.json(result);
    } catch (error) {
      return this.errorHandler(error, req, res, false);
    }
  }

  apiSave = async (req, res) => {
    try {
      const bodyData = matchedData(req, { locations: ['body'] });

      const empresa = await this.service.mostrarEmail(bodyData.email_corporativo);

      if (Array.isArray(empresa) && empresa.length > 0) {
        return res.status(409).json({
          ok: false,
          msg: "Usuario existente"
        });
      } else {
        const datos_usuarios = {
          nombre: bodyData.nombre_contacto,
          correo: bodyData.email_corporativo,
          celular: bodyData.celular_contacto,
          clave: bodyData.contrasena,
          direccion: bodyData.direccion,
        }
        console.log(datos_usuarios);
        delete bodyData.contrasena;

        if (datos_usuarios.clave && datos_usuarios.clave != "") {
          datos_usuarios.clave = bcrypt.hashSync(
            datos_usuarios.clave,
            bcrypt.genSaltSync(5),
            null
          );
        }

        let slug = slugify(bodyData.nombre);

        // Si el slug del nombre de la empresa ya existe, se le agrega un numero al final
        const empresas_slug = await this.service.getTable().whereLike('slug', `%${slug}%`).select(['id', 'slug']);
        if (Array.isArray(empresas_slug) && empresas_slug.length > 0) {
          let counter = 0;
          empresas_slug.forEach((empresa) => {
            let regex = new RegExp(`^${slug}-?([0-9]?)+$`);
            if (regex.test(empresa.slug)) {
              counter++;
            }
          });
          slug = slug + "-" + counter;
        }

        bodyData.slug = slug;

        if (process.env.ALLOW_SUBDOMAINS == 'true') {
          console.log("Se creo el subdominio");
          createSubDomain(slug)
        } else {
          console.log("No se creo el subdominio");
        }

        const empresa = await this.service.save(bodyData); // se crea la empresa
        const usuario = await this.usuarios.save(datos_usuarios); // se crea el usuario 

        await this.empresas_usuarios.save({
          empresa_id: empresa[0],
          usuario_id: usuario[0],
        });

        const correo = await this.configuracion_correos.getbyCompany(0);
        // Enviar correo de registro
        if (Array.isArray(correo) && correo.length > 0) {
          const nuevoUsuario = await this.usuarios.getTable().where("id", usuario[0]).select([
            "correo", "nombre", "direccion", "celular"
          ]);
          const nuevoEmpresa = await this.service.getTable().where("id", empresa[0]).select([
            "nombre", "slug", "email_corporativo", "email_contacto"
          ]);

          const nuevoEmail = new SendEmail({
            usuario: nuevoUsuario,
            empresa: nuevoEmpresa,
            email: nuevoUsuario[0].correo
          }, correo[0]);

          await nuevoEmail.sendEmailRegistro();
        }


        return res.status(200).json({
          ok: true,
          result: empresa,
        });
      }

    } catch (error) {
      return this.errorHandler(error, req, res, false);
    }
  }

  apiSaveCategoria = async (req, res) => {
    try {
      const bodyData = matchedData(req, { locations: ['body'] });
      const checkIdGrupo = await this.modulos_habilitado.checkExistModuleGroup(bodyData.empresa_id);

      if (Array.isArray(checkIdGrupo) && checkIdGrupo.length > 0) {
        const group_id = checkIdGrupo[0].id_grupo;
        // Elimina los modulos del grupo
        await this.modulos_grupo.deleteByGroup(group_id).then(() => {
          bodyData.modulos.map(async (modulo) => {
            await this.modulos_grupo.save({ modulos: modulo, id_grupo: group_id });
          });
        });
      } else {
        const checkLastGroup = await this.modulos_grupo.checkLastNumber();
        const nuevoNumero = checkLastGroup[0].id_grupo + 1;

        bodyData.modulos.map(async (modulo) => {
          await this.modulos_grupo.save({ modulos: modulo, id_grupo: nuevoNumero });
        });

        await this.modulos_habilitado.save({ empresa_id: bodyData.empresa_id, id_grupo: nuevoNumero });
      }

      return res.status(200).json({
        ok: true
      });

    } catch (error) {
      return this.errorHandler(error, req, res, false);
    }
  }

  apiGetCategoria = async (req, res) => {
    try {
      const paramsData = matchedData(req, { locations: ['params'] });
      const checkIdGrupo = await this.modulos_habilitado.checkExistModuleGroup(paramsData.id);
      if (checkIdGrupo.length) {

        const group_id = checkIdGrupo[0].id_grupo;
        const modulo_grupo = await this.modulos_grupo.getNameModulesCompany(group_id);

        return res.status(200).json({
          categorias: modulo_grupo.map(a => a.id)
        })
      }

      return res.status(200).json({
        categorias: []
      });

    } catch (error) {
      return this.errorHandler(error, req, res, false);
    }
  }

  apiDeleteCategoria = async (req, res) => {
    try {
      const paramsData = matchedData(req, { locations: ['params'] });
      await this.empresas_categorias.deleteById(paramsData.empresa_id).then(() => {
        return res.status(200).json({
          ok: true
        });
      }).catch((err) => {
        return res.status(400).json({
          ok: false,
          msg: err
        });
      });

    } catch (error) {
      return this.errorHandler(error, req, res, false);
    }
  }
}



module.exports = { EmpresaMarketplaceController }