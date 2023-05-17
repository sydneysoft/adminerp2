const { Router } = require("express"), router = Router();

router.use('/tratamiento', require('./tratamiento.routes'));

module.exports = router