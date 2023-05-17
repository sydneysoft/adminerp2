const { Router } = require("express");
const router = Router();

//Método para generar Pago y Pedido Contraentrega
router.post("/pago-contra-entrega/:pago", async (req, res) => {
  try {
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
      "INSERT INTO pedidos (usuario,tipo_pago,valor_servicio,valor_env,direccion_entrega,suma_subtotal,estado) VALUES" +
      " (" +
      token +
      ",10," +
      valor_servicio +
      "," +
      valor_envio +
      "," +
      direccion_entrega +
      ",'" +
      valor_pago_general +
      "','0')";
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

      res.json({
        status: "success",
        msg: "Se realizo el registro correctamente",
      });
    } else {
      res.json("Error al registrar tu pedido.");
    }
  } catch (e) {
    console.log(e);
    res.json({ status: "error", msg: "Error al realizar la transacción" });
  }
});


module.exports = router;