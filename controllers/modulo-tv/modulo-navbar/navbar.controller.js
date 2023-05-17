const RestBuilder = require('../../builder.controller')

const NavbarBuilder = new RestBuilder();

const NavbarController = NavbarBuilder.setTable('navbars').setName('Navbar')

module.exports = {NavbarController}