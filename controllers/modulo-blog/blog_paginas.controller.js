const RestBuilder = require('../builder-test.controller')

const { matchedData } = require("express-validator");

class BlogPaginaController extends RestBuilder {
  constructor() {
    super()
    this.setTable('blog_paginas').setName('Página')
    .setTimeStamps();

    this.categoriable = this.setService("blog_categoriable");

  }


  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role, token } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-blog/paginas/superadmin', {
          dataSession,
          dataSistema
        });
      }

      let data = await this.service.getbyCompany(token);
      if (Array.isArray(data) && data.length == 0) {
        await this.service.save({ empresa_id: token });
        data = await this.service.getbyCompany(token);
      }

      return this.renderView(res, 'modulo-blog/paginas', {
        dataSession,
        dataSistema,
        data
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderSuperadminHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema } = await this.getAllDataSession(req);
      const paramsData = matchedData(req, {locations: ['params']});
      const empresa_id = paramsData.id;

      return this.renderView(res, 'modulo-blog/paginas', {
        dataSession,
        dataSistema,
        empresa_id,
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }


  putAutoPublish = async (req, res) => {
    const bodyData = matchedData(req, { locations: ['body'] });

    try {
      const paginas = bodyData.paginas;
      if (Array.isArray(paginas)) {
        const paginasMap = paginas.map(val => val.id);
        if (paginasMap.length > 0) {
          const dataUpdate = await this.service.updateBy({ estado: 'publish' }).whereIn('id', paginasMap);
          if (dataUpdate > 0) {
            return res.json({
              ok: true,
              msg: 'Se movieron a publicado correctamente'
            })
          } else {
            throw Error('1.0 Ocurrio un error inesperado.')
          }
        } else {
          throw Error('1.1 Ocurrio un error inesperado.')
        }
      } else {
        throw Error('1.2 Ocurrio un error inesperado.')
      }
    } catch (error) {
      return this.errorHandler(error, req, res, false);
    }
  }

  putAutoDraft = async (req, res) => {
    const bodyData = matchedData(req, { locations: ['body'] });
    try {
      const paginas = bodyData.paginas;
      if (Array.isArray(paginas)) {
        const paginasMap = paginas.map(val => val.id);
        if (paginasMap.length > 0) {
          const dataUpdate = await this.service.updateBy({ estado: 'draft' }).whereIn('id', paginasMap);
          if (dataUpdate > 0) {
            return res.json({
              ok: true,
              msg: 'Se movieron a borrador correctamente'
            })
          } else {
            throw Error('1.0 Ocurrio un error inesperado.')
          }
        } else {
          throw Error('1.1 Ocurrio un error inesperado.')
        }
      } else {
        throw Error('1.2 Ocurrio un error inesperado.')
      }
    } catch (error) {
      return this.errorHandler(error, req, res, false);
    }
  }

  getCategoriable = async (req, res) => {
    const paramsData = matchedData(req, { locations: ['params'] });
    try {
      const categorias = await this.categoriable.getByColumn({ column: 'pagina_id', value: paramsData.id });
      return res.json({
        ok: true,
        msg: 'Datos encontrados',
        data: categorias
      });
    } catch (error) {
      return this.errorHandler(error, req, res, false);
    }
  }

  postTach = async (req, res) => {
    const bodyData = matchedData(req, { locations: ['body'] });
    try {
      const categorias = bodyData.categorias;
      const pagina_id = bodyData.pagina_id;
      const paginaData = await this.service.getById(pagina_id);
      if (paginaData.length == 1) {
        const categoriaData = await this.categoriable.getByColumn({ column: 'pagina_id', value: pagina_id });
        let auxC = []
        if (Array.isArray(categorias)) {
          auxC = categorias.map(val => ({
            categoria_id: val.id,
            pagina_id
          }));
        }
        const auxT = categoriaData.map(val => parseInt(val.id));

        if (auxT.length > 0) {
          detach = await this.categoriable.deleteBy().whereIn('id', auxT);
        }
        if (auxC.length > 0) {
          attach = await this.categoriable.save(auxC);
        }
        return res.json({
          ok: true,
          msg: 'Se guardaron los cambios correctamente'
        });
      } else {
        throw Error('1.0 Ocurrio un error inesperado.')
      }
    } catch (error) {
      return this.errorHandler(error, req, res, false);
    } 
  }

  deletePagina = async (req, res) => {
    const paramsData = matchedData(req, { locations: ['params'] });
    // const bodyData = matchedData(req, { locations: ['body'] });
    try {
      const { role, token } = await this.getAllDataSession(req);
      const pagina = await this.service.getById(paramsData.id);
      if(Array.isArray(pagina) && pagina.length === 1) {
        if (role == 1 || role == 2) {
          const dataUpdate = await this.service.updateById(paramsData.id, {
            estado: 'delete'
          });
          if (dataUpdate > 0) {
            return res.json({
              ok: true,
              msg: 'La página ha sido borrada correctamente.'
            })
          } else {
            throw Error('1.0 Ocurrio un error inesperado.')
          }
        } else if (role == 3) {
          if (pagina[0].empresa_id == token) {
            const dataUpdate = await this.service.updateById(paramsData.id, {
              estado: 'delete'
            });
            if (dataUpdate > 0) {
              return res.json({
                ok: true,
                msg: 'La página ha sido borrada correctamente.'
              })
            } else {
              throw Error('1.0 Ocurrio un error inesperado.')
            }
          } else {
            throw Error('1.1 Ocurrio un error inesperado.')
          }
        } else {
          throw Error('1.2 Ocurrio un error inesperado.')
        }
      } 
    } catch (error) {
      return this.errorHandler(error, req, res, false);
    }
  }
  
}

module.exports = {BlogPaginaController}