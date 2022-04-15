import {SquarekleGame} from '../squarekles-game/interfaces/squarekle-game';

export function getGenericGameOfVersion(gameVersion: number, identifier: string): SquarekleGame {
  const game = getGenericGameUnfiltered(identifier);
  game.gameVersion = gameVersion;
  if (game.gameVersion === 1) {
    game.hashtagMode = true;
  }
  game.cards = game.cards.filter(x => x.gameVersion === game.gameVersion);
  game.bonusTiles = game.bonusTiles.filter(x => x.gameVersion === game.gameVersion);
  return game;
}

function getGenericGameUnfiltered(identifier: string): SquarekleGame {
  const game = JSON.parse(JSON.stringify(require('../../../resources/squareklesGenericGame.json')));
  game.identifier = identifier ? identifier : game.identifier;
  return game;
}
