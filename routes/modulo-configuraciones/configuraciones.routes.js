const { Router } = require("express"),
    router = Router();

const {
    ContactoController,
    UploadController, 
    uploadImage, 
    uploadVideo,
    // EmpresaController, 
    VivaTvController, 
    // NosotrosController,
    ServiceController,  
    // ContactoController, 
} = require('../../controllers/modulo-configuraciones/configuraciones.controller');

// Agrego router de esta seccion


// Api Routes para uploads

router.post('/upload/video', uploadVideo.single('video'), new UploadController().uploadVideo)
router.get('/video/:id', new UploadController().getVideo)
router.post('/upload/thumbnail', uploadImage.single('image'), new UploadController().uploadThumbnail)
router.get('/thumbnail/:id', new UploadController().getImage)


// Api Routes para Servicios

// router.get('/services/generate', ServiceController.generateTable)

router.get('/services/crear', ServiceController.createView)
router.get('/services/edite/:id', ServiceController.editeView)
router.get('/services/show/:id', ServiceController.showView)
router.get('/services', ServiceController.indexView)

router.get('/services/index', ServiceController.index)
router.post('/services/index', ServiceController.save)
router.get('/services/:id', ServiceController.show)
router.put('/services/:id', ServiceController.update)
router.delete('/services/:id', ServiceController.delete)


// Api Routes para FAQs

router.get('/contacto/show/:id', ContactoController.showView)
router.get('/contacto', ContactoController.indexView)



router.get('/', new VivaTvController().getModule)
router.get('/data', new VivaTvController().isActived)
router.post('/', new VivaTvController().save)

module.exports = router