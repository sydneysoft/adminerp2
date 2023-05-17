const { Router } = require("express");
const router = Router();


//Método Payu
router.post("/pago-payu/:precio", async (req, res) => {
  let precioData = req.params.precio;
  try {
    let queryData = "SELECT * FROM metodos_pagos WHERE id=4";
    let result = await db.query(con, queryData);
    let referenceCode = "InkalandiaPago-" + getUniqueValue();
    //Generar la firma (signature) con MD5
    let dataAllJoin =
      result[0].api_key +
      "~" +
      result[0].merchant_id +
      "~" +
      referenceCode +
      "~" +
      precioData +
      "~PEN";
    let signature = md5(dataAllJoin);
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
    id_array = id_array.join(",");
    cantidad_array = cantidad_array.join(",");
    precios_array = precios_array.join(",");
    let dataQueryAdress =
      "SELECT correo FROM direcciones WHERE id=" + direccion_entrega + "";
    let resultQuery = await db.query(con, dataQueryAdress);
    res.json({
      status: "success",
      correo: resultQuery[0].correo,
      signature: signature,
      referenceCode: referenceCode,
      accountId: result[0].token,
      merchant_id: result[0].merchant_id,
      precioData,
      url:
        BASE_URL_USER_PHOTO +
        "approve-order-payment/4/" +
        valor_pago_general +
        "/" +
        direccion_entrega +
        "/" +
        token +
        "/" +
        valor_servicio +
        "/" +
        valor_envio +
        "/" +
        id_array +
        "/" +
        precios_array +
        "/" +
        cantidad_array,
    });
  } catch (e) {
    console.log(e);
    res.json({ status: "error" });
  }
});

module.exports = router;