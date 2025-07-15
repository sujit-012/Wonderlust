const express = require("express");
const router = require("express").Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { authenticate } = require("passport");
const passport = require("passport")
const { saveRedirectUrl} = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username})
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser, (err) =>{
          if(err) {
            return next(err);
          }
          req.flash("success", "Welcome to wanderlust")
          res.redirect("/listings")
        })
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }
})); 

router.get("/login", (req , res) => {
    res.render("users/login.ejs")
})

router.post(
  "/login",
  saveRedirectUrl, // Put it BEFORE authenticate!
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");

    const redirectUrl = res.locals.saveRedirectUrl || "/listings";  // ✅ fallback here
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    req.flash("success", "you are logged out!")
    res.redirect("/listings")
  })
})

module.exports = router