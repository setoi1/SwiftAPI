const router = require("express").Router();
const userHandler = require("../../handlers/userHandler");

router.post("/register", userHandler.register);
router.post("/login", userHandler.login);
router.post("/logout", userHandler.logout);
router.get("/dashboard", userHandler.dashboard);
router.get("/developer/dashboard", userHandler.developerDashboard);
router.get("/marketplace", userHandler.marketplace);

module.exports = router;
