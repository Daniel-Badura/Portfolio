//jshint esversion:10
const User = require("../models/user");

module.exports.ifUserExists = async (req, res, next) => {
  const username = req.body.username;
  const doesUserExist = await User.exists({ username: username });
  if (doesUserExist) {
    req.flash("error", "Konto o podanej nazwie użytkownika już istnieje");
    return res.redirect("/register");
  } else {
    next();
  }
};

module.exports.ifEmailExists = async (req, res, next) => {
  const email = req.body.email;
  const doesUserExist = await User.exists({ email: email });
  if (doesUserExist) {
    req.flash("error", "Konto o podanym adresie email już istnieje");
    return res.redirect("/register");
  } else {
    next();
  }
};

module.exports.validatePassword = (req, res, next) => {
  const password = req.body.password,
    confirm_password = req.body.confirm_password;

  if (password == confirm_password) {
    console.log(password);
    console.log(confirm_password);
    return next();
  } else {
    req.flash("error", "Podane hasła nie są identyczne");
    return res.redirect("/register");
  }
};
