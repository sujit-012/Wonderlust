module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;  // Save where they tried to go
    req.flash("error", "You must be logged in to continue.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.saveRedirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
}