const { Router } = require("express"),
    router = Router();

const {
    UploadController, 
    uploadImage,
    uploadVideo,
    VivaTvController, 
    ProgramaController,
    GeneroController
} = require('../../../controllers/modulo-tv/modulo-tv/tv.controller');
const {  isAnyAuth } = require('../../../middlewares/modulo-tv/isAdmin');


router.use('/video-live',  require('./video-live.routes'));


// Api Routes para uploads

router.post('/upload/video', uploadVideo.single('video'), new UploadController().uploadVideo)
router.get('/video/:id', new UploadController().getVideo)
router.post('/upload/thumbnail', uploadImage.single('image'), new UploadController().uploadThumbnail)
router.get('/thumbnail/:id', new UploadController().getImage);

router.use('/programas', require('./programas.routes'));

router.use('/generos', require('./genero.routes'));
router.use('/actores', require('./actor.routes'));
router.use('/directores', require('./director.routes'));
router.use('/productores', require('./productor.routes'));

router.get('/', new VivaTvController().getModule)

module.exports = router