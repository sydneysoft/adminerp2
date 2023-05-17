const RestBuilder = require('../../builder.controller');

const PaginaBuilder = new RestBuilder();

const PaginaController = PaginaBuilder.setTable('blog_paginas').setName('Página')
  .setPagination().setTimeStamps();

module.exports = {PaginaController}
