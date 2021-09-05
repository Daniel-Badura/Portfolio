const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

// ------------------CALCULATOR-------------------------------------

router.get(
  "/",
  catchAsync(async (req, res) => {
    res.render("calculator/index", {});
  })
);

module.exports = router;
