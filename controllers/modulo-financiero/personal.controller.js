const RestBuilder = require('../builder.controller');

const PersonalBuilder = new RestBuilder();

const PersonalController = PersonalBuilder.setTable('personal').setName('Personal')
  .setTimeStamps();

module.exports = {PersonalController}
