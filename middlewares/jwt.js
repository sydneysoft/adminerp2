const jwt = require('jsonwebtoken')
const CONFIG = require("../config/config")
const { connectionOptions } = require("../database/config");
const logger = require('../helpers/logger');


const knex = require("knex")({
    client: "mysql",
    connection: connectionOptions,
});

//usuario conectado empresa o admin
const authenticateJWT = (req, res, next) => {
    let token = req.cookies.authcookie
    try {
        jwt.verify(token, CONFIG.SECRET, (err, payload) => {
            if (err) {
                res.status(403);
                res.render('403');
  
            }
            if (payload) {
 
                next();
            } else {
                res.redirect("/")
            }
        });

    } catch (error) {
        res.status(403);
        res.render('403');
 
    }


}

//usuario conectado empresa o admin
const isAdmin = (req, res, next) => {
    let token = req.cookies.authcookie
    try {
        jwt.verify(token, CONFIG.SECRET, (err, payload) => {
            if (err) {
                res.status(403);
                res.render('403');
            }


            let user_rol = payload.rol;
            if (user_rol == 1 || user_rol == 2) {
                next();
            } else {
                res.status(403);
                res.render('403');
            }
        });

    } catch (error) {
        res.status(403);
        res.render('403');
    }


}
const generarAcceso = (idModulo, req, res, next) => {


    let token = req.cookies.authcookie

    jwt.verify(token, CONFIG.SECRET, async (err, payload) => {
        if (err) {
            res.status(403);
            res.render('403');
        } else{
      
        let user_id = payload.id;
        let user_rol = payload.rol;
        if (user_rol == 1 || user_rol == 2) {
            logger.info("Acceso de admin")
            next();
        } else if (user_rol == 3) {

            const empresa = await knex.select("empresa_id").from("empresas_usuarios").where({ "usuario_id": user_id });
            const modulos = await knex.select().from("modulos_habilitado").where({ "empresa_id": empresa[0].empresa_id }).leftJoin('modulos_grupo', 'modulos_grupo.id_grupo', 'modulos_habilitado.id_grupo').where({ "modulos": idModulo });

            if (modulos.length) {
                next();
            } else {
                res.status(403);
                res.render('403');
            }

        } else {
            res.status(403);
            res.render('403');
        }
    }
    });


}

//modulo ecommerce
const access_mod_ecommerce = (req, res, next) => {
    try {
        generarAcceso(4, req, res, next)
    } catch (error) {
        res.status(403);
        res.render('403');
    }
}

//modulo finanzas
const access_mod_finanzas = (req, res, next) => {
    try {
        generarAcceso(1, req, res, next)
    } catch (error) {
        res.status(403);
        res.render('403');
    }
}

//modulo finanzas
const access_mod_rrhh = (req, res, next) => {
    try {
        generarAcceso(2, req, res, next)
    } catch (error) {
        res.status(403);
        res.render('403');
    }
}

//modulo administrativo
const access_administrative = (req, res, next) => {
    try {
        generarAcceso(7, req, res, next)
    } catch (error) {
        res.status(403);
        res.render('403');
    }
}

//modulo administrativo
const access_marketing = (req, res, next) => {
    try {
        generarAcceso(3, req, res, next)
    } catch (error) {
        res.status(403);
        res.render('403');
    }
}
//modulo administrativo
const access_tv = (req, res, next) => {
    try {
        generarAcceso(10, req, res, next)
    } catch (error) {
        res.status(403);
        res.render('403');
    }
}
module.exports = { authenticateJWT, access_mod_ecommerce, access_mod_finanzas, access_mod_rrhh, access_administrative, access_marketing, isAdmin };