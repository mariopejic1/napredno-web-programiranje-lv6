const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    naziv: String,
    opis: String,
    cijena: Number,
    poslovi: String,
    datumPocetka: Date,
    datumZavrsetka: Date,
    clanovi: [String]
});

module.exports = mongoose.model("Project", projectSchema);
