const express = require('express')
const handlebars = require('express-handlebars')
require('dotenv').config()
const app = express()
const port = process.env.PORT

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))
app.set('view engine', 'hbs');


app.get('/', (req,res)=> {
    res.render('index')
})

app.listen(port, ()=> console.log('Server started'))