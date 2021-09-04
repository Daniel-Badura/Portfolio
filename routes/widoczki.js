// jshint esversion: 9
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const widoczki = require("../controllers/widoczki");
const { widoczkiSchema, reviewSchema } = require("../schemas.js");
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
router.route("/widoczki/new")
  .get(catchAsync(widoczki.dodajWidoczekGet))
  // ------------ Dodaj Widoczki POST------------------------------------------
  .post(isLoggedIn, validateWidoczki, catchAsync(widoczki.dodajWidoczekPost));
// ------------ Edytuj Widoczek ---------------------------------------------
router
  .route("/widoczki/:id/edit")
  .get(isAuthorizedWidoczek, catchAsync(widoczki.edytujWidoczekGet));
// ------------ Wyświetl Widoczek -------------------------------------------

router
  .route("/widoczki/:id")
  .get(catchAsync(widoczki.showWidoczek))
  // ------------ EDIT PUT ----------------------------------------------------
  .put(
    isLoggedIn,
    isAuthorizedWidoczek,
    validateWidoczki,
    catchAsync(widoczki.edytujWidoczekPut)
  )
  // ------------ Dodaj Review-------------------------------------------------
  .post(isLoggedIn, valitateReview, catchAsync(widoczki.dodajWidoczekReview))
  // ------------- Usuń Widoczek  ---------------------------------------------
  .delete(
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
