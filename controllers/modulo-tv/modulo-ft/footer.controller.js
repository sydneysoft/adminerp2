const ServiceSQL = require('../../../services/services')
const logger = require('../../../helpers/logger')
// const { getDataSistema } = require("../helpers/db")
// const { validationResult } = require('express-validator')
const MenuListController = require('./list.controller');
const MenuItemController = require('./item.controller');
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
// const { getDataSistema } = require("../../../helpers/db");


class FooterController {
  constructor() {
    this.list = new ServiceSQL('menu_lists');
    this.items = new ServiceSQL('menu_items');
  }

  getMenu = async (req, res, next) => {
    try {
      const result = [];
      const {role, token} = await getAllDataSession(req);

      if(role == 'admin' || role == 'empresa') {
        const listsData = await this.list.getByColumn({ column: 'section', value: 'footer' }).where('empresa_id', token);
        if (listsData.length > 0) {
          for (let i = 0; i < listsData.length; i++) {
            const auxResult = {
              id: listsData[i].id,
              nombre: listsData[i].nombre,
              descripcion: listsData[i].descripcion,
              items: []
            };
            const items = await this.items.getByColumn({
              column: 'menu_id',
              value: listsData[i].id
            });
            auxResult.items.push(...items);
            result.push(auxResult);
          }
        }
        res.json(result);
      } else {
        return notAuthorize(res)
      }
      
    } catch (error) {
      return catchError(res, error);
    }
  }

  getMenuBy = async (req, res, next) => {
    try {
      const {id} = req.params
      const result = [];
      const listsData = await this.list.getbyCompany(id);
      if (listsData.length > 0) {
        for (let i = 0; i < listsData.length; i++) {
          const auxResult = {
            id: listsData[i].id,
            nombre: listsData[i].nombre,
            descripcion: listsData[i].descripcion,
            items: []
          };
          const items = await this.items.getByColumn({
            column: 'menu_id',
            value: listsData[i].id
          });
          auxResult.items.push(...items);
          result.push(auxResult);
        }
      }
      res.json(result);
    } catch (error) {
      return catchError(req, error);
    }
  }

  getUniqueMenuBy = async (req, res, next) => {
    try {
      const {id} = req.params
      const result = [];
      const listsData = await this.list.getbyCompany(id);
      if (listsData.length > 0) {
        for (let i = 0; i < listsData.length; i++) {
          const auxResult = {
            id: listsData[i].id,
            nombre: listsData[i].nombre,
            descripcion: listsData[i].descripcion,
            items: []
          };
          const items = await this.items.getByColumn({
            column: 'menu_id',
            value: listsData[i].id
          });
          auxResult.items.push(...items);
          result.push(auxResult);
        }
      }
      res.json(result);
    } catch (error) {
      return catchError(req, error);
    }
  }

}

module.exports = {
  MenuItemController,
  MenuListController,
  FooterController
}