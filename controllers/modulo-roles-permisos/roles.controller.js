const ServiceSQL = require('../../services/services');
const logger = require('../../helpers/logger');
const { validationResult } = require('express-validator');
const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');


class RolesController {

  constructor() {
    // table have, nombre identificador empresa_id
    this.roles = new ServiceSQL('roles');

    // table have, nombre identificador empresa_id
    this.rol_permisos = new ServiceSQL('rol_permisos');

    // table have, rol_id, modelo_id modelo
    // modelo_id se refiere al id del modelo en la tabla de modelos
    // ejemplo: modelo -> usuarios modelo_id -> 1 (id tabla usuarios)
    this.rol_modelos = new ServiceSQL('rol_modelos');

    this.createRol = this.createRol.bind(this);
    this.updateRol = this.updateRol.bind(this);
    this.deleteRol = this.deleteRol.bind(this);
    this.asignarPermisos = this.asignarPermisos.bind(this);
    this.getPermisos = this.getPermisos.bind(this);
    this.getRoles = this.getRoles.bind(this);
    this.getRol = this.getRol.bind(this);
    this.getRolByModelo = this.getRolByModelo.bind(this);
    this.asignarRolModelo = this.asignarRolModelo.bind(this);
    this.deleteRolModelo = this.deleteRolModelo.bind(this);
    this.datatable = this.datatable.bind(this);
  }

  async getRoles(req, res) {

    try {
      const { empresa_id } = getAllDataSession(req);
      const roles = await this.roles.getbyCompany(empresa_id);
      res.status(200).json({ roles });
    } catch (error) {
      catchError(res, error);
    }
  }

  async getRol(req, res) {
    try {
      const { id } = req.params;
      const rol = await this.roles.getbyId(id);
      res.status(200).json({ rol });
    } catch (error) {
      catchError(res, error);
    }
  }

  /**
   * El siguiente metodo crea un rol, recibe {nombre, identificador ,empresa_id}
   */
  async createRol(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { role, token, empresa_id } = getAllDataSession(req);

      const { nombre, id, identificador } = req.body;
      if (empresa_id) {
        let auxIdentificador = (new Date()).getTime().toString() + '.' + identificador;
        if (id == empresa_id) {
          const rol = await this.roles.save({ nombre, identificador: auxIdentificador, empresa_id });
          return res.status(200).json({ ok: true, rol });
        }
        // if (role == 1) {
        //   const rol = await this.roles.save({ nombre, identificador: auxIdentificador, empresa_id: id });
        //   return res.json({ ok: true, rol });
        // }
      } else {
        const modelo_id = req.params.id; // uso modelo_id, pero hace referencia a empresa_id
        let auxIdentificador = (new Date()).getTime().toString() + '.' + identificador;
        await this.roles.save({ nombre, identificador: auxIdentificador, empresa_id: modelo_id });
        const rol = await this.roles.getTable().where('identificador', auxIdentificador);
        return res.status(200).json({ ok: true, rol: rol[0] });
      }
      return res.status(400).json({ ok: false, message: 'No tiene permisos para crear roles' });
    } catch (error) {
      catchError(res, error);
    }
  }

  /**
   * El siguiente metodo actualiza un rol, recibe {nombre, identificador}
   *  
   * Anres de actualizar comprueba que exista y sea de la empresa
   */
  async updateRol(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { token, empresa_id } = getAllDataSession(req);
      if (!token) {
        return notAuthorize(res);
      }
      // const { id } = req.params;
      const { nombre, identificador } = req.body;
      const exists = await this.roles.getTable().where('identificador', identificador);

      if (exists.length > 0 && exists[0].empresa_id == empresa_id) {
        const rol = await this.roles.updateBy({ nombre }).where('identificador', identificador);
        if (rol > 0) {
          return res.status(200).json({
            ok: true,
            rol: {
              ...exists[0],
              nombre
            }
          });
        }
        return res.status(400).json({ ok: false, msg: 'No se pudo actualizar el rol' });
      }
      return res.status(400).json({ ok: false, msg: 'No se encontro el rol' });

    } catch (error) {
      catchError(res, error);
    }
  }

  /**
   * El siguiente metodo elimina un rol, recibe {identificador}
   * Antes de eliminar comprueba que exista y sea de la empresa
   *  
   * Elimina los permisos asociados al rol
   * Elimina el rol
   * 
   * */
  async deleteRol(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { token, empresa_id } = getAllDataSession(req);
      if (!token) {
        return notAuthorize(res);
      }
      const { identificador } = req.body;
      const exists = await this.roles.getTable().where('identificador', identificador);
      if (exists.length > 0 && exists[0].empresa_id == empresa_id) {
        await this.rol_permisos.deleteBy('rol_id', exists[0].id);
        await this.roles.deleteBy().where('identificador', identificador);
        return res.status(200).json({ ok: true, msg: 'Rol eliminado' });
      }
      return res.status(400).json({ ok: false, msg: 'No se encontro el rol' });
    } catch (error) {
      catchError(res, error);
    }
  }

  /**
   * El siguiente metodo asigna permisos a un rol, recibe {identificador, permisos}
   * Antes de asignar comprueba que exista y sea de la empresa
   * 
   * Comprobar que los permisos existan
   * Elimina los permisos asociados al rol
   * Asigna los permisos
   * 
   * */
  async asignarPermisos(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { token, empresa_id } = getAllDataSession(req);
      if (!token) {
        return notAuthorize(res);
      }
      // El identificador aqui es para roles.
      const { identificador, permisos } = req.body;
      const exists = await this.roles.getTable().where('identificador', identificador);

      // permisos tiene esta estructura [{id: 1, identificador: 'identificador'}]
      const permisions_exists = await this.permisos.getTable().whereIn(['id', 'identificador'], permisos.map(p => [p.id, p.identificador]));

      if (exists.length > 0 && exists[0].empresa_id == empresa_id && permisions_exists.length == permisos.length) {
        await this.rol_permisos.deleteBy().where('rol_id', exists[0].id);
        const permisos_asignados = await this.rol_permisos.save(permisos.map(p => ({ rol_id: exists[0].id, permiso_id: p.id })));
        return res.status(200).json({ ok: true, permisos_asignados });
      }

    } catch (error) {
      catchError(res, error);
    }
  }

  /**
   * El siguiente metodo obtiene los permisos de un rol, recibe {identificador}
   * Antes de obtener comprueba que exista y sea de la empresa
   * 
   * Obtiene los permisos asociados al rol
   * 
   * */
  async getPermisos(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { token, empresa_id } = getAllDataSession(req);
      if (!token) {
        return notAuthorize(res);
      }
      // El identificador aqui es para roles.
      const { identificador } = req.query;
      const exists = await this.roles.getTable().where('identificador', identificador);
      if (exists.length > 0 && exists[0].empresa_id == empresa_id) {
        const permisos = await this.rol_permisos.getTable().select(['identificador']).where('rol_id', exists[0].id);
        return res.status(200).json({ ok: true, permisos });
      }
      return res.status(400).json({ ok: false, msg: 'No se encontro el rol' });
    } catch (error) {
      catchError(res, error);
    }
  }

  /**
   * El siguiente metodo obtiene los roles de una empresa, recibe {empresa_id}
   * Antes de obtener comprueba que exista y sea de la empresa
   * 
   * Obtiene los roles asociados a la empresa
   * 
   * */
  async getRoles(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { role, token, empresa_id } = getAllDataSession(req);
      if (!token) {
        return notAuthorize(res);
      }
      if (empresa_id) {
        const roles = await this.roles.getTable().where('empresa_id', empresa_id);
        return res.status(200).json({ ok: true, roles });
      }

      if (role == 1) {
        const id = req.params.id;
        if (id) {
          const roles = await this.roles.getTable().where('empresa_id', id);
          return res.status(200).json({ ok: true, roles });
        } else {
          const roles = await this.roles.getTable();
          return res.status(200).json({ ok: true, roles });
        }
      }


      return res.status(400).json({ ok: false, msg: 'No se encontro la empresa' });
    } catch (error) {
      catchError(res, error);
    }
  }

  /**
   * El siguiente metodo obtiene los roles de una empresa, recibe {empresa_id}
   * Antes de obtener comprueba que exista y sea de la empresa
   * 
   * Obtiene los roles asociados a la empresa
   *  
   * */
  async getRol(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { token, empresa_id } = getAllDataSession(req);
      if (!token) {
        return notAuthorize(res);
      }
      // const { identificador } = req.body;
      const identificador = req.params.identificador;
      const exists = await this.roles.getTable().where('identificador', identificador);
      if (exists.length > 0 && exists[0].empresa_id == empresa_id) {
        return res.status(200).json({ ok: true, rol: exists[0] });
      }
      return res.status(400).json({ ok: false, msg: 'No se encontro el rol' });
    } catch (error) {
      catchError(res, error);
    }
  }

  /**
   * El siguiente metodo obtiene el rol a partir de un modelo, recibe {modelo_id}
   * Antes de obtener comprueba que exista y sea de la empresa
   * 
   * 
   */
  async getRolByModelo(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { token, empresa_id } = getAllDataSession(req);
      if (!token) {
        return notAuthorize(res);
      }
      // const { modelo_id } = req.body;
      const modelo_id = req.params.modelo_id;
      const rol_modelos = await this.rol_modelos.getTable().where('modelo_id', modelo_id);
      if (rol_modelos.length > 0) {
        const roles = await this.roles.getTable().whereIn('id', rol_modelos.map(rm => rm.rol_id));
        return res.status(200).json({ ok: true, roles });
      }

    } catch (error) {
      catchError(res, error);
    }
  }

  /**
   * El siguiente metodo asigna roles a un modelo, recibe {modelo_id, modelo , roles}
   * solo se puede asignar un rol
   * 
   */
  async asignarRolModelo(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { token, empresa_id } = getAllDataSession(req);
      if (!token) {
        return notAuthorize(res);
      }
      const { modelo_id, modelo, roles } = req.body;
      const rol_modelos = await this.rol_modelos.getTable().where('modelo_id', modelo_id);
      if (rol_modelos.length > 0) {
        await this.rol_modelos.deleteBy().where('modelo_id', modelo_id);
      }
      const roles_asignados = await this.rol_modelos.save(roles.map(r => ({ rol_id: r.id, modelo_id, modelo })));
      return res.status(200).json({ ok: true, roles_asignados });
    } catch (error) {
      catchError(res, error);
    }
  }

  /**
   * El siguiente metodo elimina el rol del modelo, recibe {modelo_id, modelo, rol}
   * 
   * Solo se bora si rol_id modelo_id y modelo coinciden
   */

  async deleteRolModelo(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { token, empresa_id } = getAllDataSession(req);
      if (!token) {
        return notAuthorize(res);
      }
      const { modelo_id, modelo, rol_id } = req.body;
      const rol_modelos = await this.rol_modelos.getTable().where('modelo_id', modelo_id).andWhere('modelo', modelo).andWhere('rol_id', rol_id);
      if (rol_modelos.length > 0) {
        await this.rol_modelos.deleteBy().where('modelo_id', modelo_id).andWhere('modelo', modelo).andWhere('rol_id', rol_id);
        return res.status(200).json({ ok: true });
      }
      return res.status(400).json({ ok: false, msg: 'No se encontro el rol' });
    } catch (error) {
      catchError(res, error);
    }
  }

  async datatable (req, res, next)  {
    try {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let { role, token } = await getAllDataSession(req);

      const { draw, start, columns, length, search, order } = req.query;
      let auxCount = undefined;
      let count = 0
      
      if (role === 1 || role === 2) {
        token = null;
        if(req.params.id) {
          token = req.params.id
        }
        if (token) {
          auxCount = await this.roles.getByColumn({ column: 'empresa_id', value: token }).count();
        } else {
          auxCount = await this.roles.getTable().count();
        }
      } else if (role === 3) {
        auxCount = await this.roles.getByColumn({ column: 'empresa_id', value: token }).count();
      }

      if (auxCount !== undefined) {
        count = Object.values(auxCount[0])[0]
      }
      let data = {};
      
      if (!token) {

        data = await this.roles.getTable().where(function () {
          if (search.value) {
            this.where(columns[1].data, 'like', `%${search.value}%`);
            for (let i = 2; i < columns.length; i++) {
              if (columns[i].searchable == 'true') {
                this.orWhere(columns[i].data, 'like', `%${search.value}%`);
              }
            }
          }
        }).offset(start)
          .limit(length)
          .orderBy(columns[order[0].column].data, order[0].dir)
          .then(rows => {
            const data = {
              draw: draw,
              recordsFiltered: rows.length,
              recordsTotal: rows.length,
              data: rows
            }
            return data;
          });
      } else if(role == 3 || token) {
        data = await this.roles.getByColumn({column: 'empresa_id', value: token}).where(function () {
          if (search.value) {
            this.where(columns[1].data, 'like', `%${search.value}%`);
            for (let i = 2; i < columns.length; i++) {
              if (columns[i].searchable == 'true') {
                this.orWhere(columns[i].data, 'like', `%${search.value}%`);
              }
            }
          }
        }).offset(start)
          .limit(length)
          .orderBy(columns[order[0].column].data, order[0].dir)
          .then(rows => {
            const data = {
              draw: draw,
              recordsFiltered: rows.length,
              recordsTotal: rows.length,
              data: rows
            }
            return data;
          });
      }
      res.json({ draw, recordsTotal: count, recordsFiltered: count, data: data.data });
    } catch (error) {
      return catchError(res, error);
    }
  }

}

module.exports = RolesController