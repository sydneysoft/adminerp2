/**
 * Función para manejar respuestas exitosas 
 */
function successHandler (data, res, msg = "", status = 200) {
  res.status(status).json({
    ok: true,
    data: data,
    msg: msg
  });
}

module.exports = {
  successHandler
}