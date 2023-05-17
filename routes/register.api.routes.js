const { Router } = require("express");
const router = Router()

const bcrypt = require('bcrypt');

const { createSubDomain } = require('../helpers/subdomains');

const { catchError, getAllDataSession, notAuthorize } = require('../helpers/modulo-tv/basicrequest.helpers');
const { body, matchedData, oneOf, param, check } = require('express-validator');
const { EVResult } = require('../middlewares/EVResult.middleware');

const { UsuariosController } = require('../controllers/modulo-usuarios/usuarios.controller');
const { EmpresaRegistradaCategoriaController } = require('../controllers/modulo-marketplace/empresas-registradas-categorias.controller');
const { EmpresaMarketplaceController } = require('../controllers/modulo-marketplace/empresas-marketplace.controller');
const { EmpresaUsuarioController } = require('../controllers/modulo-marketplace/empresa-usuarios.controller');
const { MarketplaceCategoriaController } = require("../controllers/modulo-tv/modulo-marketplace-categorias/marketplace-categorias.controller");

const { service: UsuarioService } = UsuariosController;
const { service: EmpresaRegistradaCategoriaService } = EmpresaRegistradaCategoriaController;
const { service: EmpresaMarketplaceService } = EmpresaMarketplaceController;
const { service: EmpresaUsuarioService } = EmpresaUsuarioController;
const { service: MarketplaceCategoriaService } = MarketplaceCategoriaController;

const { slugify } = require("../helpers/slug");

/**
 * @caeher
 * Ruta para registrar usuarios 
 */
router.post('/user',
  check('nombre').isString(),
  check('clave').isString(),
  check('correo').isEmail(),
  check('tipo_documento').isString(),
  check('numero_documento').isString()
  , EVResult, async (req, res) => {
    try {
      
      const allData = matchedData(req);

      const usuario_email = allData.correo
      const check = await UsuarioService.checkExistUser(usuario_email);

      if (check.length) {
          return res.status(400).json({
              usuario_existente: true,
          });
      } else {

          // Porque verifica si existe la tabla empresas_registradas_categorias
          await EmpresaRegistradaCategoriaService.checkExist().then(async () => {
              let password = bcrypt.hashSync(
                  allData.clave,
                  bcrypt.genSaltSync(5),
                  null
              );
              allData.clave = password
              allData.rol_id = 3;
              const result = await UsuarioService.save(allData);
              return res.status(200).json({
                  ok: true,
                  id: result[0],
              });
          });
      }
      
    } catch (error) {
      return catchError(res, error);
    }
  });

/**
 * @caeher
 * Luego revisar esta ruta porque si se envian empresa_id y usuario_id se crea el registro en la tabla empresas_registradas_categorias
 */
router.post('/company-category',
  check('empresa_id').isNumeric(),
  check('categoria').isString(),
  EVResult, async (req, res) => {
    try {
      await EmpresaRegistradaCategoriaService.checkExist().then(async () => {
          const result = await EmpresaRegistradaCategoriaService.save(req.body);
          return res.status(200).json({
              ok: true,
              id: result[0],
          });
      });

    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  });

router.post('/company-user',
  check('empresa_id').isNumeric(),
  check('usuario_id').isNumeric(),
  EVResult, async (req, res) => {
    try {
      await EmpresaUsuarioService.checkExist().then(async () => {
          const allData = matchedData(req);
          const result = await EmpresaUsuarioService.save(allData);
          return res.status(200).json({
              ok: true,
              id: result[0],
          });
      });

    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  })

/**
 * @caeher
 * Crea el registro en la tabla empresas_marketplace
 */
router.post('/company',
  check('nombre').isString(),
  check('email_corporativo').isEmail(),
  check('nombre_contacto').isString(),
  check('celular_contacto').isString(),
  check('plan').isNumeric(),
  check('categoria_id').isNumeric(),
  EVResult, async (req, res) => {
    try {
      await EmpresaMarketplaceService.checkExist().then(async () => {
        const allData = matchedData(req);

        let slug = slugify(allData.nombre);

        const empresas_slug = await EmpresaMarketplaceService.getTable().whereLike('slug', `%${slug}%`).select(['id', 'slug']);

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

        const lastEmpresa = await EmpresaMarketplaceService.getTable().orderBy('id', 'desc').limit(1);
        let lastPort = 0;
        let port = 3000;
        if (Array.isArray(lastEmpresa) && lastEmpresa.length > 0) {
          lastPort = lastEmpresa[0].port;
        }
        if (lastPort > 0) {
          port = port + (lastPort - port) + 1;
        }
        allData.port = port;
        const result = await EmpresaMarketplaceService.save(allData);


        if (process.env.ALLOW_SUBDOMAINS == 'true') {

          const empresa = await EmpresaMarketplaceService.getById(result[0]);
          const categoria = await MarketplaceCategoriaService.getById(empresa[0].categoria_id);
          if (categoria.length > 0 && categoria[0].repository != "") {

            console.log("Se creo el subdominio");
            createSubDomain(slug, port, categoria[0].repository, result[0], 'secretInka');
          } else {
            console.log("No se pudo crear el subdominio");
          }
        } else {
          console.log("No se creo el subdominio");
        }

        return res.status(200).json({
          ok: true,
          id: result[0],
        });
      });

    } catch (error) {
      return catchError(res, error);
    }
  })
module.exports = router;
