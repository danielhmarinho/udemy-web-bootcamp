const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

//index
router.get('/', function(req, res) {
  Campground.find({}, function(err , campgrounds){
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: campgrounds});
    }
  });
});

//handle campground
router.post('/', middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {name: name, image: image, description: description, author: author};
  Campground.create(newCampground, function(err, newCampground) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

//campground form
router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

//campground show
router.get('/:id', function(req, res) {
  Campground.findById(req.params.id).populate('comments').exec(function(err, campground) {
    if(err) {
      console.log(err);
    } else {
      console.log(campground);
      res.render('campgrounds/show', {campground: campground});
    }
  });
});

//campground edit
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function (err, campground) {
    res.render('campgrounds/edit', {campground: campground});
  });
});

//campground update
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
    if(err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

//destroy campground
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
