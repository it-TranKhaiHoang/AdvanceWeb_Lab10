const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    if (req.user.email.endsWith("student.tdtu.edu.vn"))
        res.redirect('/')
    else
        res.redirect('/login')
})

module.exports = router