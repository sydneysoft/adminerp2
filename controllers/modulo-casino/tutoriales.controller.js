const RestBuilder = require('../builder.controller');

const TutorialBuilder = new RestBuilder();

const TutorialController = TutorialBuilder.setTable('tutoriales').setName('Tutorial');

module.exports = {TutorialController}
