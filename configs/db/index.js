const mongoose = require('mongoose');
require('dotenv').config()
async function connect() {
    try {
        await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Success');
    } catch (error) {
        console.log('Fail')
    }
}

module.exports = { connect };