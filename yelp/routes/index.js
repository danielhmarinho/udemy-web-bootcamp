const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//root route
router.get('/', function(req, res) {
  res.render('landing');
});

//register show
router.get('/register', function(req, res) {
  res.render('register');
});

//handle signup
router.post('/register', function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if(err) {
      req.flash('error', err.message);
      console.log(err);
      return res.redirect('register')
    }
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Welcome ' + user.username);
      res.redirect('/campgrounds');
    })
  });
});

//login show
router.get('/login', function(req, res) {
  res.render('login');
});

//handle login
router.post('/login', passport.authenticate('local',
 {
   successRedirect: '/campgrounds',
   failureRedirect: '/login'
 }), function(req, res) {
});

//handle logout
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Logged out!');
  res.redirect('/campgrounds');
});

module.exports = router;
