const RestBuilder = require('../../builder.controller');

const ReservacionBuilder = new RestBuilder();

const ReservacionController = ReservacionBuilder.setTable('reservas_empresa').setName('Reservación');

module.exports = {ReservacionController}
