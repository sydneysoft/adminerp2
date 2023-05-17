const ServiceSQL = require("../../services/services");
const { getDataSistema } = require("../../helpers/db");
const logger = require("../../helpers/logger");
class MarketController {
  constructor() {
    this.market = new ServiceSQL("marketplace");
  }

  getModule = async (req, res) => {
    await this.market
      .checkExist()

      .then(async () => {
        let token = req.session.token;
        let dataSession = req.session;
        const role = req.session.rol_id
        let dataSistema = await getDataSistema(req.session.token);
        if (role == 1 || role == 2) {
          res.render("modulo-superadmin/marketplace/admin-marketplace", {
            dataSession,
            dataSistema,
          });
        } else {

          res.status(403);
          res.render('403');
        }


      })

      .catch((error) => {
        logger.error("Error al guardar : ", error);
        res.status(400).json({
          ok: false,
          msg: error,
        });
      });
  };
  getData = async (req, res) => {
    try {
      const result = await this.market.getAll();
      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }

  };
  save = async (req, res) => {
    try {
      const result = await this.market.updateById(1, req.body);
      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      logger.error("Error al guardar obtener empresa por ID: ", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };
}

module.exports = MarketController;
