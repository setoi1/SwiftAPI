const router = require("express").Router();
const subscriptionHandler = require("../../handlers/subscriptionHandler");

router.post("/subscribe", subscriptionHandler.subscribe);
router.post("/success", subscriptionHandler.checkSubscription);

module.exports = router;
