import { Component, OnChanges, OnInit, ViewChild, QueryList } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AvatarComponent } from '../avatar/avatar.component';
import { GameStateProviderService } from '../game-state-provider.service';
import { WebSocketService } from '../web-socket.service';
const colorCodes = require('../../../resources/colorCodes.json');
const shapePaths = require('../../../resources/shapePaths.json');


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: [
    './game.component.scss',
    './player-positions.scss'
  ]
})
export class GameComponent implements OnInit, OnChanges {
  text: string;
  identifier: string;
  game;
  colorCode = 'white';
  shapePath;
  selection = 'none';

  @ViewChild('avatar1') avatar1: AvatarComponent;
  @ViewChild('avatar2') avatar2: AvatarComponent;
  @ViewChild('avatar3') avatar3: AvatarComponent;
  @ViewChild('avatar4') avatar4: AvatarComponent;
  @ViewChild('avatar5') avatar5: AvatarComponent;
  @ViewChild('avatar6') avatar6: AvatarComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private webSocketService: WebSocketService,
              private gameStateProviderService: GameStateProviderService) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.identifier = params.get('identifier');
      if (!this.isUpperCase(this.identifier)) {
        const capitalizedIdentifier = this.identifier.toUpperCase();
        this.redirectToAllCaps(capitalizedIdentifier);
      }
    });
    this.webSocketService.emit('join-influence-identifier', this.identifier);
    this.gameStateProviderService.getState(this.identifier).subscribe((game) => {
      this.game = game;
      if (this.game && this.game.players && this.game.turn && this.game.turn > -1 && this.game.turn < this.game.players.length && this.game.players[this.game.turn].coins > 9) {
        this.selection = 'coup';
      }
      if (this.game && this.game.started && this.game.turn && this.game.turn !== -1) {
        this.colorCode = colorCodes[this.game.players[this.game.turn].color];
        this.shapePath = shapePaths[this.game.players[this.game.turn].shape];
      }
    });
    this.listen();
  }

  redirectToAllCaps(identifier) {
    this.router.navigate([identifier]);
  }

  navigateBackToStartScreen(){
    this.router.navigate(['']);
  }

  deleteGame() {
    this.webSocketService.emit('return-to-influence-start', {identifier: this.identifier});
    this.navigateBackToStartScreen();
  }

  isUpperCase(str) {
    return str === str.toUpperCase();
  }

  ngOnChanges() {

  }

  listen() {
    this.webSocketService.listen('update-influence-game').subscribe(response => {
      let started = this.game.started;
      this.game = response;
      if (this.game.started && !started) {
        this.takeAvoidDisplayingAction();
      }
      if (this.game.started && this.game.turn && this.game.turn !== -1) {
        this.colorCode = colorCodes[this.game.players[this.game.turn].color];
        this.shapePath = shapePaths[this.game.players[this.game.turn].shape];
      }
      if (this.game.started && this.game.influenceActionNumber !== -1) {
        setTimeout(() => {
          this.game.influenceActionNumber = this.game.influenceActionNumber + 1;
          setTimeout(() => {
            this.game.departingInfluence = '';
            this.game.influenceActionNumber = -1;
          }, 2000);
        }, 2000);
      }
      if (this.game.turn && this.game.turn !== -1 && this.game.players[this.game.turn].coins > 9) {
        this.selection = 'coup';
      }
    });
    this.webSocketService.listen('return-to-influence-start').subscribe(() => {
      this.navigateBackToStartScreen();
    });
  }

  setNumberOfPlayers(numberOfPlayers) {
    const currentNumberOfPlayers = this.game.players.length;
    if (numberOfPlayers > currentNumberOfPlayers) {
      for (let i = 0; i < numberOfPlayers - currentNumberOfPlayers; i++) {
        this.game.players.push({
          name: `Player${currentNumberOfPlayers + i + 1}Name`,
          color: this.getNextAvailableColor(),
          shape: this.getNextAvailableShape(),
          leftInfluence: this.getNextAvailableInfluence(),
          rightInfluence: this.getNextAvailableInfluence(),
          leftInfluenceAlive: true,
          rightInfluenceAlive: true,
          coins: 2
        })
        this.game.players[this.game.players.length - 1].rightInfluence = this.getNextAvailableInfluence();
      }
    }
    if (numberOfPlayers < currentNumberOfPlayers) {
      this.game.players.splice(numberOfPlayers, currentNumberOfPlayers - numberOfPlayers);
    }
    this.webSocketService.emit('update-influence-game', this.game);
  }

  changeName(index, newName) {
    this.game.players[index].name = newName;
    this.webSocketService.emit('update-influence-game', this.game);
  }

  getPlayerClassName(index) {
    const playerIndexVal = index === 6 ? 'six'
      : index === 5 ? 'five'
        : index === 4 ? 'four'
          : index === 3 ? 'three'
            : index === 2 ? 'two'
              : 'one';
    const numberOfPlayersVal = this.game && this.game.players && this.game.players.length === 2 ? 'two'
      : this.game && this.game.players && this.game.players.length === 3 ? 'three'
        : this.game && this.game.players && this.game.players.length === 4 ? 'four'
          : this.game && this.game.players && this.game.players.length === 5 ? 'five'
            : 'six';
    return `${numberOfPlayersVal}-players-player-${playerIndexVal}`;
  }

  getNextAvailableShape() {
    let shape = -1;
    let found = false;
    while (!found) {
      shape = shape + 1;
      const shapeIndex = this.game.players.findIndex((player) => player.shape === shape);
      if (shapeIndex === -1) {
        found = true;
      }
    }
    return shape;
  }

  getNextAvailableColor() {
    let color = -1;
    let found = false;
    while (!found) {
      color = color + 1;
      const colorIndex = this.game.players.findIndex((player) => player.color === color);
      if (colorIndex === -1) {
        found = true;
      }
    }
    return color;
  }

  getNextAvailableInfluence() {
    let influence = -1;
    let found = false;
    while (!found) {
      influence = influence + 1;
      const influenceIndex = this.game.players.findIndex((player) => player.leftInfluence === influence || player.rightInfluence === influence);
      if (influenceIndex === -1) {
        found = true;
      }
    }
    return influence;
  }

  startGame() {
    const identityArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    this.game.turn = Math.floor(Math.random() * (this.game.players.length));
    for (let i = 0; i < this.game.players.length; i++) {
      let randomIndex = Math.floor(Math.random() * (identityArray.length));
      this.game.players[i].leftInfluence = identityArray[randomIndex];
      identityArray.splice(randomIndex, 1);
      randomIndex = Math.floor(Math.random() * (identityArray.length));
      this.game.players[i].rightInfluence = identityArray[randomIndex];
      identityArray.splice(randomIndex, 1);
      this.game.players[i].leftInfluenceAlive = true;
      this.game.players[i].rightInfluenceAlive = true;
      this.game.players[i].coins = this.game.players.length === 2 && this.game.turn === i ? 1 : 2;
    }
    this.game.challenger = -1;
    this.game.actionRecipient = -1;
    this.game.actionPerformer = -1;
    this.game.onlyOneCoin = false;
    this.game.phase = 1;
    this.game.extraInfluence1 = -1;
    this.game.extraInfluence2 = -1;
    this.game.departingInfluence = '';
    this.game.influenceActionNumber = -1;
    this.game.started = true;
    this.takeAvoidDisplayingAction();
    this.webSocketService.emit('update-influence-game', this.game);
    this.colorCode = colorCodes[this.game.players[this.game.turn].color];
    this.shapePath = shapePaths[this.game.players[this.game.turn].shape];
  }

  endGame() {
    this.game.started = false;
    this.webSocketService.emit('update-influence-game', this.game);
  }

  takeAvoidDisplayingAction() {
    this.avatar1.stopDisplayingInfluences();
    this.avatar2.stopDisplayingInfluences();
    if (this.game.players.length > 2) {
      this.avatar3.stopDisplayingInfluences();
    }
    if (this.game.players.length > 3) {
      this.avatar4.stopDisplayingInfluences();
    }
    if (this.game.players.length > 4) {
      this.avatar5.stopDisplayingInfluences();
    }
    if (this.game.players.length > 5) {
      this.avatar6.stopDisplayingInfluences();
    }
  }

  setSelection(val) {
    if (!(val === 'kill' && this.game.players[this.game.turn].coins < 3) && !(val === 'coup' && this.game.players[this.game.turn].coins < 7)) {
      this.selection = val;
      this.shapePath = shapePaths[this.game.players[this.game.turn].shape];
    }
  }

  getColorCode(index) {
    return colorCodes[this.game.players[index].color];
  }

  getShapePath(index) {
    return shapePaths[this.game.players[index].shape];
  }

  performActionToPlayer(playerIndex) {
    if (this.selection === 'steal' && this.game.players[playerIndex].coins > 0 && (this.game.players[playerIndex].leftInfluenceAlive || this.game.players[playerIndex].rightInfluenceAlive)) {
      this.game.actionPerformer = this.game.turn;
      this.game.actionRecipient = playerIndex;
      this.game.challenger = -1;
      if (this.game.players[playerIndex].coins === 1) {
        this.game.onlyOneCoin = true;
        this.game.players[playerIndex].coins = 0;
        this.game.players[this.game.turn].coins = this.game.players[this.game.turn].coins + 1;
      } else {
        this.game.onlyOneCoin = false;
        this.game.players[playerIndex].coins = this.game.players[playerIndex].coins - 2;
        this.game.players[this.game.turn].coins = this.game.players[this.game.turn].coins + 2;
      }
      this.game.phase = 2;
      this.game.turn = this.getNextAlivePlayer(this.game.turn);
      this.selection = 'none';
      this.webSocketService.emit('update-influence-game', this.game);
    }
    if (this.selection === 'kill' && (this.game.players[playerIndex].leftInfluenceAlive || this.game.players[playerIndex].rightInfluenceAlive)) {
      this.game.players[this.game.turn].coins = this.game.players[this.game.turn].coins - 3;
      this.game.actionPerformer = this.game.turn;
      this.game.actionRecipient = playerIndex;
      this.game.onlyOneCoin = false;
      this.game.phase = 23;
      this.selection = 'none';
      this.webSocketService.emit('update-influence-game', this.game);
    }
    if (this.selection === 'coup' && (this.game.players[playerIndex].leftInfluenceAlive || this.game.players[playerIndex].rightInfluenceAlive)) {
      this.game.players[this.game.turn].coins = this.game.players[this.game.turn].coins - 7;
      if (this.game.players[playerIndex].leftInfluenceAlive && this.game.players[playerIndex].rightInfluenceAlive) {
        this.game.actionPerformer = this.game.turn;
        this.game.actionRecipient = playerIndex;
        this.game.onlyOneCoin = false;
        this.game.phase = 29;
      } else {
        this.game.players[playerIndex].leftInfluenceAlive = false;
        this.game.players[playerIndex].rightInfluenceAlive = false;
        this.game.actionPerformer = -1;
        this.game.actionRecipient = -1;
        this.game.onlyOneCoin = false;
        this.game.phase = 1;
        if (this.evaluateIfGameIsOver()) {
          this.game.started = false;
        } else {
          this.game.turn = this.getNextAlivePlayer(this.game.turn);
        }
      }
      this.selection = 'none';
      this.webSocketService.emit('update-influence-game', this.game);
    }
  }

  evaluateIfGameIsOver() {
    let alivePlayers = 0;
    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i].leftInfluenceAlive || this.game.players[i].rightInfluenceAlive) {
        alivePlayers = alivePlayers + 1;
      }
    }
    if (alivePlayers < 2) {
      return true;
    }
    return false;
  }

  getNextAlivePlayer(playerIndex) {
    let playerFound = false;
    let indexOfNextPlayer = playerIndex;
    while (!playerFound) {
      indexOfNextPlayer = indexOfNextPlayer + 1;
      if (indexOfNextPlayer > this.game.players.length - 1) {
        indexOfNextPlayer = 0;
      }
      if (this.game.players[indexOfNextPlayer].leftInfluenceAlive || this.game.players[indexOfNextPlayer].rightInfluenceAlive) {
        playerFound = true;
      }
    }
    return indexOfNextPlayer;
  }

  goToAmbassadorInitialState() {
    this.game.actionPerformer = this.game.turn;
    this.game.actionRecipient = -1;
    this.game.onlyOneCoin = false;
    this.game.extraInfluence1 = this.getRandomInfluenceFromDeck();
    this.game.extraInfluence2 = this.getRandomInfluenceFromDeck(this.game.extraInfluence1);
    this.game.phase = 20;
    this.webSocketService.emit('update-influence-game', this.game);
  }

  getEveryInfluenceThatSomeoneDoesNotAlreadyHave() {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    for (let i = 0; i < this.game.players.length; i++) {
      const leftIndex = arr.findIndex((element => {
        return element === this.game.players[i].leftInfluence;
      }));
      arr.splice(leftIndex, 1);
      const rightIndex = arr.findIndex((element) => {
        return element === this.game.players[i].rightInfluence;
      });
      arr.splice(rightIndex, 1);
    }
    return arr;
  }

  getRandomInfluenceFromDeck(otherInfluenceToAccountFor = -1) {
    const influencesInDeck = this.getEveryInfluenceThatSomeoneDoesNotAlreadyHave();
    if (otherInfluenceToAccountFor !== -1) {
      const indexOfOtherInfluence = influencesInDeck.findIndex((element) => {
        return element === otherInfluenceToAccountFor;
      });
      influencesInDeck.splice(indexOfOtherInfluence, 1);
    }
    return influencesInDeck[Math.floor(Math.random() * influencesInDeck.length)];
  }

  getChallengedInfluence() {
    return this.game.phase === 10 || this.game.phase === 12 ? 'Duke' :
      this.game.phase === 14 || this.game.phase === 16 ? 'Captain' :
        this.game.phase === 18 || this.game.phase === 21 ? 'Ambassador' :
          this.game.phase === 24 ? 'Assassin' : 'Contessa';
  }

  takeOneCoin() {
    this.game.players[this.game.turn].coins = this.game.players[this.game.turn].coins + 1;
    this.game.phase = 1;
    this.game.actionPerformer = -1;
    this.game.actionRecipient = -1;
    this.game.onlyOneCoin = false;
    this.game.extraInfluence1 = -1;
    this.game.extraInfluence2 = -1;
    this.game.turn = this.getNextAlivePlayer(this.game.turn);
    this.webSocketService.emit('update-influence-game', this.game);
  }

  takeTwoCoins() {
    this.game.players[this.game.turn].coins = this.game.players[this.game.turn].coins + 2;
    this.game.phase = 8;
    this.game.actionPerformer = this.game.turn;
    this.game.actionRecipient = -1;
    this.game.extraInfluence1 = -1;
    this.game.extraInfluence2 = -1;
    this.game.turn = this.getNextAlivePlayer(this.game.turn);
    this.webSocketService.emit('update-influence-game', this.game);
  }

  takeThreeCoins() {
    this.game.players[this.game.turn].coins = this.game.players[this.game.turn].coins + 3;
    this.game.phase = 4;
    this.game.actionPerformer = this.game.turn;
    this.game.actionRecipient = -1;
    this.game.extraInfluence1 = -1;
    this.game.extraInfluence2 = -1;
    this.game.turn = this.getNextAlivePlayer(this.game.turn);
    this.webSocketService.emit('update-influence-game', this.game);
  }

  getChallengeableClaimDescription() {
    if (!this.game || !this.game.started || !this.game.phase) {
      return '';
    }
    if (this.game.phase === 2 && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length && this.game.actionRecipient >= 0 && this.game.actionRecipient < this.game.players.length) {
      return `Challengeable Claim: ${this.game.players[this.game.actionPerformer].name} used Captain power to steal ${this.game.onlyOneCoin ? '1 coin' : '2 coins'} from ${this.game.players[this.game.actionRecipient].name}`;
    }
    if (this.game.phase === 4 && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length) {
      return `Challengeable Claim: ${this.game.players[this.game.actionPerformer].name} used Duke power to take 3 coins from the treasury`;
    }
    if (this.game.phase === 5 && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length && this.game.actionRecipient >= 0 && this.game.actionRecipient < this.game.players.length) {
      return `Challengeable Claim: ${this.game.players[this.game.actionPerformer].name} used Ambassador power to block ${this.game.players[this.game.actionRecipient].name}'s stealing of ${this.game.onlyOneCoin ? '1 coin' : '2 coins'}`;
    }
    if (this.game.phase === 6 && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length && this.game.actionRecipient >= 0 && this.game.actionRecipient < this.game.players.length) {
      return `Challengeable Claim: ${this.game.players[this.game.actionPerformer].name} used Captain power to block ${this.game.players[this.game.actionRecipient].name}'s stealing of ${this.game.onlyOneCoin ? '1 coin' : '2 coins'}`;
    }
    if (this.game.phase === 7 && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length && this.game.actionRecipient >= 0 && this.game.actionRecipient < this.game.players.length) {
      return `Challengeable Claim: ${this.game.players[this.game.actionPerformer].name} used Contessa power to block ${this.game.players[this.game.actionRecipient].name}'s assassination of their influence`;
    }
    if (this.game.phase === 8 && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length) {
      return `Challengeable Claim: None, however players can claim duke and block ${this.game.players[this.game.actionPerformer].name}'s foreign aid (Taking of 2 coins)`;
    }
    if (this.game.phase === 9 && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length && this.game.actionRecipient >= 0 && this.game.actionRecipient < this.game.players.length) {
      return `Challengeable Claim: ${this.game.players[this.game.actionPerformer].name} used Duke power to block ${this.game.players[this.game.actionRecipient].name}'s Foreign Aid (Taking of 2 coins)`;
    }
    if (this.game.phase === 20 && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length) {
      return `Challengeable Claim: ${this.game.players[this.game.actionPerformer].name} is using Ambassador power to potentially swap 1 or both influences`;
    }
    if (this.game.phase === 23 && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length && this.game.actionRecipient >= 0 && this.game.actionRecipient < this.game.players.length) {
      return `Challengeable Claim: ${this.game.players[this.game.actionPerformer].name} is using Assassin power to pay 3 coins and kill an influence of ${this.game.players[this.game.actionRecipient].name}`;
    }
    return '';
  }

  getChallengeResponseMessage() {
    return `${this.game.players[this.game.challenger].name} has challenged ${this.game.players[this.game.actionPerformer].name}'s claim to having a ${this.getChallengedInfluence()}, Now ${this.game.players[this.game.actionPerformer].name} must click one of their influences to reveal.  If the influence is a ${this.getChallengedInfluence()}, then ${this.game.players[this.game.actionPerformer].name} will receive a new random influence in its place, and ${this.game.players[this.game.challenger].name} will lose an influence.  If the revealed influence is not a ${this.getChallengedInfluence()}, then it will be a lost influence for ${this.game.players[this.game.actionPerformer].name}.`;
  }

  getInformationSquareInformation() {
    if (this.game.influenceActionNumber !== -1) {
      if (this.game.influenceActionNumber === 0 || this.game.influenceActionNumber === 1) {
        return `${this.game.players[0].name} is getting a new random influence in place of their left influence, which was a ${this.game.departingInfluence}`;
      }
      if (this.game.influenceActionNumber === 2 || this.game.influenceActionNumber === 3) {
        return `${this.game.players[0].name} is getting a new random influence in place of their right influence, which was a ${this.game.departingInfluence}`;
      }
      if (this.game.influenceActionNumber === 4 || this.game.influenceActionNumber === 5) {
        return `${this.game.players[1].name} is getting a new random influence in place of their left influence, which was a ${this.game.departingInfluence}`;
      }
      if (this.game.influenceActionNumber === 6 || this.game.influenceActionNumber === 7) {
        return `${this.game.players[1].name} is getting a new random influence in place of their right influence, which was a ${this.game.departingInfluence}`;
      }
      if (this.game.influenceActionNumber === 8 || this.game.influenceActionNumber === 9) {
        return `${this.game.players[2].name} is getting a new random influence in place of their left influence, which was a ${this.game.departingInfluence}`;
      }
      if (this.game.influenceActionNumber === 10 || this.game.influenceActionNumber === 11) {
        return `${this.game.players[2].name} is getting a new random influence in place of their right influence, which was a ${this.game.departingInfluence}`;
      }
      if (this.game.influenceActionNumber === 12 || this.game.influenceActionNumber === 13) {
        return `${this.game.players[3].name} is getting a new random influence in place of their left influence, which was a ${this.game.departingInfluence}`;
      }
      if (this.game.influenceActionNumber === 14 || this.game.influenceActionNumber === 15) {
        return `${this.game.players[3].name} is getting a new random influence in place of their right influence, which was a ${this.game.departingInfluence}`;
      }
      if (this.game.influenceActionNumber === 16 || this.game.influenceActionNumber === 17) {
        return `${this.game.players[4].name} is getting a new random influence in place of their left influence, which was a ${this.game.departingInfluence}`;
      }
      if (this.game.influenceActionNumber === 18 || this.game.influenceActionNumber === 19) {
        return `${this.game.players[4].name} is getting a new random influence in place of their right influence, which was a ${this.game.departingInfluence}`;
      }
      if (this.game.influenceActionNumber === 20 || this.game.influenceActionNumber === 21) {
        return `${this.game.players[5].name} is getting a new random influence in place of their left influence, which was a ${this.game.departingInfluence}`;
      }
      if (this.game.influenceActionNumber === 22 || this.game.influenceActionNumber === 23) {
        return `${this.game.players[5].name} is getting a new random influence in place of their right influence, which was a ${this.game.departingInfluence}`;
      }
    }
    if ((this.game.phase === 10 || this.game.phase === 12 || this.game.phase === 14 || this.game.phase === 16 || this.game.phase === 18 || this.game.phase === 21 || this.game.phase === 24 || this.game.phase === 27) && this.game.challenger >= 0 && this.game.challenger < this.game.players.length && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length) {
      return this.getChallengeResponseMessage();
    }
    if ((this.game.phase === 11 || this.game.phase === 13 || this.game.phase === 15 || this.game.phase === 17 || this.game.phase === 19 || this.game.phase === 22 || this.game.phase === 25 || this.game.phase === 28) && this.game.challenger >= 0 && this.game.challenger < this.game.players.length) {
      return `${this.game.players[this.game.challenger].name} has incorrectly challenged a claim and must now click on an influence to lose.`;
    }
    if (this.game.phase === 20 && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length) {
      return `${this.game.players[this.game.actionPerformer].name} is claiming ambassador to shuffle their cards with the court deck.  They should allow other players to challenge their claim, then when they're ready with the two influences they choose, click done.`;
    }
    if (this.game.phase === 23 && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length && this.game.actionRecipient >= 0 && this.game.actionRecipient < this.game.players.length) {
      return `${this.game.players[this.game.actionPerformer].name} is claiming Assassin power to make ${this.game.players[this.game.actionRecipient].name} lose an influence.  Anyone can challenge ${this.game.players[this.game.actionPerformer].name}'s Assassin claim.  Additionally ${this.game.players[this.game.actionRecipient].name} can claim they have a contessa to block the assassination.  ${this.game.players[this.game.actionRecipient].leftInfluenceAlive && this.game.players[this.game.actionRecipient].rightInfluenceAlive ? 'Note that a failed Contessa claim will result in losing both influences.  ' : ''}Otherwise they can just click the influence to lose it.`;
    }
    if (this.game.phase === 26 && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length && this.game.actionRecipient >= 0 && this.game.actionRecipient < this.game.players.length) {
      if (this.game.players[this.game.actionRecipient].leftInfluenceAlive && this.game.players[this.game.actionRecipient].rightInfluenceAlive) {
        return `Challenging ${this.game.players[this.game.actionPerformer].name}'s claim to Assassin power failed, but ${this.game.players[this.game.actionRecipient].name} still has the option to claim a Contessa (Resulting in losing both influences if the claim fails).  Alternatively, ${this.game.players[this.game.actionRecipient].name} can simply choose an influence to lose by clicking on it`
      }
      if (!this.game.players[this.game.actionRecipient].leftInfluenceAlive || !this.game.players[this.game.actionRecipient].rightInfluenceAlive) {
        return `At this point, all ${this.game.players[this.game.actionRecipient].name} can do in response to ${this.game.players[this.game.actionPerformer].name}'s assassination attempt is claim their remaining influence is a Contessa to block the assassination.  Or they can just click the influence to lose the game.`
      }
    }
    if (this.game.phase === 29 && this.game.actionPerformer >= 0 && this.game.actionPerformer < this.game.players.length && this.game.actionRecipient >= 0 && this.game.actionRecipient < this.game.players.length) {
      return `${this.game.players[this.game.actionPerformer].name} is couping ${this.game.players[this.game.actionRecipient].name}.  ${this.game.players[this.game.actionRecipient].name} must click an influence to lose it`;
    }
    if (this.game.phase === 30) {
      return `The attempt to challenge the Ambassador claim failed.  Now the players must wait for ${this.game.players[this.game.actionPerformer].name} to finish selecting their influences.  They should push done when completed.`;
    }
    return ''
  }
}
