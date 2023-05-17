const ServiceSQL = require('../../../services/services');

const {catchError, getAllDataSession, notAuthorize} = require('../../../helpers/modulo-tv/basicrequest.helpers')


/**
 * El metodo indexShow debe tener el middleware isAdmin en la ruta
 */
class UsuarioController {
  constructor () {
    this.service = new ServiceSQL('usuarios');
    this.modulos = new ServiceSQL('modulos');
  }

  indexShow = async (req, res) => {
    try {
      const { dataSistema, dataSession} = await getAllDataSession(req);
      const empresas = await this.service.getAll();
      return res.render('modulo-tv/modulo-superadmin/modusuario/modusuario', {
        dataSession, 
        dataSistema,
        empresas: empresas.filter(val => {
          if(val.rol != 'superadmin' && val.rol != 'admin') {
            return val
          }
        })
      })
    } catch (error) {
      return catchError(res, error);
    }
  }
  /**
   * Este metodo permite mostrar los id y nombre de los modulos existentes
   */
  userShow = async (req, res) => {
    try {
      const { dataSistema, dataSession} = await getAllDataSession(req);
      const { id } = req.params;

      const modulos = await this.modulos.getSelectColumns(['id', 'nombre']);
      const usuario = await this.service.getById(id);

      if(usuario.length === 1) {
        return res.render('modulo-tv/modulo-superadmin/modusuario/modusuario-editar', {
          dataSession, 
          dataSistema,
          modulos,
          empresa: usuario[0]
        })
      }else {
        res.json({
          ok: false,
          msg: 'El usuario no existe'
        })
      }
    } catch (error) {
      return catchError(res, error);
    }
  }

  /**
   * El body modulos debe ser un arreglo de enteros equivalentes a los id de cada modulo
   */
  update = async (req, res) => {
    try {
      const { modulos } = req.body;
      const id = req.params.id
      let result = 0;
      if(Array.isArray(modulos)) {
        const modulosArray = []
        const modulosUsuario = []
        for(let i=0;i < modulos.length; i++) {
          modulosArray.push(parseInt(modulos[i]))
        }
        const resultadoModulo = await this.modulos.getTable().whereIn('id', modulosArray);
        if(resultadoModulo.length > 0) {
          for(let i = 0; i < resultadoModulo.length; i++) {
            modulosUsuario.push(resultadoModulo[i].id)
          }
        }
        result = await this.service.updateById(id, {
          modulos: JSON.stringify(modulosUsuario)
        });
      }else {
        result = await this.service.updateById(id, {
          modulos: JSON.stringify([])
        });
      }
      if(result === 1) {
        res.json({
          ok: true,
          msg: "Modulos actualizados"
        })
      } else {
        res.json({
          ok: false,
          msg: "No se ha podido actualizar al usuario"
        })
      }
    } catch (error) {
      return catchError(res, error);
    }
  }
}


module.exports = { UsuarioController }
