const express = require("express");
const router = require("express").Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { authenticate } = require("passport");
const passport = require("passport")
const { saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/user.js")

router
.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signup));

router
.route("/login")
.get(userController.renderLogin)
.post(
  saveRedirectUrl, // Put it BEFORE authenticate!
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  userController.login
);

// router.get("/signup", userController.renderSignup)

// router.post("/signup", wrapAsync(userController.signup)); 

// router.get("/login", userController.renderLogin)

// router.post(
//   "/login",
//   saveRedirectUrl, // Put it BEFORE authenticate!
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true
//   }),
//   userController.login
// );

router.get("/logout", userController.logout)

module.exports = router