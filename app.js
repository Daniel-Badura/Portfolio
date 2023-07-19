/*jshint esversion: 9 */

// ------------ DEPENDECIES ---------------------------
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const widoczkiRoutes = require("./routes/widoczki");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const usersRoutes = require("./routes/users");
const keynotesRoutes = require("./routes/keynotes");
const templateRoutes = require("./routes/template");
const calculatorRoutes = require("./routes/calculator");
const moviesRoutes = require("./routes/movies");
const Record = require("./models/recordings");
const Score = require("./models/scores");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const { projects } = require("./seeds/projects");
// ------------ CONNECT MONGOOSE ----------------------

// -------------- PARSER ------------------------

// --------------------------------------

// ------------ EXPRESS SETUP -------------------------
// Connect DB
dotenv.config();
console.log(process.env.MONGO_URI);
connectDB();
const app = express();
app.use("/public", express.static("public"));
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
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// -----------------ROUTES --------------------------
app.use("/", widoczkiRoutes);
app.use("/", usersRoutes);
app.use("/", templateRoutes);
app.use("/keynotes", keynotesRoutes);
app.use("/calculator", calculatorRoutes);
app.use("/movies", moviesRoutes);

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
  res.render("portfolio", { projects });
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

// // ----------------NEXT-------------------------------
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Kurka wodna..." } = err;
  res.status(statusCode).render("error", { err });
});
// ------------ APP START -----------------------------
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Started on PORT ${PORT}`);
});
