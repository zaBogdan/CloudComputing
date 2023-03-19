const express = require('express');
const passport = require('passport');

const {
  registerController,
  loginController,
} = require('../controller/auth.controller');
const router = express.Router();

router.post(
  '/register',
  passport.authenticate('signup', { session: false }), 
  registerController
);

router.post(
  '/login',
  loginController
);


module.exports = router;
