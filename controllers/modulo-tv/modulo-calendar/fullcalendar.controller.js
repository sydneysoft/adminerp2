const RestBuilder = require('../../builder.controller');

const CalendarBuilder = new RestBuilder();

const FullCalendarController = CalendarBuilder.setTable('fullcalendar_setting').setName('Configuración');

module.exports = {FullCalendarController}
