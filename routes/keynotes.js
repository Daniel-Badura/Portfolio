//jshint esversion:9
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Score = require("../models/scores");


router.get(
  "/",
  catchAsync(async (req, res) => {
    res.render("keynotes/index", {});
  })
);
router.get(
  "/scoreboard",

  catchAsync(async (req, res) => {
    const scores = await Score.find({}).sort({ score: -1 });
    res.render("keynotes/scoreboard", { scores });
  })
);
router.post(
  "/",
  catchAsync(async (req, res) => {
    const score = new Score(req.body.keynotes);
    await score.save();
    req.flash("success", "Zapisano");
    res.redirect("/keynotes");
  })
);

module.exports = router;