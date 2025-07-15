const express = require("express");
const router = require("express").Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js")


const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  if(error) {
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(404,error)
  }else{
    next();
  }
};

//index route
router.get("/", wrapAsync(async (req , res)  => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
}) )

//New Route 
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs")
})

//show route
router.get("/:id",  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });
}))

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async(req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "new listing Created")
  res.redirect("/listings");
}));

//update route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async(req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(currUser._id)) {
    req.flash("error", "You don't have permission to edit")
    res.redirect(`/listings/${id}`)
  }
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "listing Updated")
  res.redirect(`/listings/${id}`)
}));

//Delete route 
router.delete("/:id", isLoggedIn, wrapAsync(async(req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted")
  res.redirect("/listings")
}));

//Edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) =>{
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings")
    }
  res.render("listings/edit.ejs", {listing});
}));


module.exports = router;