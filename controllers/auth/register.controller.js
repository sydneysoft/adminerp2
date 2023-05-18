const RestBuilder = require('../builder-test.controller')
const { matchedData } = require("express-validator");

const bcrypt = require('bcrypt');
const { createSubDomain } = require('../../helpers/subdomains');
const { slugify } = require("../../helpers/slug");

class AuthController extends RestBuilder {
  constructor() {
    super()
    this.setTable('usuarios').setName('Tratamiento')
      .setTimeStamps();

    this.marketplace_categorias = this.setService("marketplace_categorias");
    this.empresas_usuarios = this.setService("empresas_usuarios");
    this.empresas_marketplace = this.setService("empresas_marketplace");
    this.empresas_registradas_categorias = this.setService("empresas_registradas_categorias");
    // usuarios
  }


  apiPostRegister = async (req, res) => {
    const bodyData = matchedData(req, { locations: ['body'] });
   
    try {

      const check_usuario = await this.service.checkExistUser(bodyData.correo);


      // Registrar usuario
      if (Array.isArray(check_usuario) && check_usuario.length > 0) {
        return res.status(400).json({
          usuario_existente: true,
        });

      } else {
        const password = bcrypt.hashSync(
          bodyData.clave,
          bcrypt.genSaltSync(5),
          null
        );

        const data_usuario = {
          clave: password,
          correo: bodyData.correo,
          nombre: bodyData.nombre,
          tipo_documento: bodyData.tipo_documento,
          numero_documento: bodyData.numero_documento,
        }

        const usuario_result = await this.service.save(data_usuario);


        // Proceso de Registrar compania

        const data_empresa = {};

        let slug = slugify(bodyData.company_name);

        const empresas_slug = await this.empresas_marketplace.getTable().whereLike('slug', `%${slug}%`).select(['id', 'slug']);

        if (Array.isArray(empresas_slug) && empresas_slug.length > 0) {
          let counter = 0;
          const empresas_count = empresas_slug.length;
          for (let i = 0; i < empresas_count; i++) {
            let regex = new RegExp(`^${slug}-?([0-9]?)+$`);
            if (regex.test(empresas_slug[i].slug)) {
              // Falta comprobar en caso que se haya eliminado una empresa con numeracicon intermedia
              // let empresa_split = empresas_slug[i].slug.split('-');
              // let last_number = empresa_split[empresa_split.length - 1];
              // if (last_number > counter) {
              //   counter = last_number;
              // }
              counter++;
            }

          }
          slug = slug + "-" + counter;
        }

        // Seleccionar la empresa registrada anteriormente
        const last_company = await this.empresas_marketplace.getTable().orderBy('id', 'desc').limit(1);
        let last_port = 0;
        let port = 3000;
        if (Array.isArray(last_company) && last_company.length > 0) {
          last_port = last_company[0].port;
        }
        if (last_port > 0) {
          port = port + (last_port - port) + 1;
        }
        data_empresa.port = port;

        data_empresa.nombre = bodyData.company_name;
        // data_empresa.slug = slug;
        data_empresa.categoria_id = bodyData.categoria_id;
        data_empresa.plan = bodyData.plan;
        data_empresa.email_corporativo = bodyData.correo;
        data_empresa.nombre_contacto = bodyData.nombre;
        data_empresa.celular_contacto = bodyData.celular_contacto;

        const empresa_result = await this.empresas_marketplace.save(data_empresa);

        // Registro de subdominio
        if (process.env.ALLOW_SUBDOMAINS == 'true') {
          const empresa = await this.empresas_marketplace.getById(empresa_result[0]);
          const categoria = await this.marketplace_categorias.getById(empresa[0].categoria_id);
          if (categoria.length > 0 && categoria[0].repository != "") {
            createSubDomain(slug, port, categoria[0].repository, result[0], 'secretInka');
            console.log("Se creo el subdominio");
          } else {
            console.log("No se pudo crear el subdominio");
          }
        } else {
          console.log("No se creo el subdominio");
        }


        // Registrar relacion empresa usuario
        const empresa_usuario = await this.empresas_usuarios.save({
          empresa_id: empresa_result[0],
          usuario_id: usuario_result[0],
        });


        // Registrar relacion categoria empresa
        const empresa_categoria = await this.empresas_registradas_categorias.save({
          empresa_id: empresa_result[0],
          categoria: bodyData.categoria_id,
        });

        console.log("Usuario: ", usuario_result);
        console.log("Empresa: ", empresa_result);
        console.log("Empresa Usuario: ", empresa_usuario);
        console.log("Empresa Categoria: ", empresa_categoria);


        return res.status(200).json({
          ok: true,
          usuario_id: usuario_result[0],
          empresa_id: empresa_result[0],
        });

      }


    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
}



module.exports = { AuthController }