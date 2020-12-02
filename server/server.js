const express = require('express');
require('dotenv').config();
const socket = require('socket.io');
const path = require('path');
const app = express();
app.use(express.json());
// app.use( express.static( `${__dirname}/../build` ) );

const { SERVER_PORT } = process.env;

const games = [];

const io = socket(
    app.listen(SERVER_PORT, () => {
        console.log(`On the ${SERVER_PORT}th day of Christmas my true love gave to me..... nothing because I'm single`);
    })
);

app.get('/getGameData/:identifier', (req, res) => {
    const { identifier } = req.params;
    const index = games.findIndex(game => game.identifier === identifier);
    let game;
    if (index === -1) {
        game = {
            identifier,
            started: false,
            players: [
                {
                    name: "Player1Name",
                    color: 0,
                    shape: 0
                },
                {
                    name: "Player2Name",
                    color: 1,
                    shape: 1
                },
                {
                    name: "Player3Name",
                    color: 2,
                    shape: 2
                },
                {
                    name: "Player4Name",
                    color: 3,
                    shape: 3
                },
                {
                    name: "Player5Name",
                    color: 4,
                    shape: 4
                },
                {
                    name: "Player6Name",
                    color: 5,
                    shape: 5
                }
            ]
        };
        games.push(game);
    } else {
        game = games[index];
    }
    res.status(200).send(game);
})

io.on("connection", socket => {
    socket.on("join-identifier",identifier=>{
        socket.join(identifier);
        io.to(identifier);
    })

    socket.on('update-game', data=> {
        const index = games.findIndex(game => game.identifier === data.identifier);
        games[index] = data;
        io.to(data.identifier).emit('update-game', data);
    })
})