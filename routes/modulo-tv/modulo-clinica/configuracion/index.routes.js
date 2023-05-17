const { Router } = require("express"), router = Router();

router.use('/documento-medico', require('./documento-medico.routes'));

module.exports = router