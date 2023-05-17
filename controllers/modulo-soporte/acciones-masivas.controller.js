const ServiceSQL = require("../../services/services");
const logger = require("../../helpers/logger");

class AccionesMasivasController {
  constructor() { }

  eliminar = async (req, res) => {
    await new ServiceSQL(req.body.db)
      .eliminarIds(req.body.val)
      .then(async (data) => {
        res.status(200).json({
          msg: data,
        });
      })

      .catch((error) => {
        logger.error("Error el eliminar accion masiva: ", error);
        res.status(400).send(error);
      });
  };
  borrador = async (req, res) => {
    await new ServiceSQL(req.body.db)
      .borrador(req.body.val)
      .then(async (data) => {
        res.status(200).json({
          msg: data,
        });
      })

      .catch((error) => {
        logger.error("Error en cambiar a borrador accion masiva: ", error);
        res.status(400).json({ error: detectado });
      });
  };
  publicar = async (req, res) => {
    await new ServiceSQL(req.body.db)
      .publicar(req.body.val)
      .then(async (data) => {
        res.status(200).json({
          msg: data,
        });
      })

      .catch((error) => {
        logger.error("Error en cambiar a publicar accion masiva: ", error);
        res.status(400).json({ error: detectado });
      });
  };
}

module.exports = AccionesMasivasController;
