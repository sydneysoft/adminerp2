const { Router } = require("express"), router = Router();
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { isAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');

const ServiceSQL = require('../../../services/services');
const empresaService = new ServiceSQL('usuarios');
const {CategoriaController} = require('../../../controllers/modulo-tv/modulo-blog/blog.controller');

const { body, validationResult } = require('express-validator');

const { service: categoriaService } = CategoriaController;

router.delete('/:id', CategoriaController.delete)

// Metodo unico para la categoria, donde se comprueba que solo exista una categoria para cada empresa_id
router.post('/', body('nombre').isLength({ min: 3 }).withMessage('El campo nombre debe ser de 3 o más caracteres.') , async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let empresa_id = 0;
    const { role, token } = await getAllDataSession(req);

    if(role == 1 || role == 2) {
      empresa_id = req.body.empresa_id || 0;
    } else if (role == 3) {
      empresa_id = token || 0;
    } else {
      return res.status(401).json({
        ok: false,
        msg: 'No esta autorizado para esta acción.'
      })
    }
    
    const date = new Date();
    const nombre = req.body.nombre;

    const categoriaData = await categoriaService.getByColumn({ column: 'empresa_id', value: empresa_id}).andWhere('nombre', nombre);
    if (categoriaData.length == 0) {
      const nuevaCategoria = await categoriaService.save({
        nombre,
        descripcion: req.body.descripcion || '',
        imagen: req.body.imagen || '',
        empresa_id,
        created_at: date,
        updated_at: date
      })
  
      if(nuevaCategoria > 0) {
        return res.json({
          ok: true,
          msg: 'Categoria creada correctamente.',
          id: nuevaCategoria
        })
      } else {
        throw Error({message: 'No se pudo crear la categoria.'});
      }
    } else {
      return res.status(400).json({
        ok: false,
        msg: 'Esta categoria ya existe.'
      })
    }
  } catch (error) {
    return catchError(res, error);
  }
});

router.put('/:id', body('nombre').isLength({ min: 3 }).withMessage('El campo nombre debe ser de 3 o más caracteres.'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let empresa_id = 0;
    const { role, token } = await getAllDataSession(req);
    if(role == 1 || role == 2) {
      empresa_id = req.body.empresa_id || 0;
    } else if (role == 3) {
      empresa_id = token || 0;
    } else {
      return res.status(401).json({
        ok: false,
        msg: 'No esta autorizado para esta acción.'
      })
    }
    
    const date = new Date();
    const nombre = req.body.nombre;

    const id = req.params.id;
    const categoriaData = await categoriaService.getByColumn({ column: 'empresa_id', value: empresa_id})
      .andWhere('nombre', nombre).andWhere('id','<>', id);

    if (categoriaData.length == 0) {
      const nuevaCategoria = await categoriaService.updateById(id, {
        nombre,
        descripcion: req.body.descripcion || '',
        imagen: req.body.imagen || '',
        empresa_id,
        updated_at: date
      })
  
      if(nuevaCategoria > 0) {
        return res.json({
          ok: true,
          msg: 'Categoria actualizada correctamente.'
        })
      } else {
        throw Error({message: 'No se pudo actualizar la categoria.'});
      }
    } else {
      return res.status(400).json({
        ok: false,
        msg: 'Esta categoria ya existe.'
      })
    }
  } catch (error) {
    return catchError(res, error);
  }
})



router.get('/', async (req, res) => {
  try {
    let empresas = [];
    let data = [];
    const { role, dataSession, dataSistema, token } = await getAllDataSession(req);
    
    if(role == 1 || role == 2) {
      return res.render('modulo-tv/modulo-blog/categoria/superadmin', {
        dataSession,
        dataSistema
      });
    } else if(role == 3) {
      data = await categoriaService.getbyCompany(token);
    }

    return res.render('modulo-tv/modulo-blog/categoria/usuario', {
      dataSession,
      dataSistema,
      empresas,
      data
    })

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/empresa/:id', isAdminMiddleware, async (req, res) => {
  try {
    const {  dataSession, dataSistema } = await getAllDataSession(req);
    const id = req.params.id; 
    
    const data = await categoriaService.getbyCompany(id);
    
    return res.render('modulo-tv/modulo-blog/categoria/admin-usuario', {
      dataSession, 
      dataSistema,
      data,
      empresa_id: id
    });

  } catch (error) {
    return catchError(res, error);
  }
});

/**
 * La siguiente ruta permite obtener todas las categorias por usuario
 */
router.get('/get/:empresa_id', async (req, res) => {
  try {
    const { role } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      const empresa_id = req.params.empresa_id;
      const data = await categoriaService.getbyCompany(empresa_id);
      return res.json({
        ok: true,
        data
      })
    } else {
      return res.status(400).json({
        ok: false,
        msg: 'No tiene permitido esta acción'
      })
    }
  } catch (error) {
    return catchError(req, error);
  }
});

module.exports = router
