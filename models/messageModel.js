const mongoose = require('mongoose')
const Scheme = mongoose.Schema;


const Message = new Scheme({
    authorID: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now(),
        required: true
    }
})

const ListMSG = new Scheme({
    clientID1: {
        type: String,
        required: true,
    },
    clientID2: {
        type: String,
        required: true,
    },
    message: Message
})

module.exports = mongoose.model('ListMSG', ListMSG)