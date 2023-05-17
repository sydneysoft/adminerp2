/**
 * 
 * path: /admin-choferes/
 */


const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

// controllers
const { showModule, getDrivers, getDriverById, updateDriver, deleteDriver, saveDriver } = require('../controllers/drivers');

// middlewares

const fileUpload = require('express-fileupload');
const { validarCampos } = require('../helpers/validar-campos');
const { handleUploads } = require('../middlewares/uploads');
const path = require('path');

// routes

router.get('/', showModule)

router.get('/getDrivers', getDrivers);

router.get('/:id', [
    check('id').not().isEmpty(),
    check('id').custom(async id => {
        if (isNaN(id)) throw new Error('id invalido');
    }),
    validarCampos
], getDriverById);


router.get('/files/:name', (req, res) => {
    return res.sendFile(path.resolve('public/uploads/' + req.params.name))
})


router.post('/new', [
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/'
    }),
    check('primer_nombre').not().isEmpty(),
    check('apellido_paterno').not().isEmpty(),
    check('apellido_materno').not().isEmpty(),
    check('tipo_de_documento').not().isEmpty(),
    check('numero_de_documento').not().isEmpty(),
    check('tipo_de_licencia').not().isEmpty(),
    check('numero_de_licencia').not().isEmpty(),
    check('fecha_de_contratacion').not().isEmpty(),
    check('estado').not().isEmpty(),
    check('tipo_de_vehiculo').not().isEmpty(),
    handleUploads,
    validarCampos
], saveDriver);

router.put('/:id', [
    fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }),
    check('id').not().isEmpty(),
    check('id').custom(async id => {
        if (isNaN(id)) throw new Error('id invalido');
    }),
    handleUploads,
    validarCampos
], updateDriver);

router.delete('/:id', [
    check('id').not().isEmpty(),
    check('id').custom(async id => {
        if (isNaN(id)) throw new Error('id invalido');
    }),
    validarCampos
], deleteDriver);

module.exports = router;
