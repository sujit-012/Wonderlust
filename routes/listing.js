const express = require("express");
const router = require("express").Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConflict.js")
const upload = multer({ storage })

router
  .route("/listings")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

//New Route 
router.get("/new", isLoggedIn, listingController.renderNewForm)

router
  .route("/:id")
  .get(wrapAsync(listingController.ShowListings))
  .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListings))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


// //index route
// router.get("/", wrapAsync(listingController.index) )

// //show route
// router.get("/:id",  wrapAsync(listingController.ShowListings))

// //create route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// //update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListings));

//Delete route 
// router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));


module.exports = router;
