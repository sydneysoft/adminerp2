const ServiceSQL = require('../../services/services');
const logger = require('../../helpers/logger');
const { validationResult } = require('express-validator');
const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');


class PermisosController {
  constructor() {
    // table have, nombre identificador
    this.permisos = new ServiceSQL('permisos');

    // table have, rol_id permiso_id
    this.rol_permisos = new ServiceSQL('rol_permisos');

    this.createPermisos = this.createPermisos.bind(this);
    this.deletePermiso = this.deletePermiso.bind(this);
    this.getPermisosByIds = this.getPermisosByIds.bind(this);
    this.getPermisos = this.getPermisos.bind(this);
  }
  
  /**
   * El siguiente metodo crea una serie de permisos a partir de un array [{nombre, identificador}]
   * Comprueba que no existan permisos con el mismo identificador
   *  @param {Array} permisos
   */
  
  async createPermisos(permisos) {
    try {
      const identificadores = permisos.map((permiso) => permiso.identificador);
      const permisosExistentes = await this.permisos.getTable().whereIn('identificador', identificadores);
      if (permisosExistentes.length > 0) {
        return {
          status: 400,
          message: 'Ya existen permisos con los identificadores proporcionados',
          permisos: permisosExistentes,
        };
      }
      const permisosCreados = await this.permisos.save(permisos);
      return {
        status: 200,
        message: 'Permisos creados correctamente',
        permisos: permisosCreados,
      };

    } catch (error) {
      logger.error(error);
      return error;
    }
  }

  /**
   * El siguiente metodo elimina un permiso mediante su identificador
   * @param {String} identificador
   * @returns {Object} {status, message, permiso}
   * 
   */

  async deletePermiso(identificador) {
    try {
      const permiso = await this.permisos.getTable().where('identificador', identificador).first();
      if (!permiso) {
        return {
          status: 404,
          message: 'El permiso no existe',
        };
      }
      await this.permisos.deleteById(permiso.id);
      return {
        status: 200,
        message: 'Permiso eliminado correctamente',
        permiso,
      };
    } catch (error) {
      logger.error(error);
      return error;
    }
  }

  /**
   * El siguiente metodo obtiene los permisos a partir de sus ID
   */
  async getPermisosByIds(ids) {
    try {
      const permisos = await this.permisos.getTable().whereIn('id', ids);
      return permisos;
    } catch (error) {
      logger.error(error);
      return error;
    }
  }

  /** 
   * El siguiente metodo obtiene los permisos de un rol
  */
  async getPermisos(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { role, token } = await getAllDataSession(req);
      if (role == 1) {
        const permisos = await this.permisos.getAll();
        return res.status(200).json({
          ok: true,
          msg: 'Permisos obtenidos correctamente',
          permisos,
        });
      }
      
      return res.status(401).json({
        ok: false,
        msg: 'No autorizado'
      });

    } catch (error) {
      return catchError(res, error);
    }
  }
}

module.exports = { PermisosController }