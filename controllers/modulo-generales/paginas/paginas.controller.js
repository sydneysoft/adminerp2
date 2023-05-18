const RestBuilder = require('../../builder-test.controller')

const { matchedData } = require("express-validator");

class PaginaController extends RestBuilder {
  constructor() {
    super()
    this.setTable('paginas').setName('Pagina')
    .setTimeStamps().setPagination();
    this.formulario_contactos = this.setService("formulario_contactos");
  }


  // renderHomeView = async (req, res) => {
  //   try {
  //     const { dataSession, dataSistema, role } = await this.getAllDataSession(req);

  //     if (role == 1 || role == 2) {
  //       return this.renderView(res, 'modulo-clinica/companias-seguros/superadmin', {
  //         dataSession,
  //         dataSistema
  //       });
  //     }

  //     return this.renderView(res, 'modulo-clinica/companias-seguros', {
  //       dataSession,
  //       dataSistema
  //     });

  //   } catch (error) {
  //     return this.errorHandler(error, req, res);
  //   }
  // }

  // renderSuperadminHomeView = async (req, res) => {
  //   try {
  //     const { dataSession, dataSistema } = await this.getAllDataSession(req);
  //     const paramsData = matchedData(req, {locations: ['params']});
  //     const empresa_id = paramsData.id;

  //     const data = await this.service.getbyCompany(empresa_id);

  //     return this.renderView(res, 'modulo-clinica/companias-seguros', {
  //       dataSession,
  //       dataSistema,
  //       data,
  //       empresa_id
  //     });

  //   } catch (error) {
  //     return this.errorHandler(error, req, res);
  //   }
  // }

  renderContacto = async (req, res) => {
    try {
      const { role, token, dataSession, dataSistema } = await this.getAllDataSession(req);
      if (role == 1 || role == 2) {
        return res.render('modulo-generales/paginas/contacto/ superadmin', {
          dataSession,
          dataSistema
        });
      }
  
      let pagina = [];
      pagina = await PaginaService.getTable().where('empresa_id', token).where('identificador', 'contacto');
      if (Array.isArray(pagina) && pagina.length == 0) {
        await PaginaService.save({ identificador: 'contacto', empresa_id: token });
        pagina = await PaginaService.getTable().where('empresa_id', token).where('identificador', 'contacto');
      }
  
      let formulario_contactos = await this.formulario_contactos.getbyCompany(token);

      return this.renderView(req, "modulo-generales/paginas/contacto", {
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

  renderSuperadminContacto = async (req, res) => {
    try {
      const {dataSession, dataSistema} = await this.getAllDataSession(req);
      const paramsData = matchedData(req, { locations: ['params']});
      const empresa_id = paramsData.id;

      const pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'contacto');
      if (Array.isArray(pagina) && pagina.length == 0) {
        await this.service.save({ identificador: 'contacto', empresa_id });
        pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'contacto');
      }

      let formulario_contactos = await this.formulario_contactos.getbyCompany(empresa_id);

      return this.renderView(req, "modulo-blog/contacto",  {
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

  renderNosotros = async (req, res) => {
    try {
      const { role, token, dataSession, dataSistema } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return res.render('modulo-tv/modulo-paginas/nosotros/superadmin', {
          dataSession,
          dataSistema
        });
      }
      if (token == null || token == undefined) {
        return res.redirect('/');
      }
      let pagina = [];
      pagina = await this.service.getTable().where('empresa_id', token).where('identificador', 'nosotros');
      if (Array.isArray(pagina) && pagina.length == 0) {
        await this.service.save({ identificador: 'nosotros', empresa_id: token });
        pagina = await this.service.getTable().where('empresa_id', token).where('identificador', 'nosotros');
      }
  
      let formulario_contactos = await this.formulario_contactos.getbyCompany(token);

      return this.renderView(res, "modulo-blog/nosotros", {
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

  renderSuperadminNosotros = async (req, res) =>{
    try {
      const { dataSession, dataSistema} = await this.getAllDataSession(req);
      const paramsData = matchedData(req, { locations: ['params']});
      const empresa_id = paramsData.id;

      const pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'nosotros');

      if (Array.isArray(pagina) && pagina.length == 0) {
        await this.service.save({ identificador: 'nosotros', empresa_id });
        pagina = await this.service.getTable().where('empresa_id', empresa_id).where('identificador', 'nosotros');
      }

      let formulario_contactos = await this.formulario_contactos.getbyCompany(empresa_id);

      
      return this.renderView(res, "modulo/nosotros", {
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


router.get('/nosotros/empresa/:id', isAdminSuperAdminMiddleware,
  check('id').isNumeric().withMessage('El id debe ser un número'),
  EVResult, async (req, res) => {
    try {

      const { dataSession, dataSistema } = await getAllDataSession(req);
      const empresa_id = req.params.id;
      let pagina = [];

      pagina = await PaginaService.getTable().where('empresa_id', empresa_id).where('identificador', 'nosotros');

      if (Array.isArray(pagina) && pagina.length == 0) {
        await PaginaService.save({ identificador: 'nosotros', empresa_id });
        pagina = await PaginaService.getTable().where('empresa_id', empresa_id).where('identificador', 'nosotros');
      }

      let formulario_contactos = await FormularioContactoService.getbyCompany(empresa_id);

      return res.render('modulo-tv/modulo-paginas/paginas', {
        dataSession,
        dataSistema,
        pagina: pagina[0],
        empresa_id,
        formulario_contactos
      });

    } catch (error) {
      return catchError(res, error);
    }
  });


module.exports = {PaginaController}