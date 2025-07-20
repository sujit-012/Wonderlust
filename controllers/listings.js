const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
}

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs")
}

module.exports.ShowListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings")
  }
  console.log(listing)
  res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "new listing Created")
  res.redirect("/listings");
}

module.exports.updateListings = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // Update basic fields
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.location = req.body.listing.location;
  listing.country = req.body.listing.country;

  // Update image if a new one is uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await listing.save();
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted")
  res.redirect("/listings")
}

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings")
  }

  let originalImageurl = listing.image.url
  originalImageurl = originalImageurl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing,  originalImageurl });
}