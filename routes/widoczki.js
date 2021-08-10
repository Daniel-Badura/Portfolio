// jshint esversion: 9
const express =require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Widoczek = require("../models/Widoczek");
const { widoczkiSchema, reviewSchema } = require("../schemas.js");
const Review = require("../models/review");
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
    "",
    catchAsync(async (req, res) => {
      const widoczki = await Widoczek.find({});
      res.render("widoczki/index", { widoczki });
    })
  );
  // ------------ HOME ---------------------------------
  router.get(
    "/home",
    catchAsync(async (req, res) => {
      res.render("widoczki/home");
    })
  );

  router.get(
    "/new",
    catchAsync(async (req, res) => {
      const widoczki = await Widoczek.find({});
      res.render("widoczki/new", { widoczki });
    })
  );
  // ------------ POST NEW-------------------------------
  router.post(
    "",
    valitateWidoczki,
    catchAsync(async (req, res) => {
      // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)

      const widoczek = new Widoczek(req.body.widoczek);
      await widoczek.save();
      req.flash('success', 'Dodano nowy widoczek');
      res.redirect(`/widoczki/${widoczek._id}`);
    })
  );
  
  router.post(
    "/:id/reviews",
    valitateReview,
    catchAsync(async (req, res) => {
      // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
      const widoczek = await Widoczek.findById(req.params.id);
      const review = new Review(req.body.review);
      widoczek.reviews.push(review);
      await review.save();
      await widoczek.save();
      req.flash('success', 'Dodano nową opinię!');
      res.redirect(`/widoczki/${widoczek._id}`);
    })
  );
  // ------------ SHOW ----------------------------------
  router.get(
    "/:id",
    catchAsync(async (req, res) => {
      const widoczek = await Widoczek.findById(req.params.id).populate("reviews");
      if(!widoczek){
          req.flash('error', "Nie udało się znaleźć widoczku");
          return res.redirect("/widoczki");
      }
      res.render("widoczki/show", { widoczek });
    })
  );
  // ------------ EDIT ----------------------------------
  router.get(
    "/:id/edit",
    catchAsync(async (req, res) => {
      const widoczek = await Widoczek.findById(req.params.id);
      if(!widoczek){
        req.flash('error', "Nie udało się znaleźć widoczku");
        return res.redirect("/widoczki");
    }
      res.render("widoczki/edit", { widoczek });
    })
  );
  // ------------ EDIT PUT -----------------------------
  router.put(
    "/:id",
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
    "/:id",
    catchAsync(async (req, res) => {
      const { id } = req.params;
      
      const widoczek = await Widoczek.findById(req.params.id)
      req.flash("success", `Usunięto Widoczek ${widoczek.name}`);
      await Widoczek.findByIdAndDelete(id);
      res.redirect("/widoczki/");
      
    })
  );
  router.delete(
    "/:id/reviews/:reviewId",
    catchAsync(async (req, res) => {
      const { id, reviewId } = req.params;
      await Widoczek.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", `Usunięto Opinię!`);
      res.redirect(`/widoczki/${id}`);
    })
  );

  module.exports = router;