const { Router } = require("express");
const router = Router();

const { ChatBotController } = require("../../controllers/modulo-generales/chatbots.controller");

const { catchError, getAllDataSession, notAuthorize } = require('../../helpers/modulo-tv/basicrequest.helpers');
const { check, oneOf, matchedData } = require('express-validator');
const { EVResult } = require('../../middlewares/EVResult.middleware');

const { service: ChatBotService } = ChatBotController;

router.get("/", async (req, res) => {
  try {
    let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
    if (role == 1 || role == 2) {
      token = 0;
      return res.render("modulo-generales/chatbots/superadmin", {
        dataSession,
        dataSistema
      });
    }

    let chatbot = await ChatBotService.getbyCompany(token);
    if (Array.isArray(chatbot) && chatbot.length == 0) {

      await ChatBotService.save([
        {
          nombre: "Cliengo",
          empresa_id: token
        },
        {
          nombre: "Livechat",
          empresa_id: token
        },
        {
          nombre: "Tidio",
          empresa_id: token
        }
      ]);

    }
    return res.render("modulo-generales/chatbots", {
      dataSession,
      dataSistema
    });
  } catch (error) {
    return catchError(res, error);
  }
});

router.get("/empresa/:id",
  check('id').isNumeric().withMessage('El id de la empresa debe ser un número'),
  EVResult, async (req, res) => {
    try {
      const { dataSession, dataSistema } = await getAllDataSession(req);

      let chatbot = await ChatBotService.getbyCompany(req.params.id);
      if (Array.isArray(chatbot) && chatbot.length == 0) {
        await ChatBotService.save([
          {
            nombre: "Cliengo",
            empresa_id: req.params.id
          },
          {
            nombre: "Livechat",
            empresa_id: req.params.id
          },
          {
            nombre: "Tidio",
            empresa_id: req.params.id
          }
        ]);
      }

      return res.render("modulo-generales/chatbots", {
        dataSession,
        dataSistema,
        empresa_id: req.params.id
      });
    } catch (error) {
      return catchError(res, error);
    }
  });

router.get("/chats/:empresa_id?", async (req, res) => {
  try {

  } catch (error) {
    return catchError(res, error);
  }
});

router.get("/method-chatbot/:empresa_id?",
  check('empresa_id').optional().isNumeric().withMessage('El id de la empresa debe ser un número'),
  EVResult, async (req, res) => {
    try {

      let { role, token, dataSession, dataSistema } = await getAllDataSession(req);
      let result

      if (role == 1 || role == 2) {
        token = req.params.empresa_id || 0;
      }

      result = await ChatBotService.getbyCompany(token)

        res.status(200).json({ chat: result })
     
    } catch (error) {
      return catchError(res, error)
    }
  });


router.put("/:id",
  check('id').isNumeric().withMessage('El id de la empresa debe ser un número'),
  // check('nombre').optional().isString().withMessage('El nombre debe ser un texto'),
  check('script').optional().isString().withMessage('El script debe ser un texto'),
  check('instrucciones').optional().isString().withMessage('Las instrucciones deben ser un texto'),
  check('estado').optional().isNumeric().withMessage('El estado debe ser un número'),
  check('empresa_id').optional().isNumeric().withMessage('El id de la empresa debe ser un número'),
  EVResult, async (req, res) => {

    try {

      let { role, token, dataSession, dataSistema } = await getAllDataSession(req);

      const allData = matchedData(req);

      if (role == 3) {
        allData.empresa_id = token;
      }

      const result = await ChatBotService.updateById(req.params.id, allData);

      res.json({
        status: "success",
        msg: "Configuración de chat actualizado correctamente",
      });

    } catch (error) {
      return catchError(res, error);
    }

  });


module.exports = router;

