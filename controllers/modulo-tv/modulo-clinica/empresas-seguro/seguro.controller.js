const RestBuilder = require('../../../builder.controller')

const SeguroBuilder = new RestBuilder();

const SeguroController = SeguroBuilder.setTable('empresa_seguros').setName('Seguro')
  .setPagination()


module.exports = {SeguroController}