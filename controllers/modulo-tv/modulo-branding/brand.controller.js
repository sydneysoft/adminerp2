const RestBuilder = require('../../builder.controller');

const BrandBuilder = new RestBuilder();

const BrandController = BrandBuilder.setTable('branding').setName('Brand')
  .setPagination();

module.exports = {BrandController}
