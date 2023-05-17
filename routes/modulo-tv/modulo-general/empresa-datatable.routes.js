const { Router } = require("express"), router = Router();
const { getAllDataSession } = require('../../../helpers/modulo-tv/basicrequest.helpers');
const ServiceSQL = require('../../../services/services')
const { isAdminSuperAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');

const UsuarioService = new ServiceSQL('usuarios');
const EmpresaService = new ServiceSQL('empresas_marketplace');
const UsuarioEmpresaService = new ServiceSQL('empresas_usuarios');

/** 
 * La siguiente ruta es para obtener la informacion de las empresas
*/
router.get('/', isAdminSuperAdminMiddleware, async (req, res) => {
  try {
    const { role } = await getAllDataSession(req);

    if (role === 1 || role === 2) {
      let datos = [];
      let empresas = [];
      empresas = await UsuarioEmpresaService.getAll();
      datos = empresas;
      if (Array.isArray(empresas)) {
        empresas = empresas.map((item) => item.empresa_id).filter((value, index, self) => self.indexOf(value) === index);
        datos = await EmpresaService.getTable().select(['id', 'nombre', 'port','razon_social', 'email_corporativo', 'direccion', 'nombre_contacto', 'email_contacto', 'celular_contacto']).whereIn('id', empresas);
      }

      res.json({
        ok: true,
        data: datos
      })

    } else {
      res.status(403);
      return res.json({
        ok: false,
        msg: 'No tiene permisos para acceder a esta ruta.'
      });
    }

  } catch (error) {
    res.status(403);
    return res.json({
      ok: false,
      msg: 'No tiene permisos para acceder a esta ruta.'
    });
  }
});

module.exports = router