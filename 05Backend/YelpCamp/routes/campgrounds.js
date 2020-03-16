var express = require("express"),
    router = express.Router();

var Campground = require("../models/campground");

// INDEX
router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

// NEW
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// CREATE
router.post("/", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var image = req.body.image;
    var description = req.body.description;
    Campground.create(
        { name: name, author: author, image: image, description: description },
        function(err) {
            if (err) {
                // TODO error message in a form
                console.log(err);
            } else {
                res.redirect("/campgrounds");
            }
        }
    );
});

// SHOW
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec(function(err, campground) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/show", { campground: campground });
            }
        });
});

// EDIT
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", { campground: campground });
        }
    });
});

// UPDATE
router.put("/:id", checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
        err,
        updated
    ) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, removed) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            Comment.deleteMany({ _id: { $in: removed.comments } }, function(
                err
            ) {
                if (err) {
                    console.log(err);
                }
                res.redirect("/campgrounds");
            });
        }
    });
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, campground) {
            if (err) {
                res.redirect("back");
            } else {
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;
