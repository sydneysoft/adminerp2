const ServiceSQL = require('../services/services');
const logger = require('../helpers/logger');
const { validationResult, matchedData } = require('express-validator');
const { catchError, getAllDataSession, notAuthorize } = require('../helpers/modulo-tv/basicrequest.helpers');
const { errorHandler } = require("../helpers/errorHandler.helpers");
const {successHandler} = require("../helpers/successHandler.helpers");

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
    this.empresa_id = true;
    this.errorHandler = errorHandler;
    this.successHandler = successHandler;
    this.getAllDataSession = getAllDataSession;
  }

  /**
   * Renderiza una vista con los datos que se le pasen
   * @param {*} res 
   * @param {*} view 
   * @param {*} datos 
   * @returns 
   */
  renderView = (res, view, datos) => {
    return res.render(view, {
      ...datos,
    });
  }

  notCompany = () => {
    this.empresa_id = false;
    return this
  }

  setTable = (table) => {
    this.table = table
    this.service = new ServiceSQL(this.table)
    return this
  }

  setService = (table) => {
    return new ServiceSQL(table);
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

  catchError = (res, error) => {
    return catchError(res, error);
  }

  getRolAndToken = (req) => {
    const rol_id = req.session.rol_id;
    let token = null;
    if (rol_id == 3) {
      token = req.session.token;
    }
    return {
      token,
      role: rol_id
    }
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

  getNamesOfDoctors= async (req, res, next)=>{

    const { token, role } = await getAllDataSession(req);
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
        const allData = matchedData(req)
        const data = {
          // ...req.body
          ...allData
        }
        if (this.timestamps) {
          data.created_at = date
          data.updated_at = date
        }
        let result = null
        
        if (this.empresa_id == false) {
          delete data.empresa_id;
        }

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
        if (this.empresa_id == false) {
          delete data.empresa_id;
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
      let columnsSearch = [];

      if (Array.isArray(columns)) {
        columnsSearch = columns.filter((column) => {
          return column.searchable == 'true';
        })
      }
      
      let whereObject = {};
      
      columnsSearch.forEach((column) => {
        if (column.search.value != ''){
          whereObject[column.name] = column.search.value;
        } else {
          whereObject[column.name] = { like: `%${search.value}%` };
        }
      });

      const [keysWhere, valuesWhere] = [Object.keys(whereObject), Object.values(whereObject)];

      //- Si la tabla tiene empresa_id
      if (this.empresa_id) {
        if (role === 1 || role === 2) {
          token = null;
          if(req.params.id) {
            token = req.params.id
          }
          if (token) {
            // auxCount = await this.service.getByColumn({ column: 'empresa_id', value: token }).count();
            auxCount = await this.service.getTable().modify(function (queryBuilder) {
              // Si existen busqueda por columnas
              for (let i = 0; i < keysWhere.length; i++) {
                if (typeof valuesWhere[i] == 'object' && valuesWhere[i].like != undefined) {
                  if (valuesWhere[i].like != "%%") {
                    queryBuilder.orWhereLike(keysWhere[i], valuesWhere[i].like);
                  }
                } else if (typeof valuesWhere[i] == 'string') {
                  queryBuilder.andWhere(keysWhere[i], valuesWhere[i]);
                }
              }
              queryBuilder.andWhere("empresa_id", token);
            }).count();

          } else {
            auxCount = await this.service.getTable().count();
          }
        } else if (role === 3) {
          // auxCount = await this.service.getByColumn({ column: 'empresa_id', value: token }).count();
          auxCount = await this.service.getTable().modify(function (queryBuilder) {
            // Si existen busqueda por columnas
            for (let i = 0; i < keysWhere.length; i++) {
              if (typeof valuesWhere[i] == 'object' && valuesWhere[i].like != undefined) {
                if (valuesWhere[i].like != "%%") {
                  queryBuilder.orWhereLike(keysWhere[i], valuesWhere[i].like);
                }
              } else if (typeof valuesWhere[i] == 'string') {
                queryBuilder.andWhere(keysWhere[i], valuesWhere[i]);
              }
            }
            queryBuilder.andWhere("empresa_id", token);
          }).count();
        }
      } else { 
        auxCount = await this.service.getTable().count();
      }

      if (auxCount !== undefined) {
        count = Object.values(auxCount[0])[0]
      }
      let data = {};
      
      if (!token) {
        data = await this.service.getTable().modify(function (queryBuilder) {
          // Si existen busqueda por columnas
          for (let i = 0; i < keysWhere.length; i++) {
            if (typeof valuesWhere[i] == 'object' && valuesWhere[i].like != undefined) {
              if (valuesWhere[i].like != "%%") {
                queryBuilder.orWhereLike(keysWhere[i], valuesWhere[i].like);
              }
            } else if (typeof valuesWhere[i] == 'string') {
              queryBuilder.andWhere(keysWhere[i], valuesWhere[i]);
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
        if (this.empresa_id) {
          data = await this.service.getTable().modify(function (queryBuilder) {
            // Si existen busqueda por columnas
            for (let i = 0; i < keysWhere.length; i++) {
              if (typeof valuesWhere[i] == 'object' && valuesWhere[i].like != undefined) {
                if (valuesWhere[i].like != "%%") {
                  queryBuilder.orWhereLike(keysWhere[i], valuesWhere[i].like);
                }
              } else if (typeof valuesWhere[i] == 'string') {
                queryBuilder.andWhere(keysWhere[i], valuesWhere[i]);
              }
            }
            queryBuilder.andWhere("empresa_id", token);
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
        } else {
          data = await this.service.getTable().modify(function (queryBuilder) {
            // Si existen busqueda por columnas
            for (let i = 0; i < keysWhere.length; i++) {
              if (typeof valuesWhere[i] == 'object' && valuesWhere[i].like != undefined) {
                if (valuesWhere[i].like != "%%") {
                  queryBuilder.orWhereLike(keysWhere[i], valuesWhere[i].like);
                }
              } else if (typeof valuesWhere[i] == 'string') {
                queryBuilder.andWhere(keysWhere[i], valuesWhere[i]);
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
      }
      res.json({ draw, recordsTotal: count, recordsFiltered: count, data: data.data });
    } catch (error) {
      return catchError(res, error);
    }
  }

  select2 = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {query, params, body} = req;
      
      // Condiciones para filtros whereObjetc = {column: value}
      let whereObject = {};
      if (query.where) {
        if (typeof query.where === 'string') {
          const auxWhere = JSON.parse(query.where);
          if (Array.isArray(auxWhere) && auxWhere.length > 0) {
            auxWhere.forEach((w) => {
              if (w.search.value != '') {
                whereObject[w.name] = w.search.value;
              }
            })
          } 
        } else {
          if (Array.isArray(query.where) && query.where.length > 0) {
            query.where.forEach((w) => {
              if (w.search.value != '') {
                whereObject[w.name] = w.search.value;
              }
            })
          }
        }
      }
      const [keysWhere, valuesWhere] = [Object.keys(whereObject), Object.values(whereObject)];
      const select = req.query.select;

      let {role, token} = await getAllDataSession(req);

      let data;

      if (this.empresa_id) {
      
        if (role === 1 || role === 2) {
          token = null;
          if(req.params.id) {
            token = req.params.id
          }
          if (token) {
            data = await this.service.getTable().modify(function (queryBuilder) {
              // si se envia un where lo filtra con AND
              for (let i = 0; i < keysWhere.length; i++) {
                queryBuilder.andWhere(keysWhere[i], valuesWhere[i]);
              }
              queryBuilder.andWhere("empresa_id", token);
            }).select(select);
          } else {
            data = await this.service.getTable().modify(function (queryBuilder) {
              // si se envia un where lo filtra con AND
              for (let i = 0; i < keysWhere.length; i++) {
                queryBuilder.andWhere(keysWhere[i], valuesWhere[i]);
              }
              console.log(queryBuilder);

            }).select(select);
          }
        } else if (role === 3) {
          data = await this.service.getTable().modify(function (queryBuilder) {
            // si se envia un where lo filtra con AND
            for (let i = 0; i < keysWhere.length; i++) {
              queryBuilder.andWhere(keysWhere[i], valuesWhere[i]);
            }
            queryBuilder.andWhere("empresa_id", token);
          }).select(select);
        }
      } else {
        data = await this.service.getTable().modify(function (queryBuilder) {
          // si se envia un where lo filtra con AND
          for (let i = 0; i < keysWhere.length; i++) {
            queryBuilder.andWhere(keysWhere[i], valuesWhere[i]);
          }
        }).select(select);
      }

      return res.json({
        ok: true,
        data
      });

    } catch (error) {
      return catchError(res, error);
    }
  }
  
  /**
   * Metodo para obtener los datos para selectPure
   * 
   * @param {*} req  {params: { empresa_id: 'id_empresa'}}}
   *                 {query: {where: [{name: 'empresa_id', search: {value: 'id_empresa'}}], select: {label: 'nombre', value: 'id'}}
   * @param {*} res 
   * @param {*} next 
   * @returns [{label: 'nombre', value: 'id'}]
   */
  selectPure = async (req, res, next) => {
    try {
      let {role, token} = await getAllDataSession(req);

      // Condiciones para filtros whereObjetc = {column: value}
      const query = req.query;
      let whereObject = {};
      if (query.where) {
        if (typeof query.where === 'string') {
          const auxWhere = JSON.parse(query.where);
          if (Array.isArray(auxWhere) && auxWhere.length > 0) {
            auxWhere.forEach((w) => {
              if (w.search.value != '') {
                whereObject[w.name] = w.search.value;
              }
            })
          } 
        } else {
          if (Array.isArray(query.where) && query.where.length > 0) {
            query.where.forEach((w) => {
              if (w.search.value != '') {
                whereObject[w.name] = w.search.value;
              }
            })
          }
        }
      }
      const [keysWhere, valuesWhere] = [Object.keys(whereObject), Object.values(whereObject)];

      if (this.empresa_id) {
        if (role == 1 || role == 2) {
          // para empresa id
          if (req.params.id) {
            token = req.params.id
          } else {
            token = 0;
          }
        }
  
        // select = { label: 'nombre', value: 'id' }
        const select = req.query.select;
  
        const results = await this.service.getTable().modify(function (queryBuilder) {
          if (Array.isArray(keysWhere) && keysWhere.length > 0) {
            for (let i = 0; i < keysWhere.length; i++) {
              queryBuilder.andWhere(keysWhere[i], valuesWhere[i]);
            }
          }
          queryBuilder.andWhere("empresa_id", token);
        }).select([select.label, select.value]);
  
        return res.json([
          ...results.map(item => ({label: item[select.label], value: item[select.value].toString()}))
        ]);
  
      } else {
        const select = req.query.select;
  
        const results = await this.service.getTable().modify(function (queryBuilder) {
          if (Array.isArray(keysWhere) && keysWhere.length > 0) {
            for (let i = 0; i < keysWhere.length; i++) {
              queryBuilder.andWhere(keysWhere[i], valuesWhere[i]);
            }
          }
        }).select([select.label, select.value]);
  
        return res.json([
          ...results.map(item => ({label: item[select.label], value: item[select.value].toString()}))
        ]);
      }
    } catch (error) {
      return catchError(res, error);
    }
  }

}


module.exports = RestBuilder