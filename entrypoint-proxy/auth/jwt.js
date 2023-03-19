const jwt = require('jsonwebtoken');
const config = require('../module/config');

const extractFromHeader = (req) => {
  const token = req.headers.authorization;

  if (!token) {
      return null;
  }

  const [type, tokenValue] = token.split(' ');

  if (type !== 'Bearer') {
      return null;
  }
  return tokenValue;
};

const extractFromCookie = (req) => {
  // const token = req.cookies.token;
  console.log('Req', req.cookies);
  
}

const verify = (req) => {
  let token = extractFromHeader(req);
  if (!token) {
      token = extractFromCookie(req);
  }


  if (!token) {
      return false;
  }
  
  try {
      return jwt.verify(token, config.jwtSecret);
  } catch (error) {
      return false;
  }
}

module.exports = verify;

// const passport = require('passport');
// const JWTstrategy = require('passport-jwt').Strategy;
// const ExtractJWT = require('passport-jwt').ExtractJwt;

// passport.use(
//   new JWTstrategy(
//     {
//       secretOrKey: config.jwtSecret,
//       jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
//     },
//     async (token, done) => {
//       try {
//         console.log('token', token);
//         return done(null, token.user);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );