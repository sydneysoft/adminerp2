const { Router } = require("express"),
    router = Router(),
    NewsletterController = require("../../controllers/modulo-marketing/newsletter.controller");

router.get("/", new NewsletterController().getNewsletter);


module.exports = router;
