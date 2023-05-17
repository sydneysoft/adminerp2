const { Router } = require("express"),
    router = Router();

//Renderizando Vistas de Pago


// // Método para actualizar los métodos de Pago
// router.post("/update-method-payment", async (req, res) => {
//   try {
//     let type_action = req.body.type;
//     if (type_action == "1") {
//       let key = req.body.key;
//       let state = req.body.state;
//       let queryUpdate =
//         "UPDATE metodos_pagos set api_key='" +
//         key +
//         "',estado='" +
//         state +
//         "' WHERE id=" +
//         1 +
//         "";
//       await db.query(con, queryUpdate);
//       res.json({
//         status: "success",
//         msg: "Pasarela actualizada correctamente",
//       });
//     } else if (type_action == "2") {
//       let key = req.body.key;
//       let state = req.body.state;
//       let queryUpdate =
//         "UPDATE metodos_pagos set api_key='" +
//         key +
//         "',estado='" +
//         state +
//         "' WHERE id=" +
//         2 +
//         "";
//       await db.query(con, queryUpdate);
//       res.json({
//         status: "success",
//         msg: "Pasarela actualizada correctamente",
//       });
//     } else if (type_action == "3") {
//       let key = req.body.key;
//       let state = req.body.state;
//       let secret_key = req.body.secret_key;
//       let merchant_id = req.body.merchant_id;
//       let queryUpdate =
//         "UPDATE metodos_pagos set api_key='" +
//         key +
//         "',estado='" +
//         state +
//         "',merchant_id='" +
//         merchant_id +
//         "',token='" +
//         secret_key +
//         "' WHERE id=" +
//         4 +
//         "";
//       await db.query(con, queryUpdate);
//       res.json({
//         status: "success",
//         msg: "Pasarela actualizada correctamente",
//       });
//     } else if (type_action == "4") {
//       let key = req.body.key;
//       let state = req.body.state;
//       let secret_key = req.body.secret_key;
//       let id_comercio = req.body.id_comercio;
//       let queryUpdate =
//         "UPDATE metodos_pagos set api_key='" +
//         key +
//         "',estado='" +
//         state +
//         "',token='" +
//         secret_key +
//         "',merchant_id='" +
//         id_comercio +
//         "' WHERE id=" +
//         5 +
//         "";
//       await db.query(con, queryUpdate);
//       res.json({
//         status: "success",
//         msg: "Pasarela actualizada correctamente",
//       });
//     } else if (type_action == "6") {
//       let key = req.body.key;
//       let state = req.body.state;
//       let queryUpdate =
//         "UPDATE metodos_pagos set api_key='" +
//         key +
//         "',estado='" +
//         state +
//         "' WHERE id=" +
//         7 +
//         "";
//       await db.query(con, queryUpdate);
//       res.json({
//         status: "success",
//         msg: "Pasarela actualizada correctamente",
//       });
//     } else if (type_action == "7") {
//       let key = req.body.key;
//       let state = req.body.state;
//       let token = req.body.token;
//       let queryUpdate =
//         "UPDATE metodos_pagos set api_key='" +
//         key +
//         "',token='" +
//         token +
//         "',estado='" +
//         state +
//         "' WHERE id=" +
//         8 +
//         "";
//       await db.query(con, queryUpdate);
//       res.json({
//         status: "success",
//         msg: "Pasarela actualizada correctamente",
//       });
//     } else if (type_action == "8") {
//       let key = req.body.key;
//       let state = req.body.state;
//       let token = req.body.token;
//       let merchant_id = req.body.merchant_id;
//       let queryUpdate =
//         "UPDATE metodos_pagos set api_key='" +
//         key +
//         "',merchant_id='" +
//         merchant_id +
//         "',token='" +
//         token +
//         "',estado='" +
//         state +
//         "' WHERE id=" +
//         9 +
//         "";
//       await db.query(con, queryUpdate);
//       res.json({
//         status: "success",
//         msg: "Pasarela actualizada correctamente",
//       });
//     }
//   } catch (e) {
//     console.log(e);
//     res.json({ status: "error", msg: "Error al ejecutar acción requerida" });
//   }
// });

module.exports = router;