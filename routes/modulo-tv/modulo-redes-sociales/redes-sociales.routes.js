const { Router } = require("express"), router = Router();
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const ServiceSQL = require('../../../services/services')
const { body, validationResult, oneOf, check } = require('express-validator'); 
const { RedController } = require('../../../controllers/modulo-tv/modulo-redes-sociales/redes-sociales.controller');
const { isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const { EVResult } = require("../../../middlewares/EVResult.middleware");

const { service: RedService } = RedController;
const UsuarioService = new ServiceSQL('usuarios');
const EmpresaService = new ServiceSQL('empresas_marketplace');
const UsuarioEmpresaService = new ServiceSQL('empresas_usuarios');

router.get('/items', RedController.index);

router.post('/items',
check('facebook').optional().isString().withMessage('El campo facebook debe ser un string'),
check('instagram').optional().isString().withMessage('El campo instagram debe ser un string'),
check('twitter').optional().isString().withMessage('El campo twitter debe ser un string'),
check('tiktok').optional().isString().withMessage('El campo tiktok debe ser un string'),
check('youtube').optional().isString().withMessage('El campo youtube debe ser un string'),
check('linkedin').optional().isString().withMessage('El campo linkedin debe ser un string'),
check('github').optional().isString().withMessage('El campo github debe ser un string'),
check('pinterest').optional().isString().withMessage('El campo pinterest debe ser un string'),
check('whatsapp').optional().isString().withMessage('El campo whatsapp debe ser un string'),
check('telegram').optional().isString().withMessage('El campo telegram debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, RedController.save);

router.get('/items/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, RedController.show);

router.put('/items/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
check('facebook').optional().isString().withMessage('El campo facebook debe ser un string'),
check('instagram').optional().isString().withMessage('El campo instagram debe ser un string'),
check('twitter').optional().isString().withMessage('El campo twitter debe ser un string'),
check('tiktok').optional().isString().withMessage('El campo tiktok debe ser un string'),
check('youtube').optional().isString().withMessage('El campo youtube debe ser un string'),
check('linkedin').optional().isString().withMessage('El campo linkedin debe ser un string'),
check('github').optional().isString().withMessage('El campo github debe ser un string'),
check('pinterest').optional().isString().withMessage('El campo pinterest debe ser un string'),
check('whatsapp').optional().isString().withMessage('El campo whatsapp debe ser un string'),
check('telegram').optional().isString().withMessage('El campo telegram debe ser un string'),
check('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un número'),
EVResult, RedController.update);

router.delete('/items/:id',
check('id').isNumeric().withMessage('El campo id debe ser un número'),
EVResult, RedController.delete)

router.get('/datatable', async (req, res) => {
  try {
    const { role } = await getAllDataSession(req);

    if (role === 1) {
      let datos = [];
      let empresas = [];
      datos = await UsuarioService.getTable().select(['id', 'nombre', 'correo']);
      empresas = await UsuarioEmpresaService.getAll();
      if (Array.isArray(datos)) {
        datos = datos.map((item) => {
          let usuario_empresa = empresas.find(empresa => empresa.usuario_id === item.id);
          if (usuario_empresa) {
            item.empresa = usuario_empresa.empresa_id;
          } else {
            item.empresa = undefined;
          }
          return item
        })
        for(let i = 0; i < datos.length; i++) {
          if (datos[i].empresa) {
            let empresa = await EmpresaService.getTable().select(['nombre', 'email_corporativo']).where('id', datos[i].empresa);
            datos[i].empresa = empresa.length === 1 ? empresa[0] : { nombre: 'No tiene empresa asignada', email_corporativo: 'No tiene empresa asignada' };
          } else {
            datos[i].empresa = {
              nombre: 'No tiene empresa asignada',
              email_corporativo: 'No tiene empresa asignada'
            };
          }
        }
      }

      res.json({
        ok: true,
        msg: 'Datos obtenidos correctamente.',
        data: datos
      })

    } else {
      res.status(403);
      return res.json({
        ok: false,
        msg: 'No tiene permisos para acceder a esta ruta.'
      });
    }

  } catch (error) {
    res.status(403);
    return res.json({
      ok: false,
      msg: 'No tiene permisos para acceder a esta ruta.'
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    
    let datos = [];

    if (role === 1 && role == 2) {
      return res.render('modulo-tv/modulo-redes-sociales/index', {
        dataSession,
        dataSistema
      });
    } else if (role === 3) {
      datos = await RedService.getbyCompany(token);
    }

    return res.render('modulo-tv/modulo-redes-sociales/usuario', {
      dataSession,
      dataSistema,
      data: datos.length > 0 ? datos[0] : null
    })

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', isAdminSuperAdminMiddleware, async(req, res) => {
  try {
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    const { id } = req.params;
    let datos = [];
    datos = await RedService.getbyCompany(id);

    res.render('modulo-tv/modulo-redes-sociales/empresa', {
      dataSession,
      dataSistema,
      empresa_id: id,
      data: datos.length === 1 ? datos[0] : null,
    })
  } catch (error) {
    return catchError(res, error);
  }
});

module.exports = router