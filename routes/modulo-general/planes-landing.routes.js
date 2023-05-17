const { Router } = require('express');
const router = Router();

// middlewares
const { EVResult } = require('../../middlewares/EVResult.middleware');
const { check } = require('express-validator');
const fileUpload = require('express-fileupload');
const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');

//-----------------CONTROLLERS AND SERVICES-----------------
const { PlanLandingController } = require('../../controllers/modulo-generales/landing');

const { service: PlanLandingService } = PlanLandingController;


//-----------------ROUTES-----------------

router.get('/', async (req, res) => {
  try {
    let dataView = 'modulo-generales/planes-landing/admin-planes-landing';

    let { token, role, dataSession, dataSistema } = await getAllDataSession(req);

    let bookStore = await PlanLandingService.getAll();

    if (bookStore.status === "error") {
      res.json(bookStore);
    } else {
      res.render('modulo-generales/planes-landing', {
        bookStore,
        dataSession, dataSistema
      });
    }

  } catch (error) {
    return catchError(res, error);
  }
});


router.get('/get-all', PlanLandingController.index);

router.post('/new',
  fileUpload({
    useTempFiles: true,
  }),
  check('nombre').isString().not().isEmpty(),
  check('precio').isNumeric().not().isEmpty(),
  check('frecuencia_del_pago').isString().not().isEmpty(),
  EVResult,
  PlanLandingController.save);

router.get('/:id',
  check('id').isNumeric().not().isEmpty(),
  EVResult,
  PlanLandingController.show);



router.delete('/:id',
  check('id').isNumeric().not().isEmpty(),
  EVResult,
  PlanLandingController.delete);


router.put('/:id',
  fileUpload({
    useTempFiles: true,
  }),
  check('id').isNumeric().not().isEmpty(),
  EVResult,
  PlanLandingController.update);


module.exports = router;
