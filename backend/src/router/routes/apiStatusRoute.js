const router = require("express").Router();
const apiStatusHandler = require("../../handlers/apiStatusHandler");

router.post("/status", apiStatusHandler.status);
router.post("/auth", apiStatusHandler.auth);

module.exports = router;
