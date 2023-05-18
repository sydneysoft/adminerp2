const { Router } = require("express"), router = Router();

const {BlogCategoriaController} = require("../../controllers/modulo-blog/blog_categorias.controller");

const { isAdminMiddleware, isAdminSuperAdminMiddleware } = require("../../middlewares/modulo-tv/isAdmin");


const { body, query, param } = require("express-validator");


const BlogCategoria = new BlogCategoriaController();


router.get("/datatable/:id?", BlogCategoria.datatable);
router.get("/select2/:id?", BlogCategoria.select2);

router.get("/", BlogCategoria.renderHomeView);
router.get("/empresa/:id", isAdminSuperAdminMiddleware, BlogCategoria.renderSuperadminHomeView);


router.delete("/:id", BlogCategoria.delete)

// Metodo unico para la categoria, donde se comprueba que solo exista una categoria para cada empresa_id
router.post("/", 
  body("nombre").isLength({ min: 3 }).withMessage("El campo nombre debe ser de 3 o más caracteres."), 
  body("descripcion").optional().isString().withMessage("El campo descripcion debe ser de tipo texto."),
  body("imagen").optional().isString().withMessage("El campo imagen debe ser de tipo texto."),
  body("empresa_id").optional().isNumeric().withMessage("El campo empresa_id debe ser de tipo numerico."),
  BlogCategoria.postCategory);

router.put("/:id", 
  param('id').isNumeric().withMessage('El id debe ser numerico.'),
  body("nombre").isLength({ min: 3 }).withMessage("El campo nombre debe ser de 3 o más caracteres."), 
  body("descripcion").optional().isString().withMessage("El campo descripcion debe ser de tipo texto."),
  body("imagen").optional().isString().withMessage("El campo imagen debe ser de tipo texto."),
  body("empresa_id").optional().isNumeric().withMessage("El campo empresa_id debe ser de tipo numerico."),
  BlogCategoria.putCategory)




/**
 * La siguiente ruta permite obtener todas las categorias por usuario
 */

// router.get("/get/:empresa_id", async (req, res) => {
//   try {
//     const { role } = await getAllDataSession(req);
//     if (role == 1 || role == 2) {
//       const empresa_id = req.params.empresa_id;
//       const data = await categoriaService.getbyCompany(empresa_id);
//       return res.json({
//         ok: true,
//         data
//       })
//     } else {
//       return res.status(400).json({
//         ok: false,
//         msg: "No tiene permitido esta acción"
//       })
//     }
//   } catch (error) {
//     return catchError(req, error);
//   }
// });

module.exports = router
