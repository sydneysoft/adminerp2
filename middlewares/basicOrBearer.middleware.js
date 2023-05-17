function basicOrBearer(req, res, next) {
  try {
    
    if (req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ');
      //- Beared decoded jwt
      if (authorization[0] == 'Bearer') {
        var decoded = jwt.verify(authorization[1], CONFIG.SECRET);
        req.session.usuario_id = decoded.id;
        req.session.rol_id = decoded.rol;
        req.session.dataUsuario = { nombre: decoded.nombre }
        if (decoded.rol == 3) {
          req.session.token = decoded.empresa_id;
        }
        return next();
      }

      // Basic decoded base64
      if (authorization[0] == 'Basic') {
        var decoded = Buffer.from(authorization[1], 'base64').toString('ascii');
        var decoded = decoded.split(':');
        req.session.user = decoded[0];
        req.session.password = decoded[1];
        req.session.session_type = 'basic';
        return next();
      }
    }
    throw new Error('No autorizado :c');
  } catch (error) {  
    return res.status(401).json({
      ok: false,
      msg: 'No autorizado :c'
    });
  }
  
}


module.exports = {
  basicOrBearer
}