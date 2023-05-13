const router = require("express").Router();
const sessionValidationHandler = require("../../handlers/sessionValidationHandler");

router.post("/", sessionValidationHandler.validate);

module.exports = router;
