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
            turn: -1,
            challengablePlayer: -1,
            challengeableAction: -1,
            blockablePlayer: -1,
            blockableAction: -1,
            challengeOnlyOneCoin: false,
            blockOnlyOneCoin: false,
            players: [
                {
                    name: "Player1Name",
                    color: 0,
                    shape: 0,
                    leftInfluence: 0,
                    rightInfluence: 1,
                    leftInfluenceAlive: true,
                    rightInfluenceAlive: true,
                    coins: 2
                },
                {
                    name: "Player2Name",
                    color: 1,
                    shape: 1,
                    leftInfluence: 2,
                    rightInfluence: 3,
                    leftInfluenceAlive: true,
                    rightInfluenceAlive: true,
                    coins: 2
                },
                {
                    name: "Player3Name",
                    color: 2,
                    shape: 2,
                    leftInfluence: 4,
                    rightInfluence: 5,
                    leftInfluenceAlive: true,
                    rightInfluenceAlive: true,
                    coins: 2
                },
                {
                    name: "Player4Name",
                    color: 3,
                    shape: 3,
                    leftInfluence: 6,
                    rightInfluence: 7,
                    leftInfluenceAlive: true,
                    rightInfluenceAlive: true,
                    coins: 2
                },
                {
                    name: "Player5Name",
                    color: 4,
                    shape: 4,
                    leftInfluence: 8,
                    rightInfluence: 9,
                    leftInfluenceAlive: true,
                    rightInfluenceAlive: true,
                    coins: 2
                },
                {
                    name: "Player6Name",
                    color: 5,
                    shape: 5,
                    leftInfluence: 10,
                    rightInfluence: 11,
                    leftInfluenceAlive: true,
                    rightInfluenceAlive: true,
                    coins: 2
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
        games[index].influenceActionNumber = -1;
        games[index].departingInfluence = '';
    })
})
