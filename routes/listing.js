const express = require("express");
const router = express.Router(); // Here I am creating Router Object....
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

// Index Route..........................
router.get("/", wrapAsync(listingController.index));

//Search Router.............................
router.get("/search", isLoggedIn, wrapAsync(listingController.search));

// New Route.............................
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create Route...........................
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

// Show Route..............................
router.get("/:id", wrapAsync(listingController.showListing));

// Edit Route.............................
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update Route.............................
router.put("/:id", isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));

// Delete Route..........................
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Here using router.route
// router.route("/")
// .get(wrapAsync(listingController.index))  // Index router
// .post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing)); // Create router
 
module.exports = router;