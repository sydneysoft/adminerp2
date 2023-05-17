const ServiceSQL = require('../../services/services');
const logger = require('../../helpers/logger');
const { validationResult } = require('express-validator');
const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');

class RestBuilder {
  constructor() {
    this.table = null
    this.name = ''
    this.timestamps = false
    this.pagination = false
    this.service = null
    this.views = {
      create: false,
      edite: false,
      show: false,
      index: false
    }
    this.empresa_usuario = new ServiceSQL('empresa_usuario');
    this.view = false // Se usa para generar vistas dinamicamente
    this.data = {}
  }

  setTable = (table) => {
    this.table = table
    this.service = new ServiceSQL(this.table)
    return this
  }

  setName = (name) => {
    this.name = name + ' '
    return this
  }

  setTimeStamps = () => {
    this.timestamps = true
    return this
  }

  setPagination = () => {
    this.pagination = true
    return this
  }

  setCreateView = (render) => {
    this.views.create = render
    return this
  }

  setEditeView = (render) => {
    this.views.edite = render
    return this
  }

  setShowView = (render) => {
    this.views.show = render
    return this
  }
  setIndexView = (render) => {
    this.views.index = render
    return this
  }
  build = async () => {
    return this
  }

  // métodos para renderizar vistas.

  createView = async (req, res, next) => {
    if (this.views.create) {
      try {
        const { dataSession, dataSistema } = await getAllDataSession(req);
        res.render(this.views.create, {
          dataSession,
          dataSistema
        })
      } catch (error) {
        catchError(res, error)
      }
    } else {
      next(new Error(`Vista para crear ${this.name}no disponible`));
    }
  }

  editeView = async (req, res, next) => {
    if (this.views.edite) {
      try {
        const { token, dataSession, dataSistema, role } = await getAllDataSession(req);

        const id = req.params.id
        const data = await this.service.getById(id);

        if (role == 1 || role == 2) {
          return res.render(this.views.edite, {
            dataSession,
            dataSistema,
            data: data[0]
          })
        } else if(Array.isArray(data) && data.length > 0) {

          if (data[0].empresa_id == token) {
            return res.render(this.views.edite, {
              dataSession,
              dataSistema,
              data: data[0]
            })
          } else {
            return notAuthorize(res)
          }
        }

      } catch (error) {
        catchError(res, error)
      }
    } else {
      next(new Error(`Vista para editar ${this.name}no disponible`));
    }
  }

  showView = async (req, res, next) => {
    if (this.views.show) {
      try {
        const { token, dataSession, dataSistema, role } = await getAllDataSession(req);

        const id = req.params.id
        const data = await this.service.getById(id);

        if (role == 1 || role == 2) {
          return res.render(this.views.show, {
            dataSession,
            dataSistema,
            data: data[0]
          })
        } else if(Array.isArray(data) && data.length > 0) {

          if (data[0].empresa_id == token) {
            return res.render(this.views.show, {
              dataSession,
              dataSistema,
              data: data[0]
            })
          } else {
            return notAuthorize(res)
          }
        }
      } catch (error) {
        catchError(res, error);
      }
    } else {
      next(new Error(`Vista para ver ${this.name}no disponible`));
    }
  }

  indexView = async (req, res, next) => {
    if (this.views.index) {
      try {
        const { token, dataSession, dataSistema, role } = await getAllDataSession(req);
        let data = []
        if (role == 1 || role == 2) {
          data = await this.service.getAll()
        }
        else if (role == 3) {
          data = await this.service.getbyCompany(token)

        }
        res.render(this.views.index, {
          dataSistema,
          dataSession,
          data
        })
      } catch (error) {
        catchError(res, error);
      }
    } else {
      next(new Error(`Vista para ver ${this.name}no disponible`));
    }
  }

  // Métodos para la API

  index = async (req, res, next) => {

    try {
      const queryParams = req.query
      let offset = 0, limit = 20
      let url = null, next = null, previuos = null
      if (queryParams.offset !== undefined) {
        offset = parseInt(queryParams.offset)
      }
      if (queryParams.limit !== undefined) {
        limit = parseInt(queryParams.limit)
      }

      url = `?offset=${offset}&limit=${limit}`
      next = `?offset=${offset + limit}&limit=${limit}`

      if (offset > 0) {
        previuos = `?offset=${offset - limit}&limit=${limit}`
      }
      let preData = []
      const { token, role } = await getAllDataSession(req);
      if (role == 1) {
        preData = await this.service.getTable().limit(limit).offset(offset)
      } else if (role === 2) {
        preData = await this.service.getTable().where('empresa_id', token).limit(limit).offset(offset);
      }
      else if (role == 3) {
        preData = await this.service.getTable().where('empresa_id', token).limit(limit).offset(offset);
      }
      if (preData.length > 0) {
        const data = preData.map(pre => pre)

        const count = Object.values((await this.service.count())[0])[0]

        if ((offset >= count - offset && (count - offset) <= limit) || limit > count) {
          next = null
        }
        if (this.pagination) {
          res.status(200).json({
            count,
            url,
            next,
            previuos,
            data
          })
        } else {
          res.json({
            data
          })
        }

      } else {
        if (this.pagination) {
          res.json({
            count: 0,
            url: null,
            next: null,
            previuos: null,
            data: []
          })
        } else {
          res.json({ data: [] })
        }
      }

    } catch (error) {
      catchError(res, error);
    }
  }

  save = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      await this.service.checkExist().then(async () => {
        const { token, role } = await getAllDataSession(req);
        const date = new Date()
        const data = {
          ...req.body
        }
        console.log(data);
        if (this.timestamps) {
          data.created_at = date
          data.updated_at = date
        }
        let result = null

        if (role == 1 || role == 2) {
          result = await this.service.save(data)
        } else if (role == 3) {
          data.empresa_id = token
          result = await this.service.save(data)
        }

        if (result !== null) {
          return res.status(201).json({
            ok: true,
            id: result[0],
            msg: `${this.name} creado correctamente`
          })
        } else {
          return notAuthorize(res);
        }
      })
    } catch (error) {
      catchError(res, error);
    }
  }

  show = async (req, res, next) => {
    try {
      const id = req.params.id
      const data = await this.service.getById(id)
      if (data.length === 1) {
        res.status(200).json(data[0])
      } else {
        res.status(404).json({
          ok: false,
          msg: `${this.name} con id ${id} no encontrad@.`
        })
      }
    } catch (error) {
      catchError(res, error);
    }
  }

  update = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { token, role } = await getAllDataSession(req);
      const id = req.params.id
      const dataFind = await this.service.getById(id)
      if (dataFind.length === 1) {

        let result = null
        const data = {
          ...req.body
        }
        if (this.timestamps) {
          const date = new Date()
          data.updated_at = date
        }
        if (role == 1 || role == 2) {
          result = await this.service.updateById(id, data)
        } else if (role == 3 && dataFind[0].empresa_id == token) {
          result = await this.service.updateById(id, data)
        }
        if (result !== null) {
          return res.json({
            ok: true,
            msg: `${this.name} actualizado con exito.`,
            id,
            data
          })
        } else {
          return notAuthorize(res)
        }
      } else {
        res.status(404).json({
          ok: false,
          msg: `Error al actualizar ${this.name}con id ${id} no encontrada.`
        })
      }
    } catch (error) {
      catchError(res, error);
    }
  }

  delete = async (req, res, next) => {
    try {
      const { token, role } = await getAllDataSession(req);
      const id = req.params.id
      const data = await this.service.getById(id)
      if (data.length > 0) {
        let deleteData = null

        if (role == 1 || role == 2) {
          deleteData = await this.service.deleteById(id)
        } else if (role == 3 && data[0].empresa_id == token) {
          deleteData = await this.service.deleteById(id)
        }

        if (deleteData !== null) {
          return res.status(200).json({
            ok: true,
            id,
            msg: `${this.name}con id ${id} se ha borrado exitosamente.`,
            data: data[0]
          })
        } else {
          return notAuthorize(res)
        }
      } else {
        res.status(404).json({
          ok: false,
          msg: `${this.name}con id ${id} no existe.`
        })
      }
    } catch (error) {
      catchError(res, error);
    }

  }

  generateView = (view, data = {}) => {
    this.view = view
    this.data = data
    return this
  }

  render = async (req, res, next) => {
    if (this.view) {
      try {
        const view = this.view
        const data = this.data
        this.view = false
        this.data = {}
        const { token, dataSession, dataSistema, role } = await getAllDataSession(req);
        res.render(view, {
          dataSession,
          dataSistema,
          ...data
        })
      } catch (error) {
        catchError(res, error)
      }
    } else {
      next(new Error(`No se proporciono una vista.`));
    }
  }

  datatable = async (req, res, next) => {
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
          auxCount = await this.service.getByColumn({ column: 'empresa_id', value: token }).count();
        } else {
          auxCount = await this.service.getTable().count();
        }
      } else if (role === 3) {
        auxCount = await this.service.getByColumn({ column: 'empresa_id', value: token }).count();
      }

      if (auxCount !== undefined) {
        count = Object.values(auxCount[0])[0]
      }
      let data = {};
      
      if (!token) {

        data = await this.service.getTable().where(function () {
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
        data = await this.service.getByColumn({column: 'empresa_id', value: token}).where(function () {
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


module.exports = RestBuilder