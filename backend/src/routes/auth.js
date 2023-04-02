const router = require("express").Router();
const controller = require("../controller");

//ROUTES FOR REGISTER, and LOG IN
router.post("/register", controller.auth.registerAccount);
router.get("/login", controller.auth.loginAccount);
router.get("/logout", controller.auth.logoutAccount);

module.exports = router;
