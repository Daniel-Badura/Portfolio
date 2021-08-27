// jshint esversion: 10
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  ifUserExists,
  ifEmailExists,
  validatePassword,
} = require("../middleware/registerValidation");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const users = require("../controllers/users");
router.use(cookieParser());

// ------------------------LOGIN--------------------------------

router.get("/login", (req, res) => {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    session: true,
  }),
  users.login
);
// -------------------REGISTER----------------------------

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  ifUserExists,
  ifEmailExists,
  validatePassword,
  catchAsync(users.register)
);
// ------------------------LOGOUT ----------------------------
router.get("/logout", users.logout);
module.exports = router;
