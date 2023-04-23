const { Console } = require("console");
const express = require("express");
var app = express();
app.use(express.static('./www'));

var server = require("http").Server(app);
var io = require("socket.io")(server);
const mongoose = require('mongoose');
const Round = require("./models/Round");
server.listen(3000);

// Variables
var currentRoundNumber = null;
let dices = {
    dice1: Number,
    dice2: Number,
    dice3: Number,
    total: String
}

// Tao van choi moi
function createNewRound() {
    var newRound = new Round({
        small_fake_money: 1,
        big_fake_monney: 1,
        small_money: 0,
        big_money: 10,
        time_counter: 10,
        small_player: 0,
        big_player: 0,
        result: -1,
        dateCreated: Date.now(),
    });
    newRound.save(function(e) {
        if(!e) {
            console.log("Tao van so " + newRound.roundNumber + " thanh cong!");
            currentRoundNumber = newRound.roundNumber;
            roundCounter(currentRoundNumber);
        } else {
            currentRoundNumber = null;
        }
    });
}

// Dem thoi gian choi
function roundCounter(roundNo) {
    Round.findOne({roundNumber:roundNo}, function(e, round) {
        if(!e && round != null) {
            if(round.time_counter > 0) {
                round.time_counter--;
                round.small_fake_money += Math.floor(Math.random() * 1000);
                round.big_fake_monney += Math.floor(Math.random() * 1000);
                console.log("Van so: " + roundNo + ", thoi gian con lai: ", round.time_counter);
                io.sockets.emit("gameData", JSON.stringify(round));
                round.save((eSave) => {
                    setTimeout(() => { roundCounter(roundNo) }, 1000);
                });
            } else {
                // Ket qua random
                console.log("Het thoi gian cuoc!");
                round.save((eSave) => {
                    dices.dice1 = Math.floor(1 + Math.random()*(6));
                    dices.dice2 = Math.floor(1 + Math.random()*(6));
                    dices.dice3 = Math.floor(1 + Math.random()*(6));
                    console.log("Dice 1: " + dices.dice1 + " Dice 2: " + dices.dice2 + " Dice 3: " + dices.dice3);
                    round.result = dices.dice3 + dices.dice2 + dices.dice3;
                    io.sockets.emit('gameOver', dices);
                    io.sockets.emit('gameData', round.result);

                    if(round.result > 10) {
                        console.log("Ket qua: " + round.result + " - Tai");
                    } else {
                        console.log("Ket qua: " + round.result + " - Xiu");
                    }  

                    setTimeout(() => { createNewRound() }, 5000);
                });
            }
        } else {}
    })
}

createNewRound();

// mongoose connection
mongoose.connect('mongodb+srv://<taikhoan>:<matkhau>@atlascluster.47alvvh.mongodb.net/188win?retryWrites=true&w=majority', function(e) {
    if(e) {
        console.log("Loi: ", e.message);
    } else {
        console.log("Ket noi thanh cong!")
    }
});

// SocketIO
io.on("connection", function(socket){
    console.log("New connection: ", socket.id);

    socket.on("disconnect", function() {
        console.log(socket.id, " has been disconnected.");
    })
});