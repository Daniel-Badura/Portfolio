/*jshint esversion: 9 */

// ------------ DEPENDECIES ---------------------------
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// const Widoczek = require("./models/Widoczek");
// const Review = require("./models/review");
// const { opis, miejsce } = require('./seeds/seedWidoczki');
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
// const Joi = require("joi");
// const { widoczkiSchema, reviewSchema } = require("./schemas.js");
const widoczkiRoutes = require("./routes/widoczki");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
// const bcrypt = require("bcrypt");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const usersRoutes = require('./routes/users');

//  -------- Joi Schema Validation ----------
// const valitateWidoczki = (req, res, next) => {
//   const { error } = widoczkiSchema.validate(req.body);
//   if (error) {
//     const message = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(message, 400);
//   } else {
//     next();
//   }
// };
// const valitateReview = (req, res, next) => {
//   const { error } = reviewSchema.validate(req.body);
//   if (error) {
//     const message = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(message, 400);
//   } else {
//     next();
//   }
// };

// ------------ CONNECT MONGOOSE ----------------------

// --------------COOKIE PARSER ------------------------
// app.use(cookieParser());
// --------------------------------------
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
// --------------------EJS----------------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ------------ MORGAN --------------------------------
app.use(morgan("common"));
// ------------ METHOD OVERRIDE -----------------------
app.use(methodOverride("_method"));


//////////////////////////
const sessionConfig = {
  secret: "this is going to be a secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 10,
    maxAge: 1000 * 60 * 15,
  },
};
// use app.session before passport.session //
app.use(session(sessionConfig));
// --------------------COOKIES AND FLASH -----------------
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// -----------------ROUTES --------------------------
app.use("/widoczki", widoczkiRoutes);
app.use("/", usersRoutes);

//------------------PASSPORT--------------------------

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// store user in the session:
passport.serializeUser(User.serializeUser());
// unstore user in the session:
passport.deserializeUser(User.deserializeUser());
User.createStrategy();

// -----------------RENDER HOMEPAGE-------------------
app.get("/", (req, res) => {
  res.render("portfolio");
});
// ------------ NEW -----------------------------------
app.get("/viewcount", function (req, res) {
  if (req.session.count) {
    req.session.count += 1;
  } else {
    req.session.count = 1;
  }
  res.send(`Wyświetliłeś tą stronę ${req.session.count} razy`);
});

app.get("/headers", function (req, res) {
  res.send(req.headers);
});

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
app.get(
  "/template",
  catchAsync(async (req, res) => {
    res.render("template/index", {});
  })
);


// ------------------------LOGIN--------------------------------

// ------------------AUTH MIDDLEWARE --------------------------------
const requireAuth = (req, res, next) => {
  if (!req.session.user_id) {
    req.flash("error", "Wymangane logowanie");
    return res.redirect("/login");
  }
  next();
};
// -------------------AUTHENTICATED ROUTE----------------------------

app.get("/tajne", requireAuth, (req, res) => {
  res.send("Widzisz mnie bo jesteś zalogowany");
});

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
