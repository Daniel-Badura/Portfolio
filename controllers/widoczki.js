// jshint esversion: 9
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Widoczek = require("../models/Widoczek");
const { widoczkiSchema, reviewSchema } = require("../schemas.js");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const ExpressError = require("../utils/ExpressError");
const {
  isAuthorizedWidoczek,
  isAuthorizedReview,
} = require("../middleware/isAuthorized");
// const flash = require('connect-flash');
// router.use(flash());

//  -------- Joi Schema Validation ----------
module.exports.wszystkieWidoczki = async (req, res) => {
  const widoczki = await Widoczek.find({});
  res.render("widoczki/index", { widoczki });
};
module.exports.mojeWidoczki = async (req, res) => {
  if (req.user) {
    const widoczki = await Widoczek.find({ author: req.user.username });
    res.render("widoczki/home", { widoczki });
  } else {
    req.flash("error", "Aby wyświetlić swoje widoczki, musisz się zalogować");
    res.render("widoczki/login");
  }
};
module.exports.dodajWidoczekGet = async (req, res) => {
  res.render("widoczki/new");
};
module.exports.dodajWidoczekPost = async (req, res) => {
  const widoczek = new Widoczek(req.body.widoczek);
  await widoczek.save();
  req.flash("success", "Dodano nowy widoczek");
  res.redirect(`/widoczki/${widoczek._id}`);
};
module.exports.dodajWidoczekReview = async (req, res) => {
  const widoczek = await Widoczek.findById(req.params.id);
  const review = new Review(req.body.review);
  widoczek.reviews.push(review);
  await review.save();
  await widoczek.save();
  req.flash("success", "Dodano nową opinię!");
  res.redirect(`/widoczki/${widoczek._id}`);
};
module.exports.showWidoczek = async (req, res) => {
 
  const widoczek = await Widoczek.findById(req.params.id).populate("reviews");
  if (!widoczek) {
    req.flash("error", "Nie udało się znaleźć widoczku");
    return res.redirect("/widoczki");
  }
  res.render("widoczki/show", { widoczek});
};
module.exports.edytujWidoczekGet = async (req, res) => {
  const widoczek = await Widoczek.findById(req.params.id);
  if (!widoczek) {
    req.flash("error", "Nie udało się znaleźć widoczku");
    return res.redirect("/widoczki");
  }
  res.render("widoczki/edit", { widoczek });
};
module.exports.edytujWidoczekPut = async (req, res) => {
  const { id } = req.params;
  console.log(req.user.username);
  const widoczek = await Widoczek.findByIdAndUpdate(id, {
    author: req.user.username,
    ...req.body.widoczek,
  });
  res.redirect(`/widoczki/${widoczek._id}`);
};
module.exports.deleteWidoczek = async (req, res) => {
  const { id } = req.params;

  const widoczek = await Widoczek.findById(req.params.id);
  req.flash("success", `Usunięto Widoczek ${widoczek.name}`);
  await Widoczek.findByIdAndDelete(id);
  res.redirect("/widoczki/");
};
module.exports.deleteWidoczekReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Widoczek.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", `Usunięto Opinię!`);
  res.redirect(`/widoczki/${id}`);
};
