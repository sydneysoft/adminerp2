const { Router } = require("express"), router = Router();

router.use('/', require('./producto-paquetes.routes'));
router.use('/caracteristicas', require('./producto-caracteristicas.routes'));

module.exports = router
