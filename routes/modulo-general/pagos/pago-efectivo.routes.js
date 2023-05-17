const { Router } = require("express");
const router = Router();

//Metodo para generar Pago con PAGOEFECTIVO
router.post("/pago-efectivo", async (req, res) => {
  let pago = req.body.sumaTotal;
  let pagoConcepto = req.body.descripcion;
  let pagoInfo = req.body.infoAdicional;
  let userPago = req.body.email;
  let nombreUser = req.body.nombre;
  let apellidoUser = req.body.apellido;
  let userCountry = "PERU";
  let userId = req.body.token;
  let transactionId = getUniqueValue();
  try {
    let queryData = "SELECT * FROM metodos_pagos WHERE id=5";
    let result = await db.query(con, queryData);
    let dataFinalFixed = {
      data: {
        currency: "PEN",
        amount: pago,
        transactionCode: transactionId,
        dataExpiry: "",
        paymentConcept: pagoConcepto,
        additionalData: pagoInfo,
        adminEmail: "admin@inkaladia.com",
        userEmail: userPago,
        userName: nombreUser,
        userLastName: apellidoUser,
        userCountry: userCountry,
        userId: userId,
        serviceId: 20,
      },
      id_comercio: result[0].merchant_id,
      acces_key: result[0].api_key,
      secret_key: result[0].token,
    };
    let urlAPI = "https://grupoinsur.pe/pago-efectivo-api/index.php?type=dev";
    let headJSON = { "Content-Type": "application/json" };
    const respFinal = await axios.post(urlAPI, dataFinalFixed, headJSON);

    let carrito = req.body.carrito;
    let token = req.body.token;
    let valor_servicio = req.body.valor_servicio;
    let valor_envio = req.body.valor_envio;
    let direccion_entrega = req.body.valorAddress;
    let valor_pago_general = req.body.sumaTotal;
    //Crear Url de Registro Para el Pedido Temporal
    var id_array = [];
    var cantidad_array = [];
    var precios_array = [];
    for (let i = 0; carrito.length > i; i++) {
      id_array.push(carrito[i].id);
      cantidad_array.push(carrito[i].cantidad);
      precios_array.push(carrito[i].precio);
    }

    let queryInsertPedido =
      "INSERT INTO pedidos (usuario,tipo_pago,valor_servicio,valor_env,direccion_entrega,suma_subtotal,estado,cip) VALUES" +
      " (" +
      token +
      ",5," +
      valor_servicio +
      "," +
      valor_envio +
      "," +
      direccion_entrega +
      ",'" +
      valor_pago_general +
      "','0','" +
      respFinal.data.data.cip +
      "')";
    let resultQuery = await db.query(con, queryInsertPedido);

    if (resultQuery.insertId) {
      let finalArrayDataInsert = [];
      for (let i = 0; precios_array.length > i; i++) {
        finalArrayDataInsert.push([
          id_array[i],
          resultQuery.insertId,
          parseFloat(cantidad_array[i]),
          parseFloat(precios_array[i]),
        ]);
      }

      let queryData2 =
        "INSERT INTO pedido_productos (id_producto,id_pedido,cantidad,precio) VALUES ?";
      await db.query(con, queryData2, [finalArrayDataInsert]);

      res.json({ status: "success", pagoResponse: respFinal.data });
    } else {
      res.json({ status: "error" });
    }
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: "Error al realizar la transacción" });
  }
});


module.exports = router;