const { Router } = require("express");
const router = Router()

const { TutorialController }=require("../../controllers/modulo-casino/tutoriales.controller")

const { service: TutorialService } = TutorialController;
const {uploadVideo}= require ("../../helpers/modulo-tv/multer")

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

router.get('/datatable/:id?', TutorialController.datatable);
router.get('/select2/:id?', TutorialController.select2);

router.get('/', async (req, res) => {
    try {
        let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
        if (role == 1 || role == 2) {
            return res.render('modulo-casino/tutorial/superadmin', {
                dataSession,
                dataSistema,
            });
        }
        return res.render("modulo-casino/admin-tutorial", {
            dataSession,
            dataSistema
        });

    } catch (error) {
        return catchError(res, error);
    }
});

router.get("/empresa/:id", check('id').isNumeric().withMessage("El id debe ser un numero"), EVResult, async (req, res) => {
    try {
        const { dataSession, dataSistema } = await getAllDataSession(req);
        return res.render("modulo-casino/admin-tutorial", {
            dataSession,
            dataSistema,
            empresa_id: req.params.id
        });
    } catch (error) {
        return catchError(res, error);
    }
});

router.post('/', 
uploadVideo.single("video_media"),
async (req, res) => {
    try {
        let url=""
        let video=""
        let empresa_id=0
        let { role, token } = await getAllDataSession(req);

        console.log(req.file)
        if (req.body.url!="" && req.body.url!= undefined )
            url=req.body.url
        if (req.body.video!="" && req.body.video!= undefined )
            video=req.body.video
        if (role==1  || role==2)
        {
            
            if (req.body.empresa_id.isNumeric() && req.body.empresa_id!= undefined )
                empresa_id= req.body.empresa_id
        }
        else if(role==3)
        {
            empresa_id=token
        }

        let obj= {
            empresa_id: empresa_id,
            titulo: req.body.titulo,
            id_categoria: req.body.id_categoria,
            id_subcategoria: req.body.id_subcategoria,
            url,
            video_media: video
        }
        await TutorialService.save(obj)
        return (res.json({"OK": true}))
        

    } catch (error) {
        
        return catchError(res, error)
    }
}

);

router.put('/:id', check('id').isNumeric().withMessage("El id debe ser un número"), 
check("empresa_id").optional().isNumeric().withMessage("El id debe ser un número"),
check("id_categoria").optional().isNumeric().withMessage("El id debe ser un número"),
check("id_subcategoria").optional().isNumeric().withMessage("El id debe ser un número"),
check("titulo").isString().withMessage("El titulo debe ser un texto"),
check("video_media").optional().isString().withMessage("El titulo debe ser un texto"),
check("url").optional().isString().withMessage("La URL debe ser un texto"),
EVResult, 

TutorialController.update);

router.get('/:id', check('id').isNumeric().withMessage("El id debe ser un número"), EVResult, TutorialController.show);


router.delete('/:id', check('id').isNumeric().withMessage("El id debe ser un número"), EVResult, TutorialController.delete);

module.exports = router;
