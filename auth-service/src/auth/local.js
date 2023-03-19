const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/users.model');

const { getRequest } = require('../module/requests');

passport.use('signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        const { email, inviteCode } = req.body;
        const response = (await getRequest('user', `/user/invites/${inviteCode}`)).data.data;

        if (response.email !== email || response.active === false || new Date(response.expire_date) < Date.now()) {
            throw new Error('Invite code is not valid');
        }
            
        const user = new UserModel({
            username: username.toLowerCase(),
            password,
            email,
        });
        await getRequest('user', `/user/invites/${req.body.inviteCode}/disable`);
        await user.save();
        done(null, user)
    } catch(error) {
        done(error);
    }
}));

passport.use('login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        const user = await UserModel.findOne({ username: username.toLowerCase() });
        if (!user) {
            return done(null, false, { message: 'User not found' })
        }
        const validate = await user.checkPassword(password);
        if (!validate) {
            return done(null, false, { message: 'Wrong password' })
        }
        
        return done(null, user, { message: 'Logged in Successfully' })
    } catch(error) {
        return done(error)
    }
}))