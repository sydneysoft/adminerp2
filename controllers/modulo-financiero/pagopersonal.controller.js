const { getDataSistema } = require("../../helpers/db");
const ServiceSQL = require("../../services/services");
const logger = require("../../helpers/logger");
class PersonalController {
  constructor() {
    this.service = new ServiceSQL("pago_personal");
    this.personal = new ServiceSQL("personal");
    this.empresas = new ServiceSQL("empresas_marketplace");
    this.marketplace = new ServiceSQL("marketplace");
  }
  showModule = async (req, res) => {
    const role = req.session.rol_id


    let token = req.session.token;
    let dataSession = req.session;
    let dataSistema = await getDataSistema(req.session.token);
    let personalData
    let personalInfo
    let empresas

    let activo_marketplace

    try {
      if (role == 1 || role == 2) {
        token = 0
        personalData = await this.service.getAll();
        personalInfo = await this.personal.getAll();
        empresas = await this.empresas.getAll();
        activo_marketplace = await this.marketplace.getById(1);
        activo_marketplace = activo_marketplace[0].habilitado


        if (activo_marketplace === 0) {

          personalData = personalData.filter(i => i.empresa_id == 0)
          personalInfo = personalInfo.filter(i => i.empresa_id == 0)


        }
      } else if (role == 3) {
        personalData = await this.service.getbyCompany(token);
        personalInfo = await this.personal.getbyCompany(token)
        empresas = null
        activo_marketplace = false
      }


      res.render("modulo-financiero/pago-personal/admin-personal", {
        res,
        personalData,
        personalInfo,
        dataSession,
        dataSistema,
        empresas,
        activo_marketplace,
        token

      });
    } catch (error) {
      logger.error("Error al obtener pagos proveedores: ", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }



  };

  getByPersonal = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await this.service.getById(id);

      return res.status(200).json({
        ok: true,
        result
      });
    } catch (error) {
      logger.error("Error al obtener personal: ", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };
  getByDataPersonal = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await this.personal.getById(id);

      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      logger.error("Error al obtener data por id personal: ", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };
  updatePersonal = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await this.service.updateById(id, req.body);
      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      logger.error("Error al actualizar pago personal: ", error);
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };

  savePersonal = async (req, res) => {
    try {
      const result = await this.service.save(req.body);

      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      logger.error("Error al guardar pago personal: ", error);

      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };
  saveNewPersonal = async (req, res) => {
    try {
      const result = await this.personal.save(req.body);
      return res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      logger.error("Error al guardar pago personal: ", error);

      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };
  deleteById = async (req, res, next) => {
    const itemId = parseInt(req.params.id);

    await this.service
      .deleteById(itemId)
      .then((deleteCount) =>
        res.json({
          ok: true,
          message: `Item '${itemId}' deleted`,
          deleteCount,
        })
      )
      .catch(next);
  };

  deleteNewPersonal = async (req, res, next) => {
    const itemId = parseInt(req.params.id);

    await this.personal
      .deleteByConditionDoc(itemId)

      .then(() =>
        this.service.deleteByConditionDoc(itemId)

      )
      .then((deleteCount) =>
        res.json({
          ok: true,
          message: `Item '${itemId}' deleted`,
          deleteCount,
        }))

      .catch(next);
  };
}

module.exports = PersonalController;
