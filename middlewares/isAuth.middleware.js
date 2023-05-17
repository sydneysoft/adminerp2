const {errorHandler} = require("../helpers/errorHandler.helpers");

function isAuthView (req, res, next) {
  if (req.session.token) {
    return next();
  }
  return res.redirect("/login");
  return errorHandler(new Error("No tienes autorización para acceder a este recurso"), req, res);
}

function isAuthApi (req, res, next) {
  if (req.session.token) {
    return next();
  }
  return res.status(401).json({ msg: "No tienes autorización para acceder a este recurso" });
}

module.exports = {
  isAuthView,
  isAuthApi
}