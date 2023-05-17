const { Router } = require("express");
const router = Router();

//Método para crear Pago de Niubiz
router.post("/pago-niubiz", async (req, res) => {
  try {
    let queryData = "SELECT * FROM metodos_pagos WHERE id=11";
    let result = await db.query(con, queryData);
    const visa = new VisaNet({
      user: result[0].api_key,
      password: result[0].token,
      merchantId: result[0].merchant_id,
      env: "prod",
    });
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

    let amount = req.body.sumaTotal;
    let clientIp = req.ip;
    let email = resultQuery[0].correo;

    const securityToken = await visa.createToken();

    const body = {
      amount,
      channel: visa.channel,
      antifraud: {
        clientIp,
        merchantDefineData: {
          MDD1: "web",
          MDD2: "Canl",
          MDD3: "Canl",
          MDD4: email,
          MDD21: 0,
          MDD32: email,
          MDD75: "REGISTRADO",
          MDD77: 7,
        },
      },
    };

    const { sessionKey, expirationTime } = await visa.createSession(
      securityToken,
      body
    );

    res.json({
      status: "success",
      url:
        BASE_URL_USER_PHOTO +
        "render-niubiz-payment/" +
        securityToken +
        "/" +
        amount +
        "/" +
        sessionKey +
        "/" +
        expirationTime +
        "/" +
        visa.merchantId +
        "/" +
        amount +
        "/" +
        "11~" +
        valor_pago_general +
        "~" +
        direccion_entrega +
        "~" +
        token +
        "~" +
        valor_servicio +
        "~" +
        valor_envio +
        "~" +
        id_array +
        "~" +
        precios_array +
        "~" +
        cantidad_array,
    });
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: "Ocurrió un error interno." });
  }
});

router.get(
  "/render-niubiz-payment/:securityToken/:amount/:sessionKey/:expirationTime/:merchantId/:amount/:url",
  async (req, res) => {
    let newUrlParsed = req.params.url.replace(/[~]+/g, "/");
    let purchaseNumber = Math.floor(Math.random() * 1000000);
    newUrlParsed =
      BASE_URL_USER_PHOTO +
      "approve-order-payment-data/" +
      newUrlParsed +
      "/" +
      req.params.securityToken +
      "/" +
      req.params.amount +
      "/" +
      purchaseNumber;
    res.render("niubiz", {
      sessionKey: req.params.sessionKey,
      expirationTime: req.params.expirationTime,
      purchaseNumber,
      logo: "https://veritypc.com/wp-content/uploads/2015/01/logo_placeholder2.png",
      domain: "www.inkalandia.com",
      merchantId: req.params.merchantId,
      amount: req.params.amount,
      url: newUrlParsed,
    });
  }
);

module.exports = router;