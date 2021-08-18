// jshint esversion: 10
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const cookieParser = require("cookie-parser");
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
    session: true
  }),
  (req, res) => {
    req.flash("success", `Siema ${req.body.username}`);
    let { returnAfterLogin } = req.cookies;
    if (returnAfterLogin) {
      res.clearCookie("returnAfterLogin");
      res.redirect(returnAfterLogin);
    } else {
      res.redirect("/");
    }
    //   const { username, password } = req.body;
    //   const user = await User.findOne({ username });
    //   const validate = await bcrypt.compare(password, user.password);
    //   if (validate) {
    //     req.session.user_id = user._id;
    //     req.flash("success", "Zalogowano pomyślnie");
    //     res.redirect("/");
    //   } else {
    //     req.flash("error", "Nieprawidłowa nazwa użytkownika lub hasło");
    //     res.redirect("/login");
    //   }
    // });
  }
);
// -------------------REGISTER----------------------------

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({
        username: username,
        email: email,
      });
      const newUser = await User.register(user, password);
      await user.save();
      req.flash("success", `Pomyślnie zarejestrowano użytkownika ${username}`);
      res.redirect("/login");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
  })
);
// ------------------------LOGOUT ----------------------------
router.get("/logout", (req,res)=>{
    req.logout();
    req.flash('success', 'Wylogowano pomyślnie');
    res.redirect('/');
});
module.exports = router;
