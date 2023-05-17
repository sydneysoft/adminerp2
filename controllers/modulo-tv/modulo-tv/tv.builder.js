const ServiceSQL = require('../../../services/services')
const logger = require('../../../helpers/logger')
const { getDataSistema } = require("../../../helpers/db")
const {validationResult} = require('express-validator')

class TVRouteBuilder {
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
        const token = req.session.token || '';
        const dataSession = req.session;
        const dataSistema = await getDataSistema(token);
        res.render(this.views.create, {
          dataSession,
          dataSistema
        })
      } catch (error) {
        logger.error("Error: ", error);
        res.status(400).json({
          ok: false,
          msg: error.message,
        });
      }
    } else {
      next(new Error(`Vista para crear ${this.name}no disponible`));
    }
  }

  editeView = async (req, res, next) => {
    if (this.views.edite) {
      try {
        const token = req.session.token || ''
        const dataSession = req.session
        const dataSistema = await getDataSistema(req.session.token);
        if (token) {
          const id = req.params.id
          const data = await this.service.getById(id)
          res.render(this.views.edite, {
            dataSession,
            dataSistema,
            data: data[0]
          })
        } else {
          res.redirect('/')
        }
      } catch (error) {
        logger.error("Error: ", error);
        res.status(400).json({
          ok: false,
          msg: error.message,
        });
      }
    } else {
      next(new Error(`Vista para editar ${this.name}no disponible`));
    }
  }

  showView = async (req, res, next) => {
    if (this.views.show) {
      try {
        const token = req.session.token || ''
        const dataSession = req.session;
        const dataSistema = await getDataSistema(req.session.token)
        if (token) {
          const id = req.params.id
          const data = await this.service.getById(id)

          res.render(this.views.show, {
            dataSistema,
            dataSession,
            data: data[0]
          })
        } else {
          res.redirect('/')
        }
      } catch (error) {
        logger.error("Error: ", error);
        res.status(400).json({
          ok: false,
          msg: error.message,
        });
      }
    } else {
      next(new Error(`Vista para ver ${this.name}no disponible`));
    }
  }

  indexView = async (req, res, next) => {
    if(this.views.index) {
      try {
        const token = req.session.token || ''
        const dataSession = req.session;
        const dataSistema = await getDataSistema(req.session.token)
        if (token) {
          const data = await this.service.getAll()
          res.render(this.views.index, {
            dataSistema,
            dataSession,
            data
          })
        } else {
          res.redirect('/')
        }
      } catch (error) {
        logger.error("Error: ", error);
        res.status(400).json({
          ok: false,
          msg: error.message,
        });
      }
    }else {
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

      const preData = await this.service.getTable().limit(limit).offset(offset)

      if (preData.length > 0) {
        const data = preData.map(pre => pre)

        const count = Object.values((await this.service.count())[0])[0]

        if ((offset >= count - offset && (count - offset) <= limit)  || limit > count) {
          next = null
        }
        res.status(200).json({
          count,
          url,
          next,
          previuos,
          data
        })

      } else {
        res.status(200).json({
          count: 0,
          url: null,
          next: null,
          previuos: null,
          data: []
        })
      }

    } catch (error) {
      logger.error(error)
      res.status(400).json({
        ok: false,
        msg: `Error al obtener ${this.name}.`
      })
    }
  }

  save = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      await this.service.checkExist().then(async () => {
        const data = {
          ...req.body
        }
        
        if(this.timestamps) {
          const date = new Date()
          data.created_at = date;
          data.updated_at = date;
        }

        const result = await this.service.save(data)
        return res.status(201).json({
          ok: true,
          id: result[0],
          msg: `${this.name} creado correctamente`
        })
      })
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: error.message
      })
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
      res.status(400).json({
        ok: false,
        msg: error.message
      })
    }
  }

  update = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const id = req.params.id
      let data = await this.service.getById(id)
      if (data.length === 1) {
        const data = {
          ...req.body
        }
        if(this.timestamps) {
          const date = new Date()
          data.updated_at = date;
        }
        const result = await this.service.updateById(id, data)
        logger.info(result, req.body)
        res.status(200).json({
          ok: true,
          msg: `${this.name} actualizado con exito.`
        })
      } else {
        res.status(404).json({
          ok: false,
          msg: `Error al actualizar ${this.name}con id ${id} no encontrada.`
        })
      }
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: error.message
      })
    }
  }

  delete = async (req, res, next) => {
    try {
      const id = req.params.id
      const data = await this.service.getById(id)
      const deletedata = await this.service.deleteById(id)
      if (deletedata == 1) {
        res.status(200).json({
          ok: true,
          msg: `${this.name}con id ${id} se ha borrado exitosamente.`,
          data: data[0]
        })
      } else {
        res.status(404).json({
          ok: false,
          msg: `${this.name}con id ${id} no existe.`
        })
      }
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: error.message
      })
    }

  }

  // Metodo para generar la tabla en la base de datos
  generateTable = async (req, res, next) => {
    try {
      this.service.checkExist().then((value) => {
        logger.info(value)
        res.json(value)
      }).catch(error => {
        logger.error(error)
        res.json(error)
      })
    } catch (error) {
      logger.error("Error: ", error);
      res.status(400).json({
        ok: false,
        msg: error.message,
      });
    }
  }

}


module.exports = TVRouteBuilder