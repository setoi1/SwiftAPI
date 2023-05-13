const router = require("express").Router();
const settingsHandler = require("../../handlers/settingsHandler");

router.post("/update", settingsHandler.update);

module.exports = router;
