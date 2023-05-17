const ServiceSQL = require('../../../services/services');
const logger = require('../../../helpers/logger');
// const CategoryController = require('./category.controller');
const GeneroController = require('./genero.controller');
const ProgramaController = require('./programa.controller');
const { UploadController, uploadImage, uploadVideo } = require('./upload.controller');
const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers')
const PageController = require('./page.controller');
const ServiceController = require('./servicio.controller');
const FAQController = require('./faq.controller');
const SliderController = require('./slider.controller');
const ContactoController = require('./contacto.controller');
const VideoLiveController = require('./video_live.controller');
const {ActorController} = require('./actor.controller');
const {DirectorController} = require('./director.controller');
const {ProductorController} = require('./productor.controller');

class VivaTvController {
  constructor () {
    this.vivatv = new ServiceSQL('vivatv')
    this.modulos = new ServiceSQL('modulos')
    this.name = "TV"
  }

  getModule = async (req, res) => {
    await this.vivatv.checkExist().then(async() => {
      const { role, token, dataSession, dataSistema} = await getAllDataSession(req);
      
      const moduloData = await this.modulos.getTable().where('nombre', this.name)

      res.render("modulo-tv/modulo-tv/admin-tv", {
        dataSession,
        dataSistema,
        moduloData: moduloData[0]
      })
      
    }).catch((error) => {
      return catchError(res, error);
    })
  }

  isActived = async (req, res) => {
    try {
      const moduloData = await this.modulos.getTable().where('nombre', this.name)
      res.json(moduloData[0])
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  }

  save = async (req, res) => {
    try {
      const {activo, id} = req.body
      const result = await this.modulos.updateById(id, { activo});
      return res.status(200).json({
        ok: true,
        result,
      })
    } catch (error) {
      logger.info(error)
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  }

}



module.exports = {
  // CategoryController,
  GeneroController,
  UploadController,
  uploadImage,
  uploadVideo,
  VivaTvController,
  ProgramaController,
  PageController,
  ServiceController,
  FAQController,
  SliderController,
  ContactoController,
  VideoLiveController,
  ActorController,
  DirectorController,
  ProductorController
}