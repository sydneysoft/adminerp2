const RestBuilder = require('../../builder.controller');

class ServicioController extends RestBuilder {
  constructor() {
    super();
    this.setTable('servicios').setName('Servicio');
    this.servicios_metodos = this.setService('servicios_metodos');
  }

  deleteDelivery = async (req, res) => {
    try {
      const id = req.params.id;
      if (!isNaN(id)) {
        await this.service.deleteById(id)
        await this.servicios_metodos.deleteByIdServicio(id)
        return res.json({
          status: "success",
          msg: "Se eliminaron los registros correctamente",
        });
      } else {
        return res.json({
          status: "error",
          msg: "Error al ejecutar acción requerida",
        });
      }
    } catch (error) {
      return this.catchError(res, error);
    }
  }

  saveDelivery = async (req, res) => {
    try {
      let result

      let {role, token} = this.getRolAndToken(req);
      let empresa_id = 0;

      if (role == 1 || role == 2) {
        if (req.body.empresa_id) {
          empresa_id = req.body.empresa_id;
        }
      } else if (role == 3) {
        empresa_id = token;
      }
      
      result = await this.service.save({ nombre: req.body.nombre, telefono: req.body.telefono, empresa_id})

      let metodos = req.body.metodos;

      for (let i = 0; metodos.length > i; i++) {
        await this.servicios_metodos.save({ id_servicio: result, id_metodo: metodos[i], empresa_id})
      }

      res.json({
        status: "success",
        msg: "Actualizada correctamente",
      });

    } catch (error) {
      return this.catchError(res, error);
    }
  }
}

module.exports = { ServicioController }
