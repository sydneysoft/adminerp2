const RestBuilder = require('../../builder.controller');

const TestimonioBuilder = new RestBuilder();

const TestimonioController = TestimonioBuilder.setTable('testimonios').setName('Testimonio');

module.exports = {TestimonioController}
