const express = require('express');
require('dotenv').config();
const socket = require('socket.io');
const app = express();
app.use(express.json());

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
            numberOfPlayers: 6,
            started: false
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
        console.log('games: ', games);
        io.to(data.identifier).emit('update-game', data);
    })
})