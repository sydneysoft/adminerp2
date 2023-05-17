const RestBuilder = require('../builder-test.controller')
const bcrypt = require('bcrypt');
const { slugify } = require("../../helpers/slug");
const { createSubDomain } = require('../../helpers/subdomains');
const { SendEmail } = require("../../helpers/sendEmail.helpers");

const { matchedData } = require("express-validator");

class RegistroController extends RestBuilder {
    constructor() {
        super()
        this.setTable('usuarios').setName('Usuario').setPagination()
            .setTimeStamps();
        this.empresas_categorias = this.setService("empresas_categorias");
        this.empresas_registradas_categorias = this.setService("empresas_registradas_categorias");
        this.empresas_marketplace = this.setService("empresas_marketplace");
        this.planes_landing = this.setService("planes_landing");
        this.empresas_usuarios = this.setService("empresas_usuarios");
        this.configuracion_correos = this.setService("configuracion_correos");
        this.marketplace_categorias = this.setService("marketplace_categorias");
        this.producto_paquetes = this.setService("producto_paquetes");
    }

    renderRegistro = async (req, res) => {
        try {
            const planes = await this.planes_landing.getAll();
            const paquetes = await this.producto_paquetes.getbyCompany(0);
            if (Array.isArray(paquetes) && paquetes.length > 0) {
                for (let i = 0; i < paquetes.length; i++) {
                    if (typeof paquetes[i].caracteristicas == 'string') {
                        paquetes[i].caracteristicas = JSON.parse(paquetes[i].caracteristicas);
                    }
                }
            }
            return res.render("modulo-usuarios/registro/pagina-registro", {
                paquetes
            });
        } catch (error) {
            return this.errorHandler(error, req, res);
        }
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    renderMembresia = async (req, res) => {
        try {
            const paramsData = matchedData(req, { locations: ['params'] });
            const id = paramsData.id;

            // const plan = await this.planes_landing.getById(id);
            const plan = await this.producto_paquetes.getTable().where({
                id,
                empresa_id: 0
            });
            if (Array.isArray(plan) && plan.length == 0) {
                res.status(404);
                throw new Error("No se encontró el plan");
            }

            const categorias = await this.empresas_categorias.getCategoriesRegister();
            const marketplaces = await this.marketplace_categorias.getTable().select('id', 'nombre').orderBy('nombre', 'asc');
            return this.renderView(res, "modulo-usuarios/registro/pagina-membresia", { categorias, plan: plan[0], marketplaces });

        } catch (error) {
            return this.errorHandler(error, req, res);
        }
    }



    apiSave = async (req, res) => {
        try {
            const bodyData = matchedData(req, { locations: ['body'] });
            const usuario_email = bodyData.correo;
            const check = await this.service.checkExistUser(usuario_email);

            if (Array.isArray(check) && check.length > 0) {
                return this.successHandler({ usuario_existente: true }, res, "El usuario ya existe", 400);
            } else {
                await this.empresas_categorias.checkExist().then(async () => {

                    let password = bcrypt.hashSync(
                        bodyData.clave,
                        bcrypt.genSaltSync(5),
                        null
                    );
                    bodyData.clave = password
                    bodyData.rol_id = 3; // asigna el rol de empresa

                    const result = await this.service.save(bodyData);

                    return this.successHandler({
                        ok: true,
                        id: result[0],
                    }, res, "Usuario registrado correctamente", 200);

                });
            }

        } catch (error) {
            return this.errorHandler(error, req, res, false);
        }
    };

    apiSaveCategoria = async (req, res) => {
        try {

            const bodyData = matchedData(req, { locations: ['body'] });

            await this.empresas_registradas_categorias.checkExist().then(async () => {
                const result = await this.empresas_registradas_categorias.save(bodyData);
                return this.successHandler({
                    ok: true,
                    id: result[0],
                }, res, "Categoría registrada correctamente", 200);
            }).catch(async (error) => {
                await this.service.deleteBy().where("id", bodyData.empresa_id); // En caso de que falle al crear la categoria borrar el usuario
    
                res.status(400);
                throw new Error("No se pudo registrar la categoría");
            });


        } catch (error) {
            return this.errorHandler(error, req, res, false);
        }
    }

    apiSaveCompanyUsuario = async (req, res) => {
        try {
            const bodyData = matchedData(req, { locations: ['body'] });
            await this.empresas_usuarios.checkExist().then(async () => {
                const result = await this.empresas_usuarios.save(bodyData);
                const correo = await this.configuracion_correos.getbyCompany(0);

                // Enviar correo de registro
                if (Array.isArray(correo) && correo.length > 0) {
                    const usuario = await this.service.getTable().where("id", bodyData.usuario_id).select([
                        "correo", "nombre", "direccion", "celular"
                    ]);
                    const empresa = await this.empresas_marketplace.getTable().where("id", bodyData.empresa_id).select([
                        "nombre", "slug", "email_corporativo", "email_contacto"
                    ]);

                    const nuevoEmail = new SendEmail({
                        usuario,
                        empresa,
                        email: usuario[0].correo
                    }, correo[0]);

                    await nuevoEmail.sendEmailRegistro();
                }


                return this.successHandler({
                    ok: true,
                    id: result[0],
                }, res, "Empresa registrada correctamente", 200);
            });
        } catch (error) {
            return this.errorHandler(error, req, res, false);
        }
    }

    apiSaveAsCompany = async (req, res) => {
        try {
            const bodyData = matchedData(req, { locations: ['body'] });
            
            const allData = matchedData(req);
            let slug = slugify(allData.nombre);


            await this.empresas_marketplace.checkExist().then(async () => {

                const empresas_slug = await this.empresas_marketplace.getTable().whereLike('slug', `%${slug}%`).select(['id', 'slug']);
                // ----------------- Validar si existe el slug -----------------
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
                allData.slug = slug;

                const lastEmpresa = await this.empresas_marketplace.getTable().orderBy('id', 'desc').limit(1);
                let lastPort = 0;
                let port = 3000;
                if (Array.isArray(lastEmpresa) && lastEmpresa.length > 0) {
                    lastPort = lastEmpresa[0].port;
                }
                if (lastPort > 0) {
                    port = port + (lastPort - port) + 1;
                }
                allData.port = port;
                const result = await this.empresas_marketplace.save(allData);

                // Crear subdominio
                if (process.env.ALLOW_SUBDOMAINS == 'true') {
                    const empresa = await this.empresas_marketplace.getById(result[0]);
                    const categoria = await this.marketplace_categorias.getById(empresa[0].categoria_id);
                    if (categoria.length > 0 && categoria[0].repository != "") {
                        createSubDomain(slug, port, categoria[0].repository, result[0], 'secretInka');
                    } else {
                        console.log("No se pudo crear el subdominio");
                    }
                } else {
                    console.log("No esta habilitado la creacion de subdominios");
                }

                // const result = await this.empresas_marketplace.save(bodyData);
                return this.successHandler({
                    ok: true,
                    id: result[0],
                }, res, "Empresa registrada correctamente", 200);
            });

        } catch (error) {
            return this.errorHandler(error, req, res, false);
        }
    }

}



module.exports = { RegistroController }