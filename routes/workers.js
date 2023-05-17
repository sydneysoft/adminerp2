/**
 * 
 * path: /admin-trabajadores/
 */

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();


// controllers
const { showModule, getWorkers, getWorkerById, updateWorker, deleteWorker, saveWorker } = require('../controllers/workers');

// middlewares

const fileUpload = require('express-fileupload');
const { validarCampos } = require('../helpers/validar-campos');
const { handleUploads } = require('../middlewares/uploads');
const path = require('path');



// routes

router.get('/', showModule)

router.get('/getWorkers', getWorkers);

router.get('/:id', [
    check('id').not().isEmpty(),
    check('id').custom(async id => {
        if (isNaN(id)) throw new Error('id invalido');
    }),
    validarCampos
], getWorkerById);


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
    check('celular').not().isEmpty(),
    check('telefono').not().isEmpty(),
    check('correo').not().isEmpty(),
    check('direccion').not().isEmpty(),
    check('tipo_de_documento').not().isEmpty(),
    check('numero_de_documento').not().isEmpty(),
    check('entidad_bancaria').not().isEmpty(),
    check('numero_de_cuenta').not().isEmpty(),
    check('AFP').not().isEmpty(),
    check('CTS').not().isEmpty(),
    check('fecha_de_contratacion').not().isEmpty(),
    check('estado').not().isEmpty(),
    check('estado').custom(async estado => {
        const states = ['ACTIVO', 'SUSPENDIDO', 'DESPEDIDO', 'RENUNCIA']
        if (!states.find(e => e === estado)) throw new Error('Se ha ingresado un estado no valido')
    }),
    check('nombres_de_persona_de_contacto').not().isEmpty(),
    check('celular_de_persona_de_contacto').not().isEmpty(),
    check('tipo_de_documento_de_persona_de_contacto').not().isEmpty(),
    check('numero_de_documento_de_persona_de_contacto').not().isEmpty(),
    handleUploads,
    validarCampos
], saveWorker);

router.put('/:id', [
    fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }),
    check('id').not().isEmpty(),
    check('id').custom(async id => {
        if (isNaN(id)) throw new Error('id invalido');
    }),
    handleUploads,
    validarCampos
], updateWorker);

router.delete('/:id', [
    check('id').not().isEmpty(),
    check('id').custom(async id => {
        if (isNaN(id)) throw new Error('id invalido');
    }),
    validarCampos
], deleteWorker);

module.exports = router;
