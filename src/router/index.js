const business = require("./business");
const router = require("express").Router();

router.use("/business", business);

module.exports = router;
