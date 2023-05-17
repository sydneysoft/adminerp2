const { Router } = require("express"), router = Router();
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const { isAdminMiddleware, isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');
const ServiceSQL = require('../../../services/services')
// const {RedesController} = require('../../controllers/modulo-ceredes/redes.controller');
const { PaginaController } = require('../../../controllers/modulo-tv/modulo-blog/paginas.controller');
const e = require("express");
const { service: paginaService } = PaginaController;

const empresaService = new ServiceSQL('usuarios');
const categoriable = new ServiceSQL('blog_categoriable');

// router.get('/redes/crear', RedesController.createView);
// router.get('/redes/:id', RedesController.showView);
// router.get('/redes/editar/:id', RedesController.editeView);
// router.get('/', PaginaController.indexView);

// router.get('/redess', RedesController.index);
// router.post('/redes', RedesController.save);
// router.get('/redes/:id', RedesController.show);

router.put('/pagina/:id', PaginaController.update);
router.delete('/pagina/:id', PaginaController.delete);

/**
 * Esta ruta actualiza la pagina a delete
 */
router.put('/delete/:id', async (req, res) => {
  try {
    const { token, role } = await getAllDataSession(req);
    const id = req.params.id;
    const pagina = await paginaService.getById(id);
    if (pagina.length === 1) {
      if (role ==  1 || role == 2) {
        await paginaService.updateById(id, {
          estado: 'delete'
        })
        return res.json({
          ok: true,
          msg: 'La página ha sido borrada correctamente.'
        })
      } else if (role == 3) {
        if (pagina[0].empresa_id == token) {
          await paginaService.updateById(id, {
            estado: 'delete'
          })
          return res.json({
            ok: true,
            msg: 'La página ha sido borrada correctamente.'
          })
        }
      }

      return res.json({
        ok: false,
        msg: 'No tiene permisos para esta acción.'
      })
    } else {
      return res.json({
        ok: false,
        msg: 'No se encontro la página.'
      })
    }
  } catch (error) {
    return catchError(res, error);
  }
})


/**
 * Esta ruta actualiza la pagina a draft
 */
router.put('/restore/:id', async (req, res) => {
  try {
    const { token, role } = await getAllDataSession(req);
    const id = req.params.id;
    const pagina = await paginaService.getById(id);
    if (pagina.length === 1) {
      if (role == 1 || role == 2) {
        await paginaService.updateById(id, {
          estado: 'draft'
        })
        return res.json({
          ok: true,
          msg: 'La página ha sido recuperada correctamente.'
        })
      } else if (role == 3) {
        if (pagina[0].empresa_id == token) {
          await paginaService.updateById(id, {
            estado: 'draft'
          })
          return res.json({
            ok: true,
            msg: 'La página ha sido recuperada correctamente.'
          })
        }
      }

      return res.json({
        ok: false,
        msg: 'No tiene permisos para esta acción.'
      })
    } else {
      return res.json({
        ok: false,
        msg: 'No se encontro la página.'
      })
    }
  } catch (error) {
    return catchError(res, error);
  }
})

/**
 * Crea un nueva página
 */
router.post('/create', async (req, res) => {
  try {
    console.log(req.body);
    let empresa_id = req.body.empresa_id || null;
    if (empresa_id) {
      const { token, role } = await getAllDataSession(req);
      if (role == 'empresa') {
        empresa_id = token;
      }
      const paginaData = await paginaService.getByColumn({ column: 'empresa_id', value: empresa_id }).where('estado', 'nuevo');
      if (paginaData.length > 0) {
        return res.json({
          ok: true,
          msg: 'Se va a redirigir.',
          redirect: `/admin-blog/paginas/editar/${paginaData[0].id}`
        });
      } else {
        const pagina = await paginaService.save({ titulo: '', empresa_id });
        return res.json({
          ok: true,
          msg: 'Se va a redirigir.',
          redirect: `/admin-blog/paginas/editar/${pagina}`
        })
      }
    } else {
      throw Error('No se encontro la empresa.');
    }
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/editar/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { role, dataSession, dataSistema, token } = await getAllDataSession(req);
    let view = 'modulo-tv/modulo-blog/pagina/update';
    let data = [];

    if (role == 'superadmin' || role == 'admin') {
      data = await paginaService.getById(id);
    } else if (role == 'empresa') {
      data = await paginaService.getByColumn({ column: 'empresa_id', value: token }).andWhere('id', id);
    }
    return res.render(view, {
      dataSession,
      dataSistema,
      data
    })

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/mostrar/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { role, dataSession, dataSistema, token } = await getAllDataSession(req);
    let view = 'modulo-tv/modulo-blog/pagina/show';
    let data = [];

    if (role == 'superadmin' || role == 'admin') {
      data = await paginaService.getById(id);
    } else if (role == 'empresa') {
      data = await paginaService.getByColumn({ column: 'empresa_id', value: token }).andWhere('id', id);
    }
    return res.render(view, {
      dataSession,
      dataSistema,
      data
    })

  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/', async (req, res) => {
  try {
    let view = 'modulo-tv/modulo-blog/pagina/usuario'
    let empresas = [];
    let data = [];
    const { role, dataSession, dataSistema, token } = await getAllDataSession(req);

    if (role == 1 || role == 2) {
      return res.json('modulo-tv/modulo-blog/pagina/superadmin', {
        dataSession,
        dataSistema
      });
    } else if (role == 3) {
      data = await paginaService.getbyCompany(token);
    }

    let draft = [], pending = [], publish = [], deleting = [];

    for (let i = 0; i < data.length; i++) {
      switch (data[i].estado) {
        case 'publish':
          publish.push(data[i]);
          break;
        case 'pending':
          pending.push(data[i]);
          break;
        case 'delete':
          deleting.push(data[i]);
          break;
        case 'draft':
          draft.push(data[i]);
          break;
      }
    }

    return res.render(view, {
      dataSession,
      dataSistema,
      empresas,
      publish,
      pending,
      deleting,
      draft
    })

  } catch (error) {
    return catchError(res, error);
  }
})

router.get('/empresa/:id', isAdminSuperAdminMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const { dataSession, dataSistema } = await getAllDataSession(req);
    const data = await paginaService.getbyCompany(id);

    let draft = [], pending = [], publish = [], deleting = [];

    for (let i = 0; i < data.length; i++) {
      switch (data[i].estado) {
        case 'publish':
          publish.push(data[i]);
          break;
        case 'pending':
          pending.push(data[i]);
          break;
        case 'delete':
          deleting.push(data[i]);
          break;
        case 'draft':
          draft.push(data[i]);
          break;
      }
    }


    res.render('modulo-blog/pagina/admin-usuario', {
      dataSession,
      dataSistema,
      draft,
      pending,
      publish,
      deleting,
      empresa_id: id
    })
  } catch (error) {
    return catchError(res, error);
  }
});

/**
 * Attach las categorias seleccionadas para una pagina.
 */
router.post('/tach', async (req, res) => {
  try {
    const categories = req.body.categories;
    const pagina_id = req.body.pagina_id;
    const paginaData = await paginaService.getById(pagina_id);
    if (paginaData.length == 1) {
      const categoriaData = await categoriable.getByColumn({ column: 'pagina_id', value: pagina_id });
      let auxC = []
      if (Array.isArray(categories)) {
        auxC = categories.map(val => ({
          categoria_id: val.id,
          pagina_id
        }));
      }
      const auxT = categoriaData.map(val => parseInt(val.id));

      if (auxT.length > 0) {
        detach = await categoriable.deleteBy().whereIn('id', auxT);
      }
      if (auxC.length > 0) {
        tach = await categoriable.saveBy().insert(auxC);
      }

      return res.json({
        ok: true,
        msg: 'Mensaje'
      })
    } else {
      return res.status(400).json({
        ok: false,
        msg: 'No se pudo agregar las categorias'
      })
    }
  } catch (error) {
    return catchError(res, error);
  }
});

/**
 * La siguiente ruta selecciona las relaciones muchos a muchos entre blog_categorias <--> blog_paginas
 */
router.get('/categoriable/:id', async (req, res) => {
  try {
    const pagina_id = req.params.id;
    const categorias = await categoriable.getByColumn({ column: 'pagina_id', value: pagina_id });

    return res.json({
      ok: true,
      msg: 'Datos encontrados',
      data: categorias
    });

  } catch (error) {
    return catchError(res, error);
  }
});

/**
 * La siguiente ruta recibe un arreglo de [{ id: numbre }, ...], para actualizarlos a un estado draft
 */
router.put('/autodraft', async (req, res) => {
  try {
    const paginas = req.body.paginas;
    if (Array.isArray(paginas)) {
      const paginasMap = paginas.map(val => val.id);
      if (paginasMap.length > 0) {
        const dataUpdate = await paginaService.updateBy({ estado: 'draft' }).whereIn('id', paginasMap);
        if (dataUpdate > 0) {
          return res.json({
            ok: true,
            msg: 'Se movieron a papelera correctamente'
          })
        } else {
          throw Error('1.0 Ocurrio un error inesperado.')
        }
      } else {
        throw Error('1.1 Ocurrio un error inesperado.')
      }
    } else {
      throw Error('1.2 Ocurrio un error inesperado.')
    }
  } catch (error) {
    console.log('error', error)
    return catchError(res, error);
  }
});

/**
 * La siguiente ruta recibe un arreglo de [{ id: numbre }, ...], para actualizarlos a un estado publish
 */
router.put('/autopublish', async (req, res) => {
  try {
    const paginas = req.body.paginas;
    if (Array.isArray(paginas)) {
      const paginasMap = paginas.map(val => val.id);
      if (paginasMap.length > 0) {
        const dataUpdate = await paginaService.updateBy({ estado: 'publish' }).whereIn('id', paginasMap);
        if (dataUpdate > 0) {
          return res.json({
            ok: true,
            msg: 'Se movieron a publicado correctamente'
          })
        } else {
          throw Error('1.0 Ocurrio un error inesperado.')
        }
      } else {
        throw Error('1.1 Ocurrio un error inesperado.')
      }
    } else {
      throw Error('1.2 Ocurrio un error inesperado.')
    }
  } catch (error) {
    return catchError(res, error);
  }
});


module.exports = router
