const { Router } = require("express"),
    router = Router();
const {catchError, getAllDataSession} = require('../../../helpers/modulo-tv/basicrequest.helpers')
const {uploadVideo} = require('../../../helpers/modulo-tv/multer');


router.use('/peliculas', require('./filmes/pelicula.routes'));
router.use('/series', require('./filmes/serie.routes'));
router.use('/documentales', require('./filmes/documental.routes'));

router.use('/actores', require('./personas/actor.routes'));
router.use('/directores', require('./personas/director.routes'));
router.use('/productores', require('./personas/productor.routes'));

router.get('/', async (req, res) => {
    try {
        const { dataSistema, dataSession } = await getAllDataSession(req);
        res.render('modulo-tv/modulo-video-prime/index', {
            dataSession,
            dataSistema
        })
    } catch (error) {
        return catchError(res, error);
    }
});


router.get('/videoupload', async (req, res) => {
    try {
        const { dataSistema, dataSession } = await getAllDataSession(req);
        res.render('modulo-tv/modulo-video-prime/videoupload', {
            dataSession,
            dataSistema
        })
    } catch (error) {
        return catchError(res, error);
    }
});

router.post('/videoupload', uploadVideo.single('video'), async (req, res) => {
    try {
        const { token, role } = await getAllDataSession(req);
        if (role == 1 || role == 2) {

        } else if (role == 3) {

        }


        
    } catch (error) {
        return catchError(res, error);
    }
});

module.exports = router;