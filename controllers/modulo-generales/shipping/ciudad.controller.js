const RestBuilder = require('../../builder.controller');

const CiudadBuilder = new RestBuilder();

const CiudadController = CiudadBuilder.setTable('ciudad').setName('Ciudad').notCompany();

module.exports = {CiudadController}
