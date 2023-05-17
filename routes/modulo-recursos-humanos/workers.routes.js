const { Router } = require('express');
const router = Router();


// controllers
const { showModule, getWorkers, getWorkerById, updateWorker, deleteWorker, saveWorker } = require('../../controllers/modulo-recursos-humanos/workers');

// middlewares

const fileUpload = require('express-fileupload');
const { validarCampos } = require('../../helpers/validar-campos');
const { handleUploads } = require('../../middlewares/uploads');
const path = require('path');

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { EVResult } = require('../../middlewares/EVResult.middleware');
const { check, oneOf, matchedData } = require('express-validator');

const { EmpleadoController } = require("../../controllers/modulo-recursos-humanos/empleados.controller");



router.get("/datatable/:id?", EmpleadoController.datatable);
router.get("/select2/:id?", EmpleadoController.select2);


router.get("/", async (req, res) => {
    try {
        const { role, token, dataSession, dataSistema } = await getAllDataSession(req);
        if (role == 1 || role == 2) {

            res.render("modulo-recursos-humanos/workers/superadmin", {
                dataSession,
                dataSistema
            });
        }

        return res.render("modulo-recursos-humanos/workers", {
            dataSession,
            dataSistema
        });

    } catch (error) {
        return catchError(res, error);
    }
})

router.get("/empresa/:id", async (req, res) => {
    try {
        const { dataSession, dataSistema } = await getAllDataSession(req);
        return res.render("modulo-recursos-humanos/workers", {
            dataSession,
            dataSistema,
            empresa_id: req.params.id
        });
    } catch (error) {
        return catchError(res, error);
    }
});

// routes

router.get('/getWorkers', getWorkers);

router.get("/:id",
    check('id').isNumeric().withMessage('id invalido'),
    EVResult, EmpleadoController.show);


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


router.delete("/:id",
    check('id').isNumeric().withMessage('id invalido'),
    EVResult, EmpleadoController.delete);



module.exports = router;
