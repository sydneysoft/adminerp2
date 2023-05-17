const { Router } = require("express");
const router = Router();

const {check, matchedData, oneOf} = require('express-validator');
const {EVResult} = require('../../middlewares/EVResult.middleware');

const {Country, City, State}= require("country-state-city");

/**
 * @caeher
 * 
 * Ruta para obtener todos los paises
 */
router.get('/countries', async (req, res) => {
  try {
    return res.json(Country.getAllCountries());
  } catch (error) {
    return res.status(400).json({
      ok: false
    });
  }
});


/**
 * @caeher
 * 
 * Ruta para obtener un pais por su codigo
 */
router.get('/countries/:code', 
  check('code').isString().withMessage("Code is required"),
  EVResult, async (req, res) => {
  try {
    const code = req.params.code;
    
    return res.json(Country.getCountryByCode(code.toUpperCase()));
  } catch (error) {
    return res.status(400).json({
      ok: false
    });
  }
});

/**
 * @caeher
 * 
 * Ruta para obtener todos las ciudades
 */
router.get('/cities', async (req, res) => {
  try {
    return res.json(City.getAllCities());
  } catch (error) {
    return res.status(400).json({
      ok: false
    });
  }
});


/**
 * @caeher
 * 
 * Ruta para obtener las ciudades por su codigo de pais
 */
router.get('/countries/:code/cities', 
  check('code').isString().withMessage("Code is required"),
  EVResult, async (req, res) => {
  try {
    const code = req.params.code;
    return res.json(City.getCitiesOfCountry(code.toUpperCase()));
  } catch (error) {
    return res.status(400).json({
      ok: false
    });
  }
});

/**
 * @caeher
 * 
 * Ruta para obtener las ciudades por su codigo de pais y codigo de estado
 */
router.get('/countries/:countryCode/states/:stateCode/cities', 
  check('countryCode').isString().withMessage("Country code is required"),
  check('stateCode').isString().withMessage("State code is required"),
  EVResult, async (req, res) => {
  try {
    const {countryCode, stateCode} = req.params;
    return res.json(City.getCitiesOfState(countryCode.toUpperCase(), stateCode.toUpperCase()));
  } catch (error) {
    return res.status(400).json({
      ok: false
    });
  }
})

/**
 * @caeher
 * 
 * Ruta para obtener todos los estados
 */
router.get('/states', async (req, res) => {
  try {
    return res.json(State.getAllStates());
  } catch (error) {
    return res.status(400).json({
      ok: false
    });
  }
});

/**
 * @caeher
 * 
 * Ruta para obtener un estado por su codigo
 */
router.get('/states/:isoCode', 
  check('isoCode').isString().withMessage("Iso code is required"),
  EVResult, async (req, res) => {
  try {
    const isoCode = req.params.isoCode;
    return res.json(State.getStateByCode(isoCode.toUpperCase()));
  } catch (error) {
    return res.status(400).json({
      ok: false
    });
  }
});


/**
 * @caeher
 * 
 * Ruta para obtener los estados por su codigo de pais
 */
router.get('/countries/:code/states', 
  check('code').isString().withMessage("Code is required"),
  EVResult
,async (req, res) => {
  try {
    const code = req.params.code;
    return res.json(State.getStatesOfCountry(code.toUpperCase()));
  } catch (error) {
    return res.status(400).json({
      ok: false
    });
  }
});

/**
 * @caeher
 * 
 * Ruta para obtener un estado por su codigo y codigo de estado
 */
router.get('/countries/:countryCode/states/:stateCode',
  check('countryCode').isString().withMessage("Country code is required"),
  check('stateCode').isString().withMessage("State code is required"),
  EVResult, async (req, res) => {
  try {
    const {countryCode, stateCode} = req.params;
    return res.json(State.getStateByCodeAndCountry(stateCode.toUpperCase(), countryCode.toUpperCase()));
  } catch (error) {
    return res.status(400).json({
      ok: false
    });
  }
});



module.exports = router;
