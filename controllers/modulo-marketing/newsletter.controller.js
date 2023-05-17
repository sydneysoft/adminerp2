const ServiceSQL = require("../../services/services");
const logger = require("../../helpers/logger");
const { getDataSistema } = require("../../helpers/db");
const {catchError, getAllDataSession, notAuthorize} = require('../../helpers/modulo-tv/basicrequest.helpers')
class NewsletterController {
    constructor() {
 
        this.newsletter = new ServiceSQL("newsletter");
 
    }
    getNewsletter = async (req, res) => {
        let bookStore
        let { role, token, dataSistema, dataSession } = await getAllDataSession(req);
        try {
            if (role == 1 || role == 2) {
          
                bookStore = await this.newsletter.getAll()
             
            } else if (role == 3) {
                bookStore = await this.newsletter.getbyCompany(token)
 
            }


            res.render("modulo-marketing/newsletter/admin-newsletter", {
                bookStore,
                dataSession,
                dataSistema,
            });
        }
        catch (e) {
            logger.error("Error al mostrar newsletter", e)
        }
    }
}

module.exports = NewsletterController;
