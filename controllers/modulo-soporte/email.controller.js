const nodemailer = require("nodemailer");
const CONFIG = require("../../config/config");
const pug = require("pug");
const path = require("path");
const ServiceSQL = require("../../services/services");
const CryptoJS = require("crypto-js");
const logger = require("../../helpers/logger");
class EmailController {
  constructor() {
    this.service = new ServiceSQL("cotizaciones");
    this.setting = new ServiceSQL("configuracion_sistema");
    this.setting_email = new ServiceSQL("configuracion_correos");
    this.empresa = new ServiceSQL("empresas_marketplace");
  }

  actualizarEstadoTrue = async (id) => {
    await this.service.actualizar(dataEnviado);
  };
  actualizarEstadoFalse = async (id) => {
    const dataError = { condiciones: { enviado: false }, id: id };
    await this.service.actualizar(dataError);
  };
  postEmail = async (req, res) => {
    const role = req.session.rol_id
    let token = req.session.token;
    let casilla
    let datos_empresa
    let configuraciones
    let url_origin
    if (role == 1 || role == 2) {
      casilla = await this.setting_email.getbyCompany(0)
      configuraciones = await this.setting.getbyCompany(0);
      datos_empresa = await this.empresa.getById(0);
      url_origin = await this.empresa.getById(0)
    }
    else if (role == 3) {
      casilla = await this.setting_email.getbyCompany(token)
      configuraciones = await this.setting.getbyCompany(token);
      datos_empresa = await this.empresa.getById(token);
      url_origin = await this.empresa.getById(token)
    }

    if (casilla) {
      let bytes = CryptoJS.AES.decrypt(casilla[0].smpt_password, CONFIG.SECRET);

      let decryptd = bytes.toString(CryptoJS.enc.Utf8);

      const transporter = nodemailer.createTransport({
        host: casilla[0].smtp_host,
        service: casilla[0].smtp_service,
        auth: {
          user: casilla[0].smtp_correo,
          pass: decryptd,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const check = await this.service.getById(req.body.id);
      let datosEmpresa = {
        configuraciones: configuraciones,
        data: datos_empresa

      }



      let ref;
      if (check) {
        ref = url_origin + "/cotizaciones/" + req.body.id;
      } else {
        ref = url_origin + "/cotizaciones/error";
      }
      const mailOptions = {
        from: casilla[0].smtp_correo,
        to: req.body.to,
        subject: req.body.asunto,
        html: pug.renderFile(
          path.join(__dirname, "../../views/modulo-administrativo/cotizaciones", "email-enviado2.pug"),
          {
            descripcion: req.body.cuerpo,
            boton: ref,
            logo: datosEmpresa.configuraciones[0].logo,
            direccion: datosEmpresa.data[0].direccion,
            telefono: datosEmpresa.data[0].telefono,
            celular: datosEmpresa.data[0].whatsapp_corporativo,
            empresa_nombre: datosEmpresa.data[0].nombre,
            url: datosEmpresa.configuraciones[0].url,
          }
        ),
      };


      const falla = async () =>
        await this.service.actualizarEstadoEnviado(false, req.body.id).then();
      const enviado = async () =>
        await this.service.actualizarEstadoEnviado(true, req.body.id).then();

      transporter.sendMail(mailOptions, async function (error, info) {
        await enviado().then(() => res.status(200).json(info));
        if (error) await falla().then(() => {
          logger.error("Error al enviar email", error)
          res.status(400).json(error)
        })
      })
    } else {
      res.status(400).json({ error: "no esta configurado el servidor de email" });
    }
  };
}

module.exports = EmailController;
