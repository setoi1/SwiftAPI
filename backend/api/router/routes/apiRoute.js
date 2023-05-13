const router = require("express").Router();
const apiHandler = require("../../handlers/apiHandler");

router.post("/new", apiHandler.list);
router.post("/retrieve", apiHandler.retrieveAPIByID);
router.get("/search", apiHandler.search);
router.post('/change-vis', apiHandler.changeVisibility);
router.post("/is-owner", apiHandler.isOwner);
router.post("/is-subscribed", apiHandler.isSubscribed);
module.exports = router;
