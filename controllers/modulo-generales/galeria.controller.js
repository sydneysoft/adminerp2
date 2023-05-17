const logger = require("../../helpers/logger");
const ServiceSQL = require("../../services/services");
const { getDataSistema } = require("../../helpers/db");
const cloudinary = require('cloudinary');
class GaleriaController {
    constructor() {
        this.galeria_fotos = new ServiceSQL("galeria_fotos");
        this.productos_grupo_media = new ServiceSQL("productos_grupo_media");


    }

    getAll = async (req, res) => {
        const role = req.session.rol_id
        let token = req.session.usuario_id;
        let dataSession = req.session;
        let dataSistema = await getDataSistema(req.session.usuario_id);

        let bookStore
        try {

            if (role == 1 || role == 2) {
                bookStore = await this.galeria_fotos.count()
            }
            else if (role == 3) {
                bookStore = await this.galeria_fotos.countByCompany(token)
            }


            if (role == 1 || role == 2 || role == 3) {
                res.render("modulo-generales/galeria-fotos/admin-galeria", {
                    dataSession,
                    bookStore: bookStore[0],
                    dataSistema,
                })
            } else {
                res.status(403);
                res.render('403');
            }





        } catch (e) {
            logger.error("Error en modulo galeria", e);
            res.json(e);
        }

    }

    getImages = async (req, res) => {
        try {
            const role = req.session.rol_id;
            let token = req.session.usuario_id;
            console.log(token);
            if (token) {
                let data = []
                if (role == 1 || role == 2) {
                    data = await this.galeria_fotos.getAll()
                } else if (role == 3) {
                    data = await this.galeria_fotos.getbyCompany(token)
                }

                res.json({
                    ok: true,
                    data
                })
            } else {
                res.json({
                    ok: false,
                    msg: 'Acceso denegado'
                })
            }

        } catch (error) {
            res.json({
                ok: false,
                msg: error.message
            })
        }
    }
    post = async (req, res) => {
 
        try {


            let token = req.session.usuario_id;
            const role = req.session.rol_id
            if (role) {
                if (role == 1 || role == 2) {
                    token = 0
                }

                if (req.files.length) {
                    let multiplePicturePromise = req.files.map((picture) =>
                        cloudinary.v2.uploader.upload(picture.path)
                    );
                    let imageResponses = await Promise.all(multiplePicturePromise);

                    const imageURL = imageResponses.map(picture =>
                        ({ public_id: picture.public_id, empresa_id: token, peso: picture.bytes, url: picture.secure_url, tipo: picture.format, width: imageResponses.width, height: imageResponses.height }));

                    await this.galeria_fotos.saveAll(imageURL);

    
                    res.json({ status: "success", images: imageURL });
                } else {

                    res.json({ status: "error" });
                }

            } else {

                res.json({ status: "error" });
            }


        } catch (e) {
            logger.error("Error al subir fotos", e)
            res.json({ status: "error" });

        }
    }
    checkLastGroup = async (req, res) => {
        try {

            let last = await this.gel
        } catch (e) {
            console.log(e);

        }
    }

    selectImages = async (req, res) => {
        try {
            let token = req.session.usuario_id;
            const role = req.session.rol_id
            if (role) {
                if (role == 1 || role == 2) {
                    token = 0
                }

                let result = await this.galeria_fotos.getCountByCompany(token)
                let result2 = await this.galeria_fotos.getLimitGalery(token)
              
                res.json({ data1: result[0]["count(*)"], data2: result2 });
            } else {
                res.json({ data1: 0, data2: [] });
            }
        } catch (e) {
            console.log(e);
            res.json({ data1: 0, data2: [] });
        }
    }

    selectImagesByCount = async (req, res) => {
        let quantityFinal = req.params.id;

        if (quantityFinal != 0) {
            quantityFinal = quantityFinal * 10;
        }
        try {

            let token = req.session.usuario_id;
            const role = req.session.rol_id
            if (role) {
                if (role == 1 || role == 2) {
                    token = 0
                }
                let result = await this.galeria_fotos.getLimitGaleryAll(token, quantityFinal)


                res.json(result);

            } else {
                res.json([]);
            }
        } catch (e) {

            res.json([]);
        }
    }
    deleteImage = async (req, res) => {
        let imagenID = req.params.id;
        let public_id = req.body.public_id
        console.log(req.body)


        try {

            const role = req.session.rol_id
            if (role) {
                if (role == 1 || role == 2 || role == 3) {

                    await this.galeria_fotos.deleteById(imagenID)
                    await this.productos_grupo_media.deleteByMedia(imagenID)
          
                    await cloudinary.v2.uploader.destroy(public_id, (error, result) => {
                         
                    });
                    res.status(200).json({ status: "success" });

                } else {

                    res.status(403);


                }
            }
        } catch (e) {
            logger.error("error al borrar imagen de galeria", e)

            res.status(400);
        }
    }

}



module.exports = GaleriaController;
