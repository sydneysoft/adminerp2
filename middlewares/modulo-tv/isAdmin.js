const { getAllDataSession, catchError, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers')

/**
 * Este middleware solo se asegura que crear y elimnar menu sea por parte del administrador
 */
const isAdminMiddleware = async (req, res, next) => {
  try {
    const {role} = await getAllDataSession(req);
    if (role == 2) {
      next();
    } else {
      res.status(403);
      return res.render('403');
    }
  } catch (error) {
    return catchError(res, error);
  }
}

const isSuperAdminMiddleware = async (req, res, next) => {
  try {
    const {role} = await getAllDataSession(req);
    if (role == 1) {
      next();
    } else {
      res.status(403);
      return res.render('403');
    }
  } catch (error) {
    return catchError(res, error);
  }
}

const isAnyAuth = async (req, res, next) => {
  try {
    const {role} = await getAllDataSession(req);
    if (role == 1 || role == 2 || role == 3) {
      next();
    } else {
      throw new Error('No autorizado');
    }
  } catch (error) {
    res.status(403);
    return res.render('403');
  }
}

const isAdminSuperAdminMiddleware = async (req, res, next) => {
  try {
    const {role} = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      next();
    } else {
      res.status(403);
      return res.render('403');
    }
  } catch (error) {
    return catchError(res, error);
  }
}

module.exports = { isAdminMiddleware, isSuperAdminMiddleware, isAnyAuth, isAdminSuperAdminMiddleware }