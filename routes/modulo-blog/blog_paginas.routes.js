const { Router } = require("express"), router = Router();

const {BlogPaginaController} = require("../../controllers/modulo-blog/blog_paginas.controller");
const {body, param, query } = require("express-validator");
const { isAdminMiddleware, isAdminSuperAdminMiddleware } = require('../../middlewares/modulo-tv/isAdmin');

const BlogPagina = new BlogPaginaController();
router.get("/datatable/:id?", BlogPagina.datatable);
router.get("/select2/:id?", BlogPagina.select2);

router.put('/pagina/:id', BlogPagina.update);

router.delete('/pagina/:id', BlogPagina.delete);

/**
 * Esta ruta actualiza la pagina a delete
 */
router.put('/delete/:id', BlogPagina.deletePagina);


// /**
//  * Esta ruta actualiza la pagina a draft
//  */
// router.put('/restore/:id', async (req, res) => {
//   try {
//     const { token, role } = await getAllDataSession(req);
//     const id = req.params.id;
//     const pagina = await paginaService.getById(id);
//     if (pagina.length === 1) {
//       if (role == 1 || role == 2) {
//         await paginaService.updateById(id, {
//           estado: 'draft'
//         })
//         return res.json({
//           ok: true,
//           msg: 'La página ha sido recuperada correctamente.'
//         })
//       } else if (role == 3) {
//         if (pagina[0].empresa_id == token) {
//           await paginaService.updateById(id, {
//             estado: 'draft'
//           })
//           return res.json({
//             ok: true,
//             msg: 'La página ha sido recuperada correctamente.'
//           })
//         }
//       }

//       return res.json({
//         ok: false,
//         msg: 'No tiene permisos para esta acción.'
//       })
//     } else {
//       return res.json({
//         ok: false,
//         msg: 'No se encontro la página.'
//       })
//     }
//   } catch (error) {
//     return catchError(res, error);
//   }
// })

// /**
//  * Crea un nueva página
//  */
// router.post('/create', async (req, res) => {
//   try {
//     console.log(req.body);
//     let empresa_id = req.body.empresa_id || null;
//     if (empresa_id) {
//       const { token, role } = await getAllDataSession(req);
//       if (role == 'empresa') {
//         empresa_id = token;
//       }
//       const paginaData = await paginaService.getByColumn({ column: 'empresa_id', value: empresa_id }).where('estado', 'nuevo');
//       if (paginaData.length > 0) {
//         return res.json({
//           ok: true,
//           msg: 'Se va a redirigir.',
//           redirect: `/admin-blog/paginas/editar/${paginaData[0].id}`
//         });
//       } else {
//         const pagina = await paginaService.save({ titulo: '', empresa_id });
//         return res.json({
//           ok: true,
//           msg: 'Se va a redirigir.',
//           redirect: `/admin-blog/paginas/editar/${pagina}`
//         })
//       }
//     } else {
//       throw Error('No se encontro la empresa.');
//     }
//   } catch (error) {
//     return catchError(res, error);
//   }
// });

// router.get('/editar/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { role, dataSession, dataSistema, token } = await getAllDataSession(req);
//     let view = 'modulo-tv/modulo-blog/pagina/update';
//     let data = [];

//     if (role == 'superadmin' || role == 'admin') {
//       data = await paginaService.getById(id);
//     } else if (role == 'empresa') {
//       data = await paginaService.getByColumn({ column: 'empresa_id', value: token }).andWhere('id', id);
//     }
//     return res.render(view, {
//       dataSession,
//       dataSistema,
//       data
//     })

//   } catch (error) {
//     return catchError(res, error);
//   }
// });

// router.get('/mostrar/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { role, dataSession, dataSistema, token } = await getAllDataSession(req);
//     let view = 'modulo-tv/modulo-blog/pagina/show';
//     let data = [];

//     if (role == 'superadmin' || role == 'admin') {
//       data = await paginaService.getById(id);
//     } else if (role == 'empresa') {
//       data = await paginaService.getByColumn({ column: 'empresa_id', value: token }).andWhere('id', id);
//     }
//     return res.render(view, {
//       dataSession,
//       dataSistema,
//       data
//     })

//   } catch (error) {
//     return catchError(res, error);
//   }
// });

router.get('/', BlogPagina.renderHomeView)

router.get('/empresa/:id', isAdminSuperAdminMiddleware, 
  param('id').isNumeric().withMessage('El campo id debe ser un numero'),
BlogPagina.renderSuperadminHomeView);

/**
 * Attach las categorias seleccionadas para una pagina.
 */
router.post('/tach', 
  body('pagina_id').notEmpty().withMessage('El id de la pagina es requerido.'),
  body('categories').notEmpty().withMessage('Las categorias son requeridas.'),
  body('empresa_id').optional().isNumeric().withMessage('El id de la empresa es requerido.'),
  BlogPagina.postTach);

/**
 * La siguiente ruta selecciona las relaciones muchos a muchos entre blog_categorias <--> blog_paginas
 */
router.get('/categoriable/:id',
  param('id').isNumeric().withMessage('El campo id debe ser un numero'),
BlogPagina.getCategoriable);

/**
 * La siguiente ruta recibe un arreglo de [{ id: numbre }, ...], para actualizarlos a un estado draft
 */
router.put('/autodraft',
  body('paginas').isArray().withMessage('El campo paginas debe ser un arreglo'),
  body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un numero'),
BlogPagina.putAutoDraft);

/**
 * La siguiente ruta recibe un arreglo de [{ id: number }, ...], para actualizarlos a un estado publish
 */
router.put('/autopublish', 
  body('paginas').isArray().withMessage('El campo paginas debe ser un arreglo'),
  body('empresa_id').optional().isNumeric().withMessage('El campo empresa_id debe ser un numero'),
BlogPagina.putAutoPublish);


module.exports = router
