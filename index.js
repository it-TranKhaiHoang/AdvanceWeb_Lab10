const express = require('express')
const handlebars = require('express-handlebars')
require('dotenv').config()
const app = express()
const port = process.env.PORT
const passport = require('passport')
const cookieSession = require('cookie-session')
require('./routers/auth')
const socketio = require('socket.io')

// DB
const db = require('./configs/db')
db.connect()

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


const isLoggedIn = (req, res, next) => {
    if (req.user)
        next()
    else
        res.redirect('/login')
}


app.use('/google', googleRouter)

app.get('/', isLoggedIn, (req, res) => {
    res.render('index', { user: req.user.displayName })
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/chat', (req, res) => {
    res.render('chat')
})

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/')

})

const httpServer = app.listen(port, () => console.log('Server started'))
const io = socketio(httpServer)

// Socket.io server

io.on('connection', client => {

    console.log(`Client ${client.id} đã kết nối`)

    client.free = true
    client.loginAt = new Date().toLocaleTimeString()

    let users = Array.from(io.sockets.sockets.values())
        .map(socket => ({ id: socket.id, username: socket.username, free: socket.free, loginAt: socket.loginAt }))


    client.on('disconnect', () => {
        console.log(`${client.id} đã thoát`)
        client.broadcast.emit('user-leave', client.id)
    })

    // Gữi danh sách online cho người mới
    client.emit('list-users', users)
    // Gữi thông tin người mới cho những người trước đó
    client.broadcast.emit('new-user', { id: client.id, username: client.username, free: client.free, loginAt: client.loginAt })

    // Đăng ký tên người dùng
    client.on('register-name', username => {
        client.username = username

        // Gữi thông tin đăng ký cho tất cả client còn lại
        client.broadcast.emit('register-name', { id: client.id, username: username, free: client.free, loginAt: client.loginAt })
    })
})