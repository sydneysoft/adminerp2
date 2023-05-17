const ServiceSQL = require('../../services/services');
const logger = require('../../helpers/logger');

const GeneroController = require('../modulo-tv/modulo-tv/genero.controller');

const ProgramaController = require('../modulo-tv/modulo-tv/programa.controller');
const { UploadController, uploadImage, uploadVideo } = require('../modulo-tv/modulo-tv/upload.controller');
const { getDataSistema } = require("../../helpers/db");
const PageController = require('../modulo-tv/modulo-tv/page.controller');
const ServiceController = require('../modulo-tv/modulo-tv/servicio.controller');
const FAQController = require('../modulo-tv/modulo-faqs/faqs/faqs.controller');
const ContactoController = require('../modulo-tv/modulo-tv/contacto.controller');

class VivaTvController {
  constructor () {
    this.vivatv = new ServiceSQL('vivatv')
    this.modulos = new ServiceSQL('modulos')
    this.name = "TV"
  }

  getModule = async (req, res) => {
    await this.vivatv.checkExist().then(async() => {
      const token = req.session.token || ''
      const dataSession = req.session
      const dataSistema = await getDataSistema(req.session.token);
      const moduloData = await this.modulos.getTable().where('nombre', this.name)

      res.render("modulo-tv/modulo-tv/admin-tv", {
        dataSession,
        dataSistema,
        moduloData: moduloData[0]
      })
      
    }).catch((error) => {
      logger.error("Error al guardar : ", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
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
  GeneroController,
  UploadController,
  uploadImage,
  uploadVideo,
  VivaTvController,
  ProgramaController,
  PageController,
  ServiceController,
  FAQController,
  ContactoController
}