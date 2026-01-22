const mongoose = require('mongoose');

module.exports = mongoose.model('Project', new mongoose.Schema({

    naziv: String,
    opis: String,
    cijena: Number,
    obavljeni_poslovi: {
        type: [String],
        default: []
    },

    datumPocetka: Date,
    datumZavrsetka: Date,

    voditelj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    clanovi: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    arhiviran: {
        type: Boolean,
        default: false
    }

}));
