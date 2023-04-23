const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Khoi tao model cho van cuoc
const roundData = new mongoose.Schema({
    // just display fake money number
    small_fake_money: Number,
    big_fake_monney: Number,
    // to save real money
    small_money: Number,
    big_money: Number,
    small_player: Number,
    big_player: Number,
    // from 1 to 60
    time_counter: Number,
    // -1: Dang choi, 0: xiu, 1: tai
    result: Number,
    // ngay khoi tao
    dateCreated: Date,
});

roundData.plugin(AutoIncrement, {inc_field: "roundNumber"});
module.exports = mongoose.model("round", roundData);


