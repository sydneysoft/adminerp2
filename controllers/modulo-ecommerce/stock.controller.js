const ServiceSQL = require("../../services/services");

class StoreController {
  constructor() {
    this.service = new ServiceSQL("stock");
  }

  getAll = async (req, res) => {
    try {
      await this.service
        .checkExist()
        .then(async () => {
          const data = await this.service.getAll();
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(400).json({
            msg: error,
          });
        });
    } catch (error) {
      res.status(400).json({
        msg: error,
      });
    }
  };

  getById = async (req, res) => {

    const id = parseInt(req.params.id);
    try {
      await this.service
        .getbyCondition(id)
        .then((data) => res.json(data));
    } catch (error) {

      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };
  update = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await this.service.updateById(id, req.body);
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
      await this.service.checkExist().then(async () => {
        const result = await this.service.saveAll(req.body);
        return res.status(200).json({
          ok: true,
          result,
        });
      });
    } catch (error) {


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
      return res
        .status(200)
        .json({
          ok: true,
          result,
        })
        .catch((error) => {
          res.status(400).json({
            ok: false,
            msg: error,
          });
        });
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  };
}

module.exports = StoreController;
