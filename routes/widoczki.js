// jshint esversion: 9
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const widoczki = require("../controllers/widoczki");
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
const validateWidoczki = (req, res, next) => {
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
// ------------ Wszystkie Widoczki ------------------------------------------
router.get("/widoczki", catchAsync(widoczki.wszystkieWidoczki));
// ------------ Moje Widoczki -----------------------------------------------
router.get("/widoczki/home", isLoggedIn, catchAsync(widoczki.mojeWidoczki));
// ------------ Dodaj Widoczki GET ------------------------------------------
router.get("/widoczki/new", catchAsync(widoczki.dodajWidoczekGet));
// ------------ Dodaj Widoczki POST------------------------------------------
router.post(
  "/widoczki/new",
  isLoggedIn,
  validateWidoczki,
  catchAsync(widoczki.dodajWidoczekPost)
);
// ------------ Dodaj Review-------------------------------------------------
router.post(
  "/widoczki/:id",
  isLoggedIn,
  valitateReview,
  catchAsync(widoczki.dodajWidoczekReview)
);
// ------------ Wyświetl Widoczek -------------------------------------------
router.get("/widoczki/:id", catchAsync(widoczki.showWidoczek));
// ------------ Edytuj Widoczek ---------------------------------------------
router.get(
  "/widoczki/:id/edit",
  isAuthorizedReview,
  catchAsync(widoczki.edytujWidoczekGet)
);
// ------------ EDIT PUT ----------------------------------------------------
router.put(
  "/widoczki/:id",
  isLoggedIn,
  isAuthorizedWidoczek,
  validateWidoczki,
  catchAsync(widoczki.edytujWidoczekPut)
);
// ------------- Usuń Widoczek  ---------------------------------------------
router.delete(
  "/widoczki/:id",
  isLoggedIn,
  isAuthorizedWidoczek,
  catchAsync(widoczki.deleteWidoczek)
);
// ------------- Usuń Widoczek Review ---------------------------------------
router.delete(
  "/widoczki/:id/reviews/:reviewId",
  isAuthorizedReview,
  catchAsync(widoczki.deleteWidoczekReview)
);

module.exports = router;
