const express = require("express");
const business = require("../controllers/businessController.js");
const router = express.Router();

//post
router.route("/files").post(business.files);
router.route("/create").post(business.create);
router.route("/get/:id").get(business.get);

module.exports = router;
