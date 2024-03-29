const express = require('express');
const socket = require('socket.io');
require('dotenv').config();
const cors = require('cors');

const app = express();

const games = [];

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const { SERVER_PORT } = process.env;

app.get('/liveness', (req, res) => {
  return res.status(200).send('alive and kicking');
});

const io = socket(
  app.listen(SERVER_PORT, () => {
    console.log(`On the ${SERVER_PORT}th day of Christmas my true love gave to me..... nothing because I'm single`);
  })
);

app.get('/getGameData/:identifier', (req, res) => {
  console.log('entered this method')
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
  socket.on("join-influence-identifier",identifier=>{
    const capitalizedIdentifier = identifier.toUpperCase();
    socket.join(capitalizedIdentifier);
    io.to(capitalizedIdentifier);
  })

  socket.on('update-influence-game', data=> {
    const index = games.findIndex(game => game.identifier === data.identifier);
    games[index] = data;
    io.to(data.identifier).emit('update-influence-game', data);
    games[index].influenceActionNumber = -1;
    games[index].departingInfluence = '';
  })

  socket.on('return-to-influence-start', data=> {
    const index = games.findIndex(game => game.identifier === data.identifier);
    games.splice(index, 1);
    io.to(data.identifier).emit('return-to-influence-start');
  })
})
