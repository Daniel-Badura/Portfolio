//jshint esversion:10
const Widoczek = require("../models/Widoczek");
const Review = require("../models/review");
const User = require("../models/user");

module.exports.isAuthorizedWidoczek = async (req, res, next) => {
  const { id } = req.params;
  const widoczek = await Widoczek.findById(id);
  if (req.user) {
    if (widoczek.author == req.user.username) {
      return next();
    } else {
      req.flash("error", "Nie masz tutaj dostępu");
      return res.redirect(`/widoczki/${id}`);
    }
  } else {
    req.flash("error", "Musisz być zalogowany");
    return res.redirect("/login");
  }
};

module.exports.isAuthorizedReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (req.user) {
    if (review.author == req.user.username) {
      next();
    } else {
      req.flash("error", "Nie masz tutaj dostępu");
      return res.redirect(`/widoczki/${id}`);
    }
  } else {
    req.flash("error", "Musisz się napierw zalogować");
    return res.redirect('/login');
  }
};
module.exports.isAuthorizedEdit = async (req, res, next) => {
  const { id } = req.params;
  const widoczek = await Widoczek.findById(id);
  if (!widoczek.author.equals(req.user.username)) {
    req.flash("error", "Nie masz tutaj dostępu");
    return res.redirect(`/widoczki/${id}`);
  }
  next();
};
