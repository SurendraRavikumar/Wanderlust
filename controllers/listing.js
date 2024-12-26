const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // Used for geocoding.....
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.createListing = async (req, res, next) => {
    
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location, 
        limit: 2                           
      })
    .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;  // setting the owner to the listing
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            },
        })    
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing , originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });   
    
    if( typeof req.file !== "undefined"){  
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
   
    req.flash("success", "Listing Updated Updates!");
    res.redirect(`/listings/${id}`); 
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}

module.exports.search = async (req, res) => {
    const locationQuery = req.query.location;
  
    let filter = {};  
    if (locationQuery) {
      filter.location = new RegExp(locationQuery, 'i');  
    }
    try {
      const allListings = await Listing.find(filter);  
      
      
    if (allListings.length === 0) {
        req.flash("error", "The Listing you are searching at this location does not exist.");
        return res.redirect("/listings");  
      }
      res.render("listings/search.ejs", { allListings, locationQuery });  
    } catch (err) {
      req.flash("error", "Something went wrong, please try again later.");
      res.redirect("/listings");  
    }
  }