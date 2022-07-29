const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf');

let app = express();

app.set("view engine", "hbs");

app.use(express.urlencoded({
    extended: false
}));
app.use(express.static("public"));

wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(flash()); //!register flash after sessions
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});
app.use(csrf());
app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use(function (err, req, res, next) {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash('error_messages', 'The form has expired. Please try again');
        res.redirect('back');
    } else {
        next()
    }
});

const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const { urlencoded } = require("express");

async function main() {
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
}
main();

app.listen(3000, () => {
    console.log("Server started");
});