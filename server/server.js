const express = require('express');
require('dotenv').config();
const socket = require('socket.io');
const path = require('path');
const app = express();
app.use(express.json());
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
app.use( express.static( `${__dirname}/../build` ) );

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const { SERVER_PORT } = process.env;

const games = [];

const privateKey = fs.readFileSync('/etc/letsencrypt/live/aaronjbraithwaite.net/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/aaronjbraithwaite.net/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/aaronjbraithwaite.net/chain.pem', 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

const io = socket(
  https.createServer(credentials, app).listen(443, () => {
    app.listen(SERVER_PORT, () => {
      console.log(`On the ${SERVER_PORT}th day of Christmas my true love gave to me..... nothing because I'm single`);
    });
  })
);

app.get('/getGameData/:identifier', (req, res) => {
    const { identifier } = req.params;
    const capitalizedIdentifer = identifier.toUpperCase();
    const index = games.findIndex(game => game.identifier === capitalizedIdentifer);
    let game;
    if (index === -1) {
        game = {
            identifier: capitalizedIdentifer,
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
      const capitalizedIdentifier = identifier.toUpperCase();
        socket.join(capitalizedIdentifier);
        io.to(capitalizedIdentifier);
    })

    socket.on('update-game', data=> {
        const index = games.findIndex(game => game.identifier === data.identifier);
        games[index] = data;
        io.to(data.identifier).emit('update-game', data);
        games[index].influenceActionNumber = -1;
        games[index].departingInfluence = '';
    })

    socket.on('return-to-start', data=> {
      const index = games.findIndex(game => game.identifier === data.identifier);
      games.splice(index, 1);
      io.to(data.identifier).emit('return-to-start');
    })
})
