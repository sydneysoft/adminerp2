const logger = require("./logger");

/**
 * Funcion para manejar los errores
 * @param {*} error 
 * @param {*} req 
 * @param {*} res 
 * @param {boolean} view
 * @returns  
 */
function errorHandler(error, req, res, view = true) {
  logger.error("Error: ", error);


  if (view) {
      // errores de redireccion de rutas todos a /
    if (res.statusCode >= 300 && res.statusCode < 400) {
      return res.redirect("/");
    }

    // errores relacionados al cliente renderizan la vista ./views/error/400.pug
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return res.render("error/error", {
        error: error.message,
        statusCode: res.statusCode,
      });
    }

    // errores relacionados al servidor renderizan la vista ./views/error/500.pug
    if (res.statusCode >= 500 && res.statusCode < 600) {
      return res.render("error/500", {
        errorMessage: error.message,
        statusCode: res.statusCode,
      });
    }

  } else {
    return res.json({
      ok: false,
      msg: error.message,
    });
  }
  // En caso que no coincidan con los anteriores
  return res.json({
    ok: false,
    msg: error.message
  });

}

module.exports = {
  errorHandler
}