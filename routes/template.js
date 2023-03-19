const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

// ------------------TEMPLATE-------------------------------------
router.get(
  "/template",
  catchAsync(async (req, res) => {
    res.render("template/index", {});
  })
);

module.exports = router;
