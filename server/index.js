const fs = require('fs');

const nconf = require('nconf');
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const passport = require('passport');

require('./initialize');

const { User } = require('./models/User.model');
const { authenticatedRoute, jwtAuthentication } = require('./middleware');


const app = express();

app.set('port', nconf.get('PORT') || 3005);

app.use(passport.initialize());

require('./config/passport')(passport);

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: false }));


// This middleware looks for an `Authentication` header, and turns it into
// a User object (stored on req.user).
app.use(jwtAuthentication);


app.get(
  '/auth/google',
  passport.authenticate('google', { scope : ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    // On localhost, this API runs on port 3005.
    // The actual dev webserver is on 3000, though.
    // Because of that, I can't simply set a cookie to pass the login token
    // to the client :/
    const {token} = req.user;

    if (process.env.NODE_ENV === 'development') {

      return res.redirect(
        `${nconf.get('WEB_URL')}/auth/google/callback?token=${token}`
      );
    }

    res.cookie(nconf.get('AUTH_TOKEN_KEY'), token);

    return res.redirect('/');
  }
);

app.get('/users/me', authenticatedRoute, (req, res, next) => {
  // The user object we return should be a simplified version of the DB record.
  // TODO: Move this somewhere?
  const simplifiedUser = {
    name: req.user.name,
    email: req.user.email,
    trackedShows: req.user.trackedShows,
    id: req.user._id,
  };

  return res.json(simplifiedUser);
});

app.post('/shows/create', authenticatedRoute, (req, res, next) => {
  req.user.addShows(req.body.shows, (err, result) => {
    console.log(err, result);
    return res.json({ ok: true });
  })
})

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
}

app.listen(nconf.get('PORT'), () => {
  console.info(`==> 🌎  Listening on port ${nconf.get('PORT')}.`);
});
