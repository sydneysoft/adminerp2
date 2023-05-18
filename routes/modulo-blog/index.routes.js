const { Router } = require("express"), router = Router();


router.use('/categorias', require('./blog_categorias.routes'));
router.use('/paginas', require('./blog_paginas.routes'));

router.use('/', async (req, res) => {
  return res.redirect("/admin-blog/paginas");
});

module.exports = router
