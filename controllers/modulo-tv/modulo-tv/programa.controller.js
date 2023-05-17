const TVRouteBuilder = require('../../builder.controller')

const ProgramaBuilder = new TVRouteBuilder();

const ProgramaController = ProgramaBuilder.setTable('stream_programas').setName('Programa')
  .setTimeStamps().setPagination()
  .setCreateView('modulo-tv/modulo-tv/programa/create')
  .setEditeView('modulo-tv/modulo-tv/programa/edite')
  .setShowView('modulo-tv/modulo-tv/programa/show')
  .setIndexView('modulo-tv/modulo-tv/programa/index');


module.exports = ProgramaController