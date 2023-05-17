const RestBuilder = require('../../../builder.controller')

const SedeBuilder = new RestBuilder();

const SedeController = SedeBuilder.setTable('sedes').setName('Sede')
  .setPagination();

module.exports = {SedeController}