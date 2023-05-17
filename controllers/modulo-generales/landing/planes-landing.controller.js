const RestBuilder = require('../../builder.controller');

const PlanLandingBuilder = new RestBuilder();

const PlanLandingController = PlanLandingBuilder.setTable('planes_landing').setName('Plan landing');

module.exports = {PlanLandingController}
