/*jshint esversion: 9 */

// ------------ DEPENDECIES ---------------------------
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Widoczek = require("./models/Widoczek");
const Review = require("./models/review");
// const { opis, miejsce } = require('./seeds/seedWidoczki');
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");
const { widoczkiSchema, reviewSchema } = require("./schemas.js");

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
// ------------ CONNECT MONGOOSE ----------------------
mongoose.connect("mongodb://localhost:27017/portfolio", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
// ------------ EXPRESS SETUP -------------------------
const app = express();
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extend: true }));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// ----------------------------------------------------
app.get("/", (req, res) => {
  res.render("portfolio");
});
// ------------ MORGAN --------------------------------
app.use(morgan("common"));
// ------------ METHOD OVERRIDE -----------------------
app.use(methodOverride("_method"));
// ------------ INDEX WIDOCZKI------------------------------------------------------------------------------------------------
app.get(
  "/widoczki",
  catchAsync(async (req, res) => {
    const widoczki = await Widoczek.find({});
    res.render("widoczki/index", { widoczki });
  })
);
// ------------ HOME ---------------------------------
app.get(
  "/widoczki/home",
  catchAsync(async (req, res) => {
    res.render("widoczki/home");
  })
);
// ---------------------------------------- CRUD SECTION -------------------------------------------------
// ------------ NEW -----------------------------------
app.get(
  "/widoczki/new",
  catchAsync(async (req, res) => {
    const widoczki = await Widoczek.find({});
    res.render("widoczki/new", { widoczki });
  })
);
// ------------ POST NEW-------------------------------
app.post(
  "/widoczki",
  valitateWidoczki,
  catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const widoczek = new Widoczek(req.body.widoczek);
    await widoczek.save();
    res.redirect(`/widoczki/${widoczek._id}`);
  })
);

app.post(
  "/widoczki/:id/reviews",
  valitateReview,
  catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const widoczek = await Widoczek.findById(req.params.id);
    const review = new Review(req.body.review);
    widoczek.reviews.push(review);
    await review.save();
    await widoczek.save();
    res.redirect(`/widoczki/${widoczek._id}`);
  })
);
// ------------ SHOW ----------------------------------
app.get(
  "/widoczki/:id",
  catchAsync(async (req, res) => {
    const widoczek = await Widoczek.findById(req.params.id).populate("reviews");
    res.render("widoczki/show", { widoczek });
  })
);
// ------------ EDIT ----------------------------------
app.get(
  "/widoczki/:id/edit",
  catchAsync(async (req, res) => {
    const widoczek = await Widoczek.findById(req.params.id);
    res.render("widoczki/edit", { widoczek });
  })
);
// ------------ EDIT PUT -----------------------------
app.put(
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
app.delete(
  "/widoczki/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const widoczek = await Widoczek.findByIdAndDelete(id);
    res.redirect("/widoczki/");
  })
);
app.delete(
  "/widoczki/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Widoczek.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/widoczki/${id}`);
  })
);
// ------------------CALCULATOR-------------------------------------

app.get(
  "/calculator",
  catchAsync(async (req, res) => {
    res.render("calculator/index", {});
  })
);

// ------------------KEYNOTES-------------------------------------
app.get(
  "/keynotes",
  catchAsync(async (req, res) => {
    res.render("keynotes/index", {});
  })
);

// ------------------TEMPLATE-------------------------------------
// ------------------EXPRESS ERROR-------------------------------------
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
// ----------------NEXT-------------------------------
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Kurka wodna..." } = err;
  res.status(statusCode).render("error", { err });
});
// ------------ APP START -----------------------------
app.listen(3000, () => {
  console.log("Started on port 3000");
});
