const { Router } = require('express');
const router = Router();

// middlewares
const { EVResult } = require('../../middlewares/EVResult.middleware');
const { check } = require('express-validator');
const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');

//-----------------CONTROLLERS AND SERVICES-----------------
const { AcercaNosotroController, AlianzaController, NotaPrensaController, TestimonioController } = require('../../controllers/modulo-generales/landing');
const { ConfiguracionSitemaController } = require('../../controllers/modulo-generales/configuracion/configuracion-sistema.controller');

const { service: AcercaNosotroService } = AcercaNosotroController;
const { service: AlianzaService } = AlianzaController;
const { service: NotaPrensaService } = NotaPrensaController;
const { service: TestimonioService } = TestimonioController;
const { service: ConfiguracionSitemaService } = ConfiguracionSitemaController;


//-----------------ROUTES-----------------

router.get('/data', async (req, res) => {
  try {
    const alianzas = await AlianzaService.getAll();
    const acerca = await AcercaNosotroService.getAll();
    const notas = await NotaPrensaService.getAll();
    const testimonios = await TestimonioService.getAll();
    res.status(200).json({
      alianzas: alianzas,
      acerca: acerca,
      testimonios: testimonios,
      notas: notas,

    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/get-historia-empresa', async (req, res) => {
  try {
    const result = await ConfiguracionSitemaService.getTable().select(['historia', 'historiaImg']);
    return res.json({
      ok: true,
      data: result
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/get-vision', async (req, res) => {
  try {
    const result = await ConfiguracionSitemaService.getTable().select(['vision', 'visionImg']);
    return res.json({
      ok: true,
      data: result
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get('/get-mision', async (req, res) => {
  try {

    const result = await ConfiguracionSitemaService.getTable().select(['mision', 'misionImg']);
    return res.json({
      ok: true,
      data: result
    });
  } catch (error) {
    return catchError(res, error);
  }
});

// router.get('/get-galeria', async (req, res) => {
//   try {
//     let queryData = "SELECT name, descripcion, descripcion_corta, imagen FROM `platos` ";
//     let result = await db.query(con, queryData);
// } catch (error) {
//   return catchError(res, error);
// }
// });

// router.get('/get-clientes-destacados', async (req, res) => {
//   try {
//     let queryData = "SELECT nombre as name, url, imagen as image FROM `clientes_landing` ";
//     let result = await db.query(con, queryData);
//     return res.json({
//       ok: true, 
//       data: result
//     });
// } catch (error) {
//   return catchError(res, error);
// }
// });

router.get('/get-testimonios-destacados', async (req, res) => {
  try {
    // let queryData = "SELECT nombre as name, apellido as lastname, imagen as image, texto as text FROM `testimonios` ";
    const result = await TestimonioService.getTable().select(['nombre', 'apellido', 'imagen', 'texto']);
    return res.json({
      ok: true,
      data: result
    });
} catch (error) {
  return catchError(res, error);
}
});

// router.get('/get-servicios-informacion', async (req, res) => {
//   try {
//     let queryData = "SELECT nombre as name, descripcion as description, descripcion_corta as short_description, imagen as image FROM `servicios_landing` " ;
//     let result = await db.query(con, queryData);
//     return result;
//     // const result = await TestimonioService.getTable().select(['nombre', 'apellido', 'imagen', 'texto']);
//     return res.json({
//       ok: true,
//       data: result
//     });
// } catch (error) {
//   return catchError(res, error);
// }
// });


module.exports = router;
