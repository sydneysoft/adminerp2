const RestBuilder = require('../builder.controller');

const BannerBuilder = new RestBuilder();

const BannerController = BannerBuilder.setTable('banners').setName('Banner');

module.exports = {BannerController}
