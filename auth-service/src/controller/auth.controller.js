const passport = require('passport');
const config = require('../module/config');
const jwt = require('jsonwebtoken');

exports.registerController = (req, res, next) => {
    return res.json({
        success: true,
        message: 'User successfully registered.',
        user: req.user,
    });
}

exports.loginController = async (req, res, next) => passport.authenticate('login', async (err, user, info) => {
  try {
    if (err || !user) {
      throw new Error(info.message);
    }

    req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, config.jwtSecret);

      return res.json({ success: true,
        message: 'Logged in successfully',
        data: {
            token
        }, 
      });
    });
  } catch (error) {
      return next(error);
  }
})(req, res, next);