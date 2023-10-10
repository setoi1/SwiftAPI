const router = require("express").Router();
const exampleHandler = require("../../handlers/exampleHandler");

router.post("/test", exampleHandler.test);

module.exports = router;