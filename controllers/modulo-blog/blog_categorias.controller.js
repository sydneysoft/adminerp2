const RestBuilder = require('../builder-test.controller')

const { matchedData } = require("express-validator");

class BlogCategoriaController extends RestBuilder {
  constructor() {
    super()
    this.setTable('blog_categorias').setName('Página')
    .setTimeStamps();

  }


  renderHomeView = async (req, res) => {
    try {
      const { dataSession, dataSistema, role, token } = await this.getAllDataSession(req);

      if (role == 1 || role == 2) {
        return this.renderView(res, 'modulo-blog/categorias/superadmin', {
          dataSession,
          dataSistema
        });
      }

      let data = await this.service.getbyCompany(token);
      if (Array.isArray(data) && data.length == 0) {
        await this.service.save({ empresa_id: token });
        data = await this.service.getbyCompany(token);
      }

      return this.renderView(res, 'modulo-blog/categorias', {
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

      return this.renderView(res, 'modulo-blog/categorias', {
        dataSession,
        dataSistema,
        empresa_id,
      });

    } catch (error) {
      return this.errorHandler(error, req, res);
    }
  }


  postCategory = async (req, res) => {
    const bodyData = matchedData(req, {locations: ['body']});
    try {
      const { role, token } = await this.getAllDataSession(req);
      let empresa_id = 0;
      if (role == 1 || role == 2) {
        empresa_id = bodyData.empresa_id || 0;
      } else if(role == 3) {
        empresa_id = token;
      }

      const date = new Date();
      const nombre = bodyData.nombre;

      const categoriaData = await this.service.getByColumn({ column: 'empresa_id', value: empresa_id}).andWhere('nombre', nombre);
      if (categoriaData.length == 0) {
        const nuevaCategoria = await this.service.save({
          nombre,
          descripcion: bodyData.descripcion || '',
          imagen: bodyData.imagen || '',
          empresa_id,
          created_at: date,
          updated_at: date
        });

        return res.status(201).json({
          ok: true,
          msg: 'Categoría creada correctamente.',
          categoria: nuevaCategoria
        });
      } else {
        return res.status(400).json({
          ok: false,
          msg: 'Esta categoría ya existe.'
        });
      }

    } catch (error) {
      return this.errorHandler(error, req, res, false);
    }
  }

  putCategory = async (req, res) => {
    const bodyData = matchedData(req, {locations: ['body']});
    const paramsData = matchedData(req, {locations: ['params']});
    let empresa_id = 0;
    const { role, token } = await this.getAllDataSession(req);
    if(role == 1 || role == 2) {
      empresa_id = bodyData.empresa_id || 0;
    } else if (role == 3) {
      empresa_id = token;
    }

    const date = new Date();
    const nombre = bodyData.nombre;

    const id = paramsData.id;
    const categoriaData = await this.service.getByColumn({ column: 'empresa_id', value: empresa_id})
      .andWhere('nombre', nombre).andWhere('id','<>', id);
    if (categoriaData.length == 0) {
      const nuevaCategoria = await this.service.updateById(id, {
        nombre,
        descripcion: bodyData.descripcion || '',
        imagen: bodyData.imagen || '',
        empresa_id,
        updated_at: date
      })

      if(nuevaCategoria > 0) {
        return res.json({
          ok: true,
          msg: 'Categoría actualizada correctamente.'
        })
      } else {
        throw Error({message: 'No se pudo actualizar la categoría.'});
      }
    }
  }  
}

module.exports = {BlogCategoriaController}