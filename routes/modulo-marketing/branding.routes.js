const { Router } = require("express"), router = Router();

const { body, query, param } = require('express-validator');
const { isAdminSuperAdminMiddleware } = require('../../middlewares/modulo-tv/isAdmin');
const { BrandingController } = require('../../controllers/modulo-marketing/branding.controller');
const { EVResult, EVResultView } = require("../../middlewares/EVResult.middleware");

const Branding = new BrandingController();


router.get("/", Branding.renderHomeView);

router.get("/empresa/:id",
  param('id').isNumeric().withMessage('El id debe ser un número'),
  EVResultView, Branding.renderSuperadminHomeView);


router.put('/brand/:id', 
  isAdminSuperAdminMiddleware,
  param('id').isNumeric().withMessage('El id debe ser un número'),
  body('brands').isJSON().withMessage('El brands debe ser un JSON'),
  body('width').optional().isNumeric().withMessage('El width debe ser un número'),
  body('height').optional().isNumeric().withMessage('El height debe ser un número'),
  body('empresa_id').optional().isNumeric().withMessage('El empresa_id debe ser un número'),
  EVResult, Branding.update);


module.exports = router
