
const RestBuilder = require('../controllers/builder-test.controller')

class MyController extends RestBuilder {
    constructor() {
      super()
      this.setTable('blog_categorias').setName('Página')
      .setTimeStamps();
  
    }
}
module.exports = {MyController}