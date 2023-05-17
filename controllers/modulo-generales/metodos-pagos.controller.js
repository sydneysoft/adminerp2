const RestBuilder = require('../builder.controller');

const MetodoPagoBuilder = new RestBuilder();

const MetodoPagoController = MetodoPagoBuilder.setTable('metodos_pagos').setName('Metodo pago');

module.exports = {MetodoPagoController}
