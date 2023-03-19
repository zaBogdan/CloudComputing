const passport = require('passport');
const config = require('../module/config');
const jwt = require('jsonwebtoken');
const CustomStatusCodeError = require('../errors/CustomStatusCodeError');

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
      throw new CustomStatusCodeError(info.message, 401);
    }

    req.login(user, { session: false }, async (error) => {
        if (error) return CustomStatusCodeError(error, 401);
        const body = { 
          _id: user._id,
          email: user.email,
          username: user.username,
        };
        const token = jwt.sign({ user: body }, config.jwtSecret, {
          expiresIn: '1h',
        });
      
      return res.json({ success: true,
        message: 'Logged in successfully',
        data: {
            token,
            user: body,
        }, 
      });
    });
  } catch (error) {
      return next(error);
  }
})(req, res, next);