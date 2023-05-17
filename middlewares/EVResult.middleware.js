const {validationResult} = require('express-validator');

/**
 * Este middleware se combina con los middleware de express-validator
 * ejemplo.
 * app.post('/login', oneOf([body('email'), body('password')]), EVResult, async (req, res) => {});
 */ 
async function EVResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }
  next();
}

async function EVResultView(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('error/error', { errors: errors.array() });
  }
  next();
}

module.exports = {EVResult, EVResultView};