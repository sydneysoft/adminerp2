const logger = require("../../utils/loggers");
const nodemailer = require("nodemailer");
const request = require("request");
 

function send(templateFile, subject, info) {
  let options = {
    uri: `/template/email/${templateFile}`,
    method: "POST",
    json: info,
  };
  request(options, async function (error, response, body) {
    if (error) logger.error("Error al enviar email", error);
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: CONFIG.EMAIL.TEST_EMAIL,
        pass: CONFIG.EMAIL.PASS_EMAIL,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    let mailOptions = {
      from: "Admin <noreply@admin.com>",
      to: to,
      subject: subject,
      html: body,
    };
    await transporter.sendMail(mailOptions, function (error, info) {
      console.info("Email Enviado", info);
      if (error) console.error("Error al enviar email", error);
    });
  });
}

module.exports = send;
