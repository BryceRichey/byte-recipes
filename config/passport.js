const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');

const db = require('./database');

const customFields = {
    username: 'u_name',
    password: 'p_word'
}


const verifyCallback = (username, password, done) => {
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, data, fields) => {
        if (err) {
            return done(err);
        }
        if (data.length == 0) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        const isValid = validPassword(
            password, data[0].hash, data[0].salt);
        user = {
            id: data[0].id, username: data[0].username, hash: data[0].hash, salt: data[0].salt
        };
        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    console.log('inside serialize');
    done(null, user.id)
});

passport.deserializeUser((userID, done) => {
    console.log('deserializeUser' + userID);
    db.query('SELECT * FROM user WHERE id = ?', [userID], (err, data) => { done(null, data[0]) }
    )
})

validPassword = (password, hash, salt) => {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return hash === hashVerify;
}

genPassword = (password) => {
    const salt = crypto.randomBytes(32).toString('hex');
    const genhash = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return { salt: salt, hash: genhash };
}

isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/');
    }
}

isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin == 1) {
        next();
    } else {
        res.redirect('/');
    }
}

userExits = (req, res, next) => {
    db.query('SELECT * FROM users WHERE username = ?', [req.body.u_name], (err, data, fields) => {
        if (err) {
            console.log(err);
        } else if (data.length > 0) {
            res.redirect('/')
        } else {
            next();
        }
    });
}

module.exports = { passport };