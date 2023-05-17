const { getDataSistema } = require("../../helpers/db");
const ServiceSQL = require("../../services/services");
let Country = require("country-state-city").Country;
let State = require("country-state-city").State;
const logger = require("../../helpers/logger");
class StoreController {
  constructor() {
    this.service = new ServiceSQL("almacenes");
    this.company = new ServiceSQL("empresas_marketplace");
    this.marketplace = new ServiceSQL("marketplace");

  }
  showModule = async (req, res) => {
    await this.service
      .checkExist()

      .then(async () => {
        const role = req.session.rol_id
        let token = req.session.token;
        let dataSession = req.session;
        let dataSistema = await getDataSistema(req.session.token);
        let stores;
        let countries;
        let empresas;
        let activo_marketplace;



        try {
          if (role == 1 || role == 2) {
            activo_marketplace = await this.marketplace.getById(1);
            activo_marketplace = activo_marketplace[0].habilitado
            stores = await this.service.getAll();
            empresas = await this.company.getAll();
            token = 0
          } else if (role == 3) {

            activo_marketplace = 0
            stores = await this.service.getbyCompany(token);
            empresas = null

          }
          countries = await Country.getAllCountries();


          if (role == 1 || role == 2 || role == 3) {
            res.render("modulo-ecommerce/almacenes/admin-almacenes", {
              res,
              stores,
              dataSession,
              dataSistema,
              empresas,
              activo_marketplace,
              req,
              countries,
              token
            });
          } else {

            res.status(403);
            res.render('403');
          }

        } catch (error) {
          logger.error("Error al obtener almacenes: ", error);
          res.status(400).json({
            ok: false,
            msg: error,
          });
        }

      })


      .catch((error) => {
        logger.error("Error al obtener almacenes: ", error);
        res.status(400).json({
          ok: false,
          msg: error,
        });
      });
  };

  getAll = async (req, res) => {
    let data
    const role = req.session.rol_id
    let token = req.session.token;
    try {


      if (role == 1 || role == 2) {
        data = await this.service.getAll();
      } else if (role == 3) {
        data = await this.service.getByCompany(token);
      }

      res.status(200).json(data);

    } catch (error) {
      logger.error("Error al obtener almacenes: ", error);
      res.status(400).json({
        msg: error,
      });
    }
  };
  getState = async (req, res) => {
    const id = req.params.id;
    let list;
    try {
      return res.status(200).json(State.getStatesOfCountry(id));
    } catch (error) {
      logger.error("Error al obtener estado: ", error);
    }
  };
  getByStore = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await this.service.getById(id);
      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      logger.error("Error al obtener id almacenes: ", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };
  getByCompany = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await this.service.getbyCompany(id);
      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      logger.error("Error al obtener id por compania en almacenes: ", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };
  updateStore = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await this.service.updateById(id, req.body);
      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      logger.error("Error al actualizar en almacenes: ", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };

  saveStore = async (req, res) => {
    try {
      const result = await this.service.save(req.body);
      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      logger.error("Error al guardar en almacenes: ", error);

      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };

  deleteById = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await this.service.deleteById(id);
      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      logger.error("Error al borrar por id en almacenes: ", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };
}

module.exports = StoreController;
