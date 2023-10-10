const router = require("express").Router();

const subscriptionRoute = require("./routes/subscriptionRoute");
const apiRoute = require("./routes/apiRoute");
const userRoute = require("./routes/userRoute");
const sessionValidateRoute = require("./routes/sessionValidationRoute");
const settingsRoute = require("./routes/settingsRoute");
const apiStatusRoute = require("./routes/apiStatusRoute");

router.use("/api", apiRoute);
router.use("/subscription", subscriptionRoute);
router.use("/user", userRoute);
router.use("/session", sessionValidateRoute);
router.use("/settings", settingsRoute);
router.use("/apistatus", apiStatusRoute);

module.exports = router;
