const logger = require('../helpers/logger')
const nodemailer = require('nodemailer');
const CryptoJS = require("crypto-js");
const pug = require('pug');
const path = require("path");
const config = require("../config/config");

class SendEmail  {
  constructor (data, correo) {
    this.data = data;
    this.correo = correo;
  }

  /**
   * @description crea el transporter para enviar el email
   * @returns 
   */
  crearTransporter = () => {
    
    const password = CryptoJS.AES.decrypt(this.correo.smpt_password, config.SECRET).toString(CryptoJS.enc.Utf8);
    
    return nodemailer.createTransport({
      host: this.correo.smtp_host,
      // service: correo.smtp_service, //
      port: this.correo.smpt_puerto,
      auth: {
        user: this.correo.smtp_user,
        pass: password
      },
      tls: {
        rejectUnauthorized: false,
      }
    });
  }

  generarEmailHtml = (view = "ejemplo.pug", subject = "", data = {}) => {
    return {
      from: this.correo.smtp_correo,
      to: this.data.email,
      subject,
      html: pug.renderFile(
        path.join(__dirname, "../views/email/", view),
        data
      )
    }
  }

  sendEmailRegistro = async () => {
    const transporter = this.crearTransporter();
    const mailOptions = this.generarEmailHtml("registrar-empresa.pug", "Registro exitoso", this.data);
    return await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, async function (error, info) {
        if (info) {
          console.info("Email Enviado al usario", info);
          resolve(info);
        } else {
          logger.error("Error al enviar email", error)
          reject(error);
        }
      });
    });
  }

}


module.exports = { SendEmail };