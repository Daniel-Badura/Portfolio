// jshint esversion: 9
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Widoczek = require("../models/Widoczek");
const { widoczkiSchema, reviewSchema } = require("../schemas.js");
const Review = require("../models/review");
const {isLoggedIn} = require("../middleware/isLoggedIn");
// const flash = require('connect-flash');
// router.use(flash());

//  -------- Joi Schema Validation ----------
const valitateWidoczki = (req, res, next) => {
  const { error } = widoczkiSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};
const valitateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

router.get(
  "/widoczki",
  catchAsync(async (req, res) => {
    const widoczki = await Widoczek.find({});
    res.render("widoczki/index", { widoczki });
  })
);
// ------------ HOME ---------------------------------
router.get(
  "/widoczki/home",
  catchAsync(async (req, res) => {
    res.render("widoczki/home");
  })
);

router.get(
  "/widoczki/new",
  catchAsync(async (req, res) => {
    res.render("widoczki/new");
  })
);
// ------------ POST NEW-------------------------------
router.post(
  "/widoczki/new",
  isLoggedIn,
  valitateWidoczki,
  catchAsync(async (req, res) => {
    const widoczek = new Widoczek(req.body.widoczek);
    await widoczek.save();
    req.flash("success", "Dodano nowy widoczek");
    res.redirect(`/widoczki/${widoczek._id}`);
  })
);

router.post(
  "/widoczki/:id",
  isLoggedIn,
  valitateReview,
  catchAsync(async (req, res) => {
    const widoczek = await Widoczek.findById(req.params.id);
    const review = new Review(req.body.review);
    widoczek.reviews.push(review);
    await review.save();
    await widoczek.save();
    req.flash("success", "Dodano nową opinię!");
    res.redirect(`/widoczki/${widoczek._id}`);
  })
);
// ------------ SHOW ----------------------------------
router.get(
  "/widoczki/:id",
  catchAsync(async (req, res) => {
    const widoczek = await Widoczek.findById(req.params.id).populate("reviews");
    if (!widoczek) {
      req.flash("error", "Nie udało się znaleźć widoczku");
      return res.redirect("/widoczki");
    }
    res.render("widoczki/show", { widoczek });
  })
);
// ------------ EDIT ----------------------------------
router.get(
  "/widoczki/:id/edit",
  catchAsync(async (req, res) => {
    const widoczek = await Widoczek.findById(req.params.id);
    if (!widoczek) {
      req.flash("error", "Nie udało się znaleźć widoczku");
      return res.redirect("/widoczki");
    }
    res.render("widoczki/edit", { widoczek });
  })
);
// ------------ EDIT PUT -----------------------------
router.put(
  "/widoczki/:id",
  valitateWidoczki,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const widoczek = await Widoczek.findByIdAndUpdate(id, {
      ...req.body.widoczek,
    });
    res.redirect(`/widoczki/${widoczek._id}`);
  })
);
// ------------ DELETE -----------------------------
router.delete(
  "/widoczki/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const widoczek = await Widoczek.findById(req.params.id);
    req.flash("success", `Usunięto Widoczek ${widoczek.name}`);
    await Widoczek.findByIdAndDelete(id);
    res.redirect("/widoczki/");
  })
);
router.delete(
  "/widoczki/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Widoczek.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", `Usunięto Opinię!`);
    res.redirect(`/widoczki/${id}`);
  })
);

module.exports = router;
