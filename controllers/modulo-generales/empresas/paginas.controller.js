const RestBuilder = require('../../builder-test.controller')

const { matchedData } = require("express-validator");

class PaginaController extends RestBuilder {
  constructor() {
    super()
    this.setTable('paginas').setName('Página')
    .setPagination()
    .setTimeStamps()
    .setCreateView('modulo-tv/modulo-paginas/pagina/create')
    .setEditeView('modulo-tv/modulo-paginas/pagina/edite')
    .setShowView('modulo-tv/modulo-paginas/pagina/show')
    .setIndexView('modulo-tv/modulo-paginas/pagina/index');

    this.formulario_contactos = this.setService("formulario_contactos");
  }


  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-generales/empresas/paginas/superadmin', {
          dataSession,
          dataSistema
        });
      }

      return this.renderView(res, 'modulo-generales/empresas/paginas', {
        dataSession,
        dataSistema
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

      const data = await this.service.getbyCompany(empresa_id);

      return this.renderView(res, 'modulo-generales/empresas/paginas', {
        dataSession,
        dataSistema,
        data,
        empresa_id
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
  
  renderPaginaEditar = async (req, res) => {
    try {

      const {role, token, dataSession, dataSistema} = await this.getAllDataSession(req);

      const paramsData = matchedData(req, {locations: ['params']});
      const id = paramsData.id;
      const data = await this.service.getById(id);

      let formulario_contactos = [];
      if (Array.isArray(data) && data.length > 0) {
        // Optiene de una forma corta los datos de la tabla formulario_contactos de la empresa a que pertenece la pagina
        formulario_contactos = await this.formulario_contactos.getbyCompany(data[0].empresa_id);
      }

      return res.render("modulo-generales/empresas/paginas/edite", {
        dataSession,
        dataSistema,
        data: data[0],
        formulario_contactos
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderSuperadminCreatePagina = async (req,res)  => {
    try {
      const {dataSession, dataSistema} = await this.getAllDataSession(req);
      const paramsData = matchedData(req, {locations: ['params']});
      const empresa_id = paramsData;
      let formulario_contactos = [];
      formulario_contactos = await this.formulario_contactos.getbyCompany(empresa_id);
      return res.render('modulo-generales/empresas/paginas/empresa-crear', {
        dataSession,
        dataSistema,
        empresa_id,
        formulario_contactos
      });
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  /**
   * Renderiza la vista de la pagina de contacto, o la tabla de empresas
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  renderContactoPagina = async (req, res) => {
    try {
      const { dataSession, dataSistema, role, token } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-generales/empresas/paginas/contacto/superadmin', {
          dataSession,
          dataSistema
        });
      }

      let pagina = [];
      pagina = await this.service.getTable().where('empresa_id', token).where('identificador', 'contacto');
      if (Array.isArray(pagina) && pagina.length == 0) {
        // Si no existe esta pagina la crea
        await this.service.save({ identificador: 'contacto', empresa_id: token });
        pagina = await this.service.getTable().where('empresa_id', token).where('identificador', 'contacto');
      }

      let formulario_contactos = await this.formulario_contactos.getbyCompany(token);
      return this.renderView(res, 'modulo-generales/empresas/paginas/contacto', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id: token,
        formulario_contactos
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  /**
   * Renderiza la vista para editar la pagina de contacto
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  renderSuperadminContactoPagina = async (req, res) => {
    try {
      const { dataSession, dataSistema } = await this.getAllDataSession(req);
      const paramsData = matchedData(req, {locations: ['params']});
      const empresa_id = paramsData.id;

      let pagina = [];
      pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'contacto');
      if (Array.isArray(pagina) && pagina.length == 0) {
        // Si no existe esta pagina la crea
        await this.service.save({ identificador: 'contacto', empresa_id });
        pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'contacto');
      }

      let formulario_contactos = await this.formulario_contactos.getbyCompany(empresa_id);

      return res.render('modulo-generales/empresas/paginas/contacto/superadmin', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id,
        formulario_contactos
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderNosotrosPagina = async (req, res) => {
    try {
      const { role, token, dataSession, dataSistema } = await this.getAllDataSession(req);
      if (role == 1 || role == 2) {
        return res.render('modulo-tv/modulo-paginas/nosotros/superadmin', {
          dataSession,
          dataSistema
        });
      }

      let pagina = [];
      pagina = await this.service.getTable().where('empresa_id', token).where('identificador', 'nosotros');
      if (Array.isArray(pagina) && pagina.length == 0) {
        // Si no existe esta pagina la crea
        await this.service.save({ identificador: 'nosotros', empresa_id: token });
        pagina = await this.service.getTable().where('empresa_id', token).where('identificador', 'nosotros');
      }

      let formulario_contactos = await this.formulario_contactos.getbyCompany(token);
      return res.render('modulo-tv/modulo-paginas/nosotros', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id: token,
        formulario_contactos
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderSuperadminNosotrosPagina = async (req, res) => {
    try {
      const { dataSession, dataSistema } = await this.getAllDataSession(req);
      const paramsData = matchedData(req, {locations: ['params']});
      const empresa_id = paramsData.id;

      let pagina = [];
      pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'nosotros');
      if (Array.isArray(pagina) && pagina.length == 0) {
        // Si no existe esta pagina la crea
        await this.service.save({ identificador: 'nosotros', empresa_id });
        pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'nosotros');
      }

      let formulario_contactos = await this.formulario_contactos.getbyCompany(empresa_id);

      return res.render('modulo-tv/modulo-paginas/nosotros/superadmin', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id,
        formulario_contactos
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderPoliticaPagina = async (req, res) => {
    try {
      const { role, token, dataSession, dataSistema } = await this.getAllDataSession(req);
      if (role == 1 || role == 2) {
        return res.render('modulo-tv/modulo-paginas/politica/superadmin', {
          dataSession,
          dataSistema
        });
      }

      let pagina = [];
      pagina = await this.service.getTable().where('empresa_id', token).where('identificador', 'politica');
      if (Array.isArray(pagina) && pagina.length == 0) {
        // Si no existe esta pagina la crea
        await this.service.save({ identificador: 'politica', empresa_id: token });
        pagina = await this.service.getTable().where('empresa_id', token).where('identificador', 'politica');
      }

      let formulario_contactos = await this.formulario_contactos.getbyCompany(token);
      return res.render('modulo-tv/modulo-paginas/politica', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id: token,
        formulario_contactos
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderSuperadminPoliticaPagina = async (req, res) => {
    try {
      const { dataSession, dataSistema } = await this.getAllDataSession(req);
      const paramsData = matchedData(req, {locations: ['params']});
      const empresa_id = paramsData.id;

      let pagina = [];
      pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'politica');
      if (Array.isArray(pagina) && pagina.length == 0) {
        // Si no existe esta pagina la crea
        await this.service.save({ identificador: 'politica', empresa_id });
        pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'politica');
      }

      let formulario_contactos = await this.formulario_contactos.getbyCompany(empresa_id);

      return res.render('modulo-tv/modulo-paginas/politica/superadmin', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id,
        formulario_contactos
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderCookiePagina = async (req, res) => {
    try {
      const { role, token, dataSession, dataSistema } = await this.getAllDataSession(req);
      if (role == 1 || role == 2) {
        return res.render('modulo-tv/modulo-paginas/cookie/superadmin', {
          dataSession,
          dataSistema
        });
      }

      let pagina = [];
      pagina = await this.service.getTable().where('empresa_id', token).where('identificador', 'cookie');
      if (Array.isArray(pagina) && pagina.length == 0) {
        // Si no existe esta pagina la crea
        await this.service.save({ identificador: 'cookie', empresa_id: token });
        pagina = await this.service.getTable().where('empresa_id', token).where('identificador', 'cookie');
      }

      let formulario_contactos = await this.formulario_contactos.getbyCompany(token);
      return res.render('modulo-tv/modulo-paginas/cookie', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id: token,
        formulario_contactos
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderSuperadminCookiePagina = async (req, res) => {
    try {
      const { dataSession, dataSistema } = await this.getAllDataSession(req);
      const paramsData = matchedData(req, {locations: ['params']});
      const empresa_id = paramsData.id;

      let pagina = [];
      pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'cookie');
      if (Array.isArray(pagina) && pagina.length == 0) {
        // Si no existe esta pagina la crea
        await this.service.save({ identificador: 'cookie', empresa_id });
        pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'cookie');
      }

      let formulario_contactos = await this.formulario_contactos.getbyCompany(empresa_id);

      return res.render('modulo-tv/modulo-paginas/cookie/superadmin', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id,
        formulario_contactos
      });
    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderMisionPagina = async (req, res) => {
    try {
      const { role, token, dataSession, dataSistema } = await this.getAllDataSession(req);
      if (role == 1 || role == 2) {
        return res.render('modulo-tv/modulo-paginas/mision/superadmin', {
          dataSession,
          dataSistema
        });
      }

      let pagina = [];
      pagina = await this.service.getTable().where('empresa_id', token).where('identificador', 'mision');
      if (Array.isArray(pagina) && pagina.length == 0) {
        // Si no existe esta pagina la crea
        await this.service.save({ identificador: 'mision', empresa_id: token });
        pagina = await this.service.getTable().where('empresa_id', token).where('identificador', 'mision');
      }

      let formulario_contactos = await this.formulario_contactos.getbyCompany(token);
      return res.render('modulo-tv/modulo-paginas/mision', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id: token,
        formulario_contactos
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }

  renderSuperadminMisionPagina = async (req, res) => {
    try {
      const { dataSession, dataSistema } = await this.getAllDataSession(req);
      const paramsData = matchedData(req, {locations: ['params']});
      const empresa_id = paramsData.id;

      let pagina = [];
      pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'mision');
      if (Array.isArray(pagina) && pagina.length == 0) {
        // Si no existe esta pagina la crea
        await this.service.save({ identificador: 'mision', empresa_id });
        pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'mision');
      }

      let formulario_contactos = await this.formulario_contactos.getbyCompany(empresa_id);

      return res.render('modulo-tv/modulo-paginas/mision/superadmin', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id,
        formulario_contactos
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }
}

module.exports = {PaginaController}