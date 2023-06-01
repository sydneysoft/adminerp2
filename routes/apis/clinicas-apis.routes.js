const { Router } = require("express"), router = Router();
const {MyController} = require("../../apis/clinicas");
const { body, query, param } = require("express-validator");
const myEntity = new MyController();



  
  


router.get("/datatable/:id?", myEntity.datatable);


router.get("/", myEntity.datatable)

    module.exports = router
