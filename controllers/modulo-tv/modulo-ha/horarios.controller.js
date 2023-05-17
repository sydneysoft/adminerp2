const RestBuilder = require('../../builder.controller')

const HorarioBuilder = new RestBuilder();

const HorarioController = HorarioBuilder.setTable('horarios_atencion').setName('Horario de atención')
  .setPagination()
  .setIndexView('modulo-tv/modulo-ha/horario/index');

module.exports = {HorarioController}