const router = require("express").Router();
const controller = require("../controller");

router.put("/edit", controller.user.editAccount);
router.delete("/delete", controller.user.deleteAccount);
router.get("/view", controller.user.viewAccount);
router.get("/viewAll", controller.user.viewAllAccount);

module.exports = router;
