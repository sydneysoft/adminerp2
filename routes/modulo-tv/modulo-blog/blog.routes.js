const { Router } = require("express"), router = Router();
const { catchError, getAllDataSession, notAuthorize } = require('../../../helpers/modulo-tv/basicrequest.helpers');
// const { isAdminMiddleware } = require('../../../middlewares/modulo-tv/isAdmin');

const ServiceSQL = require('../../../services/services');
// const empresaService = new ServiceSQL('usuarios');



router.use('/categorias', require('./categoria.routes'));
router.use('/paginas', require('./pagina.routes'));

router.use('/', async (req, res) => {
  try {
    let view = 'modulo-tv/modulo-blog/usuario'
    let empresas = [];
    let data = [];
    const { role, dataSession, dataSistema, token } = await getAllDataSession(req);


    return res.render(view, {
      dataSession,
      dataSistema,
      empresas,
      data
    })

  } catch (error) {
    return catchError(res, error);
  }
});

module.exports = router
