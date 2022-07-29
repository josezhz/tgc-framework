const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { createUserForm, createLoginForm, bootstrapField } = require('../forms');
const { User } = require('../models');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.get('/signup', async function (req, res) {
    const userForm = createUserForm();
    res.render('users/signup', {
        form: userForm.toHTML(bootstrapField)
    })
})

router.post('/signup', async function (req, res) {
    const userForm = createUserForm();
    userForm.handle(req, {
        success: async function (form) {
            const user = new User({
                username: form.data.username,
                password: getHashedPassword(form.data.password),
                email: form.data.email
            });
            await user.save();
            req.flash('success_messages', 'Signed up successfully');
            res.redirect('/users/login');
        }
    })
})

router.get('/login', async function (req, res) {
    const loginForm = createLoginForm();
    res.render('users/login', {
        form: loginForm.toHTML(bootstrapField)
    });
})

router.post('/login', async function (req, res) {
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        'success': async function (form) {
            const user = await User.where({
                email: form.data.email,
                password: getHashedPassword(form.data.password)
            }).fetch({
                require: false
            })

            if (!user) {
                req.flash('error_messages', 'Invalid credentials');
                res.redirect("/users/login");
            } else {
                req.session.user = {
                    id: user.get('id'),
                    email: user.get('email'),
                    username: user.get('username')
                }
                req.flash('success_messages', 'Welcome back, ' + user.get('username'));
                res.redirect('/products');
            }
        }
    })
})

router.get('/profile', function (req, res) {
    const user = req.session.user;
    if (!user) {
        req.flash('error_messages', 'You do not have permission to view this page');
        res.redirect('/users/login');
    } else {
        res.render('users/profile', {
            'user': user
        })
    }
})

router.get('/logout', (req, res) => {
    req.session.user = null;
    req.flash('success_messages', "Goodbye");
    res.redirect('/users/login');
})

module.exports = router;