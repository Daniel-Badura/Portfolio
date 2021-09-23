//jshint esversion: 11
const User = require('../models/user');


module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({
      username: username,
      email: email,
    });
    const newUser = await User.register(user, password);
    await user.save();
    req.flash("success", `Pomyślnie zarejestrowano użytkownika ${username}`);
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

module.exports.login = (req, res) => {
  req.flash("success", `Witaj ${req.body.username}`);
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
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Wylogowano pomyślnie");
  res.redirect("/");
};
