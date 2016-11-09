const express = require('express');
const app = express();
const errorHandler = require('./error-handler');

const auth = require('./routes/auth');
const BigFleas = require('./routes/big-flea-routes');
const LittleFleas = require('./routes/little-flea-routes');

// create middleware for ensureAuth
const ensureAuth = require('./auth/ensure-auth')();

// ensureRole middleware factory function takes one or more roles
// required to pass middleware
// const ensureRole = require('./auth/ensure-role');

// pre-make middleware for shared role
// const ensureAdmin = ensureRole('admin', 'super-user');

// routes from browser / Postman access point ...
app.use('/auth', auth); // route to authorizations

// app.use('/BigFleas', ensureAuth, ensureRole('admin', 'super-user'), BigFleas); // route to big fleas collection

app.use('/BigFleas', ensureAuth, BigFleas); // route to big fleas collection

app.use('/LittleFleas', ensureAuth, LittleFleas); // route to little fleas collection

// error handler ...
app.use(errorHandler);

module.exports = app;
