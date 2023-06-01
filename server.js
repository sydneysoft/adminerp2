const express = require('express');
const path = require('path');
const moment = require("moment");
const cors = require("cors");
const helmet = require("helmet");
const CONFIG = require("./config/config")
const session = require("express-session");
const logger = require('./helpers/logger');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const {body, validationResult, matchedData, oneOf} = require('express-validator');
const {basicOrBearer} = require('./middlewares/basicOrBearer.middleware');

const i18n = require("i18n-express");

require('dotenv').config()

// const { dbConnection } = require('./database/config');


// const { getDataSistema} = require('./helpers/db');
const { authenticateJWT, access_mod_ecommerce, access_mod_finanzas, access_mod_rrhh, access_administrative, access_marketing, isAdmin, access_tv } = require("./middlewares/jwt");
const router = require('./routes/register.api.routes');
const app = express();

app.use(cookieParser(CONFIG.SECRET));

app.use(session({
  secret: CONFIG.SECRET,
  resave: true,
  cookie: { maxAge: 8 * 60 * 60 * 1000 },  // 8 hours
  saveUninitialized: true,
  // store: sessionStore,
}));

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Configuracion de i18n-express: https://www.npmjs.com/package/i18n-express
app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["en", "es"],
  textsVarName: 'translation',
  cookieLangName: 'ulang'
}));


app.set("view engine", "pug");
app.locals.basedir = path.join(__dirname, 'views');

app.use(express.static(path.join(__dirname, "public")));

app.locals.moment = require("moment");
app.locals.moment.locale("es");

app.use("/api/v1/auth/register", basicOrBearer, require("./routes/register.api.routes"));

var whitelist = ['http://localhost:3000', 'http://localhost:3002']
var corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
 


app.use(cors());


//Conexión a la Base de Datos Interna
// const { db, con } = dbConnection();


app.get("/", async (req, res) => {
  res.render("modulo-usuarios/login/admin-login",);
});
 
// login
app.use("/login", require("./routes/modulo-usuarios/login.routes"))

//Cerrar sesión
app.get("/cerrarSesion", async function (req, res) {
  try {
    const dataSession = req.session;
    if (dataSession.dataUsuario) {
      const { correo, id } = dataSession.dataUsuario
      if (!!correo && !!id) {
        await updateSessionStatus({ correo, id }, { sessionStatus: moment().format("DD/MM/YYYY HH:mm:ss") });
      }
      req.session.destroy();
    }
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
    console.log(error);
  }
});



// miscelaneos (Mientras se encuentra un mejor lugar para ubicarlos)
app.use('/', require('./routes/modulo-general/miscelaneos.routes'));

// Facturacion
app.use('/', require('./routes/modulo-general/facturacion.routes'));

app.use("/registro", require("./routes/modulo-usuarios/registro.routes"))



// Middleware que verifica si existe el authcookie en las cookies, si existe lo decodifica y lo guarda en la session
// y si no existe redirecciona a la pagina de login
// Todas las rutas que necesitan auth deben ir despues de este middleware
app.use(function (req, res, next) {
  try {
  
    if (req.cookies.authcookie) {
      var decoded = jwt.verify(req.cookies.authcookie, CONFIG.SECRET);
      req.session.usuario_id = decoded.id;
      req.session.rol_id = decoded.rol;
      req.session.dataUsuario = { nombre: decoded.nombre }
  
      if (decoded.rol == 3) {
        req.session.token = decoded.empresa_id;
      }
      return next(); 
    }

    throw new Error('No autorizado');
  } catch(err) {
    return res.status(401).json({
      msg: "No autorizado"
      });
  }
});


// uuid para generar token
app.get("/generate-token", async(req, res) => {
  try {
    const token = uuidv4();
    return res.json({
      token
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al generar token"
    });
  }
})

//modulo administrativo JWT SE INCORPORA EN EL ROUTER NO ACA PORQUE SINO NO PERMITE VER EMAILS!
app.use("/cotizaciones", require("./routes/modulo-administrativo/cotizaciones.routes"))

// URL que generan metodos de pago
app.use("/admin-metodos-pago", require('./routes/modulo-general/pagos/index.routes'));

//inicio
app.use("/admin-servicios-entrega", authenticateJWT, require("./routes/modulo-general/delivery.routes"))
app.use("/admin-agregar-css", authenticateJWT, require("./routes/modulo-general/estilos.routes"));
app.use("/acciones-masivas", authenticateJWT, require("./routes/modulo-soportes/acciones-masivas.routes"));
app.use("/send-email", authenticateJWT, require("./routes/modulo-soportes/email.routes"));
app.use("/admin-configuracion-chatbot", authenticateJWT, require("./routes/modulo-general/chatbots.routes"));
app.use("/admin-galeria", authenticateJWT, require("./routes/modulo-general/galeria.routes"));
app.use("/admin-sistema", authenticateJWT, require("./routes/modulo-general/configuracion-sistema.routes"));

app.use("/admin-regiones", authenticateJWT, require("./routes/modulo-general/regiones.routes"));
app.use("/admin-shipping", authenticateJWT, require("./routes/modulo-general/shipping/index.routes"));



app.use("/admin-marketplace", isAdmin, require("./routes/modulo-superadmin/marketplace.routes"));
app.use("/admin-configuraciones", require('./routes/modulo-configuraciones/configuraciones.routes'));

// app.use("/admin-marketplace", isAdmin, require("./routes/modulo-superadmin/marketplace.routes"));
app.use("/admin-empresas", isAdmin, require("./routes/modulo-superadmin/empresas.routes"))

// app.use("/registro", require("./routes/modulo-usuarios/registro.routes"))
// app.use("/login", require("./routes/modulo-usuarios/login.routes"))
// app.use("/usuario", require("./routes/modulo-usuarios/usuario.routes"))
// app.use("/admin-usuarios", authenticateJWT, require("./routes/modulo-usuarios/admin-usuarios.routes"));

//modulo usuarios
app.use("/usuario", authenticateJWT, require("./routes/modulo-usuarios/usuario.routes"))
app.use("/admin-usuarios", authenticateJWT, require("./routes/modulo-usuarios/admin-usuarios.routes"));
app.use("/admin-galeria", authenticateJWT, require("./routes/modulo-general/galeria.routes"));


app.use("/get-modulos",  require("./routes/modulo-general/modulos.routes"));
app.use("/admin-galeria",  authenticateJWT, require("./routes/modulo-general/galeria.routes"));

app.use('/admin-video-prime', require('./routes/modulo-tv/modulo-video-prime/video-prime.routes'));
app.use('/admin-modusuarios', require('./routes/modulo-superadmin/modusuario.routes'));

// app.use("/", require("./routes/general.routes"));



// ********************* MODULOS RECURSOS HUMANOS *********************

//modulo recursos humanos
app.use('/admin-trabajadores', access_mod_rrhh, require('./routes/modulo-recursos-humanos/workers.routes'));
app.use('/admin-choferes', access_mod_rrhh, require('./routes/modulo-recursos-humanos/drivers.routes'));
app.use('/admin-libro-reclamaciones', access_mod_rrhh, require('./routes/modulo-recursos-humanos/libro-reclamaciones.routes'));
app.use('/admin-sesiones', access_mod_rrhh, require('./routes/modulo-recursos-humanos/sesiones.routes'));


// ********************* MODULOS FINANZAS *********************
//modulo finanzas
// access_mod_finanzas,
app.use("/admin-pago-personal",  require("./routes/modulo-financiero/pago-personal.routes"));
app.use("/admin-pago-proveedores", require("./routes/modulo-financiero/pago-proveedores.routes"));
app.use("/admin-insumos", require("./routes/modulo-financiero/insumos.routes"));
app.use("/admin-proveedores", require("./routes/modulo-financiero/proveedores.routes"));
app.use("/admin-personal", require("./routes/modulo-financiero/personal.routes"));
app.use("/admin-monedas", require("./routes/modulo-financiero/monedas.routes"));
app.use("/admin-impuestos", require("./routes/modulo-financiero/impuestos.routes"));


// ********************* MODULOS ECCOMERCE *********************
//modulos ecommerce
// access_mod_ecommerce,
app.use("/admin-tratamientos", require("./routes/modulo-ecommerce/tratamientos.routes"));
app.use("/admin-prendas", require("./routes/modulo-ecommerce/prendas.routes"));
app.use("/admin-productos", require("./routes/modulo-ecommerce/productos.routes"));
app.use("/admin-categorias", require("./routes/modulo-ecommerce/categorias.routes"));
app.use("/admin-subcategorias", require("./routes/modulo-ecommerce/subcategorias.routes"));
app.use("/admin-almacenes", require("./routes/modulo-ecommerce/almacenes.routes"));
app.use("/stock",  require("./routes/modulo-ecommerce/stock.routes"));
app.use("/admin-marcas", require("./routes/modulo-ecommerce/marcas.routes"));
app.use("/admin-sedes", require("./routes/modulo-ecommerce/sedes.routes"));
app.use("/admin-pedidos", require("./routes/modulo-ecommerce/pedidos.routes"));
app.use("/admin-pedidos-cancelados", require("./routes/modulo-ecommerce/pedidos-cancelados.routes"));
app.use("/admin-pedidos-pendientes", require("./routes/modulo-ecommerce/pedidos-pendientes.routes"));
app.use("/admin-filtros", require("./routes/modulo-ecommerce/filtros.routes"));
app.use("/admin-catalogos", require("./routes/modulo-ecommerce/catalogos.routes"));


// *************************** MODULOS CLINICAS ***************************

//app.use('/admin-citas-medicas', require('./routes/modulo-clinica/citas.routes'));
//app.use('/admin-configuracion-clinica', require('./routes/modulo-tv/modulo-general/clinica.routes'));
app.use('/admin-clinica', require('./routes/modulo-tv/modulo-clinica/clinica.routes'));
app.use("/admin-companias-seguros", require("./routes/modulo-clinica/companias-seguros.routes"));
app.use("/admin-cetratamientos", require("./routes/modulo-clinica/tratamientos.routes"));
app.use("/admin-pacientes", require('./routes/modulo-clinica/pacientes.routes'));
app.use("/admin-medicos", require("./routes/modulo-clinica/medicos.routes"));
app.use("/admin-especialidades", require("./routes/modulo-clinica/especialidad.routes"));
app.use("/admin-clinica/sedes", require("./routes/modulo-clinica/sedes.routes"));
app.use("/admin-visitas-medicas", require("./routes/modulo-clinica/visitas-medicas.routes"));
app.use("/admin-citas-medicas", require("./routes/modulo-clinica/citas.routes"));
app.use('/admin-empresa-datatable', require('./routes/modulo-tv/modulo-general/empresa-datatable.routes'));

// *************************** MODULOS MARKETING ***************************

app.use("/admin-portadas", access_marketing, require("./routes/modulo-marketing/portadas.routes"));
app.use("/admin-newsletter", access_marketing, require("./routes/modulo-marketing/newsletter.routes"));
app.use("/admin-ceredes", access_marketing, require("./routes/modulo-marketing/ce-redes.routes"));
app.use("/admin-banners", access_marketing, require("./routes/modulo-marketing/banner.routes"));
app.use("/admin-sliders", access_marketing, require("./routes/modulo-marketing/page-sliders.routes"));
app.use('/admin-branding',access_marketing, require('./routes/modulo-marketing/branding.routes'));
app.use("/admin-portadas",access_marketing, require("./routes/modulo-marketing/portadas.routes"));


// modulos
app.use('/admin-faqs', require('./routes/modulo-general/faqs.routes'));
// app.use('/admin-sitios-web', require('./routes/modulo-tv/modulo-sitios-web/sitios-web.routes'));
app.use('/admin-sitios-web', require('./routes/modulo-general/sitios-web.routes'));
app.use("/admin-blog", require("./routes/modulo-blog/index.routes"));
app.use('/admin-gmaps', require('./routes/modulo-tv/modulo-gmaps/map.routes'));
app.use('/admin-footer', require("./routes/modulo-tv/modulo-general/footer.routes"));
app.use('/admin-paginas', require("./routes/modulo-tv/modulo-paginas/paginas.routes"));
app.use('/admin-horarios', require("./routes/modulo-tv/modulo-ha/horarios.routes"));
app.use('/admin-contactos', require('./routes/modulo-tv/modulo-contacto/contacto.routes'));
app.use('/admin-ceservicios', require('./routes/modulo-tv/modulo-ceservicio/servicios.routes'));
app.use('/admin-redes-sociales', require('./routes/modulo-tv/modulo-redes-sociales/redes-sociales.routes'));

app.use('/get-doctors-names-all', require('./routes/apis/clinicas-apis.routes'));
// Modulo de barberia
app.use("/admin-cortes", require("./routes/modulo-peluquerias/index.routes"));

// Modulo TV
app.use('/admin-tv', require('./routes/modulo-tv/modulo-tv/tv.routes'));

app.use('/admin-formulario-contactos', require('./routes/modulo-tv/modulo-formulario-contacto/formulario-contacto.routes'));
app.use('/admin-informacion-contactos', require('./routes/modulo-tv/modulo-formulario-contacto/informacion-contacto.routes'));
app.use('/admin-reservaciones', require('./routes/modulo-tv/modulo-reservaciones/reservaciones.routes'));
app.use('/admin-calendar', require('./routes/modulo-tv/modulo-calendar/fullcalendar.routes'));
app.use('/admin-paquetes', require('./routes/modulo-tv/modulo-paquete/producto.routes'));
app.use('/admin-itemlist', require('./routes/modulo-tv/modulo-itemlist/itemlist.routes'));
app.use('/admin-navbar', require('./routes/modulo-tv/modulo-navbar/navbar.routes'));
app.use('/admin-roles-permisos', require('./routes/modulo-roles-permisos/roles-permisos.routes'));
app.use('/admin-marketplace-categorias', require('./routes/modulo-general/marketplace-categorias/maketplace-categoria.routes'));

app.use('/admin-geolocalizacion', require('./routes/modulo-general/geolocalizacion.routes'));

//CASINO
app.use('/admin-casino', require('./routes/modulo-casino/casino.routes'));

app.use('/admin-planes-landing', require('./routes/modulo-general/planes-landing.routes'));

app.use('/', require('./routes/modulo-general/generales.routes'));

app.use("/landing", require("./routes/modulo-general/landing.routes.js"))
app.use("/admin-secciones-configuracion", require("./routes/modulo-general/secciones-configuracion.routes"));
app.use("/admin-ventanas-emergentes", require("./routes/modulo-general/ventanas-emergentes.routes"));
app.use("/admin-documentos", require("./routes/modulo-general/configuracion/documentos.routes"));
app.use("/admin-bancos", require("./routes/modulo-general/configuracion/bancos.routes"));
app.use("/admin-seguros", require("./routes/modulo-general/configuracion/seguros.routes"));



app.use("/register-email-template", async (req, res) => {
  try {
    const usuario = [{
      correo: "correo@usuario.com",
      nombre: "Nombre del usuario",
      direccion: "Direccion del usuario",
      celular: "+503 0000-0000"
    }];
    const empresa = [{
      nombre: "Nombre de la empresa",
      slug: "nombre-de-la-empresa",
      email_corporativo: "correo@usuario.com",
      email_contacto: "correo@contacto.com"
    }];

    return res.render("email/registrar-empresa.pug", {
      usuario,
      empresa
    });
  } catch (error) {
    return res.status(404).json({
      ok: false,
      error
    })
  }
})

app.use("/", function(req, res, next) {
  if (req.session.rol_id == 1) {
    next();
  } else {
    res.redirect("/usuario");
  }
}, require("./routes/modulo-general/modulos.routes"));




const PORT_SERVER = process.env.PORT || 3000;

app.listen(PORT_SERVER, () => {
  console.log(`Servidor iniciado en el puerto ${PORT_SERVER}`);
});
