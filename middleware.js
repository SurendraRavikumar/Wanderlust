const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");

// Here this middleware will check weather the User is Logged In or Not. Before we create the new Listing, Edit,Delete.
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){   
        req.session.redirectUrl = req.originalUrl;       
        req.flash("error","You must be logged in to create listing!");
        res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// Only the Owner has access to delete the Listing.....
module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// Schema Validation for server side..........
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body); 
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};


// Review Validation for server side..........
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);  
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};

// Only the Owner has access to delete the Review.....
module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}