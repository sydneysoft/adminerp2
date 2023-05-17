const RestBuilder = require('../../builder.controller');

const RSettingBuilder = new RestBuilder();

const ReservacionSettingController = RSettingBuilder.setTable('fullcalendar_setting').setName('Configuración');

module.exports = {ReservacionSettingController}
