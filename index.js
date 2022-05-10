const express = require('express')
const handlebars = require('express-handlebars')
require('dotenv').config()
const app = express()
const port = process.env.PORT
const passport = require('passport')
const cookieSession = require('cookie-session')
require('./routers/auth')

// Router
const googleRouter = require('./routers/googleRouter')

app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
}))
app.use(passport.initialize())
app.use(passport.session())

// View engine
app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))
app.set('view engine', 'hbs');

app.use('/google', googleRouter)

app.get('/', (req, res) => {
    res.render('index', { email: req.user.email })
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.listen(port, () => console.log('Server started'))