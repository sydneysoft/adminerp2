const { getDataSistema } = require('../db.js')
const logger = require('../logger.js')
/**
 * Handler para el catch
 * @param {*} res 
 * @param {Error} error 
 * @returns any
 */
const catchError = (res, error) => {
  logger.error("Error: ", error);
  return res.status(400).json({
    ok: false,
    msg: error.message,
  });
}
/**
 * Devuelve información de sistema y de session (auth)
 * @param {*} req 
 * @returns {token, dataSession, dataSistema, role}
 */
const getAllDataSession = async (req) => {
  const rol_id = req.session.rol_id;
  let token = null;
  if (rol_id == 3) {
    token = req.session.token;
  }
  
  const dataSession = req.session;
  let dataSistema;
  if(token) {
    dataSistema = await getDataSistema(token);
  } else {
    dataSistema = await getDataSistema(0);
  }
  const dataUsuario = req.session.dataUsuario
  return {
    token,
    dataSession,
    dataSistema,
    role: rol_id,
    dataUsuario,
    usuario_id: req.session.usuario_id
  }
}
/**
 * Respuesta en caso que no exista una session
 * @param {*} res 
 * @returns any
 */
const notAuthorize = (res) => {
  return res.status(401).json({
    ok: false,
    msg: 'No esta autorizado para esta acción.'
  })
}

module.exports = {
  catchError,
  getAllDataSession,
  notAuthorize
}