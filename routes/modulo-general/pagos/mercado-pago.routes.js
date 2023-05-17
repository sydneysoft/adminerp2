const { Router } = require("express");
const router = Router();

//Método para generar Mercado Pago
router.post("/mercado-pago/:pago", async (req, res) => {
  let precio = parseFloat(req.params.pago);
  try {
    let queryData = "SELECT * FROM metodos_pagos WHERE id=2";
    let result = await db.query(con, queryData);
    mercadopago.configure({
      access_token: result[0].api_key,
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
    let preference = {
      items: [
        {
          title: "Pago Inkalandia",
          unit_price: precio,
          quantity: 1,
        },
      ],
      auto_return: "approved",
      back_urls: {
        success:
          BASE_URL_USER_PHOTO +
          "approve-order-payment/2/" +
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
      },
    };
    mercadopago.preferences
      .create(preference)
      .then(function (response) {
        res.json(response);
      })
      .catch(function (error) {
        console.log(error);
        res.json(error);
      });
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: "Error al realizar la transacción" });
  }
});


module.exports = router;