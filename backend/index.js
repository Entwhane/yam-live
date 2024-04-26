const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var uniqid = require('uniqid');
const GameService = require('./services/game.service');

// ---------------------------------------------------
// -------- CONSTANTS AND GLOBAL VARIABLES -----------
// ---------------------------------------------------
let games = [];
let queue = [];

// ---------------------------------
// -------- VIEWS METHODS -----------
// ---------------------------------

const updateClientsViewTimers = (game, botGame = false) => {
  setTimeout(() => {
    game.player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', game.gameState));
    if (!botGame) {
      game.player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', game.gameState));
    }
  }, 400)
}

const updateClientsViewDecks = (game, botGame = false) => {
  setTimeout(() => {
    game.player1Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:1', game.gameState))
    if (!botGame) {
      game.player2Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:2', game.gameState))
    }
  }, 400)
}

const updateClientsViewChoices = (game, botGame = false) => {
  setTimeout(() => {
    game.player1Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:1', game.gameState))
    if (!botGame) {
      game.player2Socket.emit('game.choices.view-state', GameService.send.forPlayer.choicesViewState('player:2', game.gameState))
    }
  }, 400)
}

const updateClientsViewGrid = (game, botGame = false) => {
  setTimeout(() => {
    game.player1Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:1', game.gameState))
    if (!botGame) {
      game.player2Socket.emit('game.grid.view-state', GameService.send.forPlayer.gridViewState('player:2', game.gameState))
    }
  }, 400)
}

const updateClientsViewScores = (game, botGame = false) => {
  setTimeout(() => {
    game.player1Socket.emit('game.scores', GameService.send.forPlayer.scoresViewState('player:1', game.gameState))
    if (!botGame) {
      game.player2Socket.emit('game.scores', GameService.send.forPlayer.scoresViewState('player:2', game.gameState))
    }
  }, 400)
}

const updateClientsViewPawns = (game, botGame = false) => {
  setTimeout(() => {
    game.player1Socket.emit('game.pawns', GameService.send.forPlayer.pawnsViewState('player:1', game.gameState))
    if (!botGame) {
      game.player2Socket.emit('game.pawns', GameService.send.forPlayer.pawnsViewState('player:2', game.gameState))
    }
  }, 400)
}

const updateClientsViewResult = (game, botGame = false) => {
  setTimeout(() => {
    game.player1Socket.emit('game.result', GameService.send.forPlayer.resultViewState('player:1', game.gameState))
    if (!botGame) {
      game.player2Socket.emit('game.result', GameService.send.forPlayer.resultViewState('player:2', game.gameState))
    }
  }, 200)
}

// ---------------------------------------
// -------- GAME METHODS -----------------
// ---------------------------------------
const rollDices = (game, botGame) => {

  game.gameState.deck.dices = GameService.dices.roll(game.gameState.deck.dices)
  game.gameState.deck.rollsCounter++;

  // combinations management
  const dices = { ...game.gameState.deck.dices };
  const isDefi = false;
  const isSec = game.gameState.deck.rollsCounter === 2;
  const combinations = GameService.choices.findCombinations(dices, isDefi, isSec);

  // we affect changes to gameState
  game.gameState.choices.availableChoices = combinations;

  if (game.gameState.deck.rollsCounter > game.gameState.deck.rollsMaximum) {
    game.gameState.deck.dices = GameService.dices.lockEveryDice(game.gameState.deck.dices)
    game.gameState.timer = 5
  }

  updateClientsViewChoices(game, botGame);
  updateClientsViewDecks(game, botGame)
  updateClientsViewTimers(game, botGame)
}

const lockDice = (game, idDice, botGame) => {
  const indexDice = GameService.utils.findDiceIndexByDiceId(game.gameState.deck.dices, idDice)
  if (botGame) {
    game.gameState.deck.dices[indexDice].locked = true
  } else {
    game.gameState.deck.dices[indexDice].locked = game.gameState.deck.dices[indexDice].locked === true ? false : true
  }
  updateClientsViewDecks(game, botGame)
}

const selectChoice = (game, choiceId, botGame) => {
  game.gameState.choices.idSelectedChoice = choiceId;
  game.gameState.grid = GameService.grid.resetcanBeCheckedCells(game.gameState.grid);
  game.gameState.grid = GameService.grid.updateGridAfterSelectingChoice(game.gameState.choices.idSelectedChoice, game.gameState.grid);

  updateClientsViewGrid(game, botGame);
  updateClientsViewChoices(game, botGame);
}

const selectGrid = (game, data, botGame) => {
  // La sélection d'une cellule signifie la fin du tour (ou plus tard le check des conditions de victoires)
  // On reset l'état des cases qui étaient précédemment clicables.
  game.gameState.grid = GameService.grid.resetcanBeCheckedCells(game.gameState.grid);
  game.gameState.grid = GameService.grid.selectCell(data.cellId, data.rowIndex, data.cellIndex, game.gameState.currentTurn, game.gameState.grid);

  // TODO: Ici calculer le score
  const checkGrid = GameService.grid.checkYamMaster(game.gameState.grid)

  game.gameState.player1Score = checkGrid.score1
  game.gameState.player2Score = checkGrid.score2
  // TODO: Puis check si la partie s'arrête (lines / diagolales / no-more-gametokens)
  game.gameState.player1Pawns = checkGrid.pawns1
  game.gameState.player2Pawns = checkGrid.pawns2

  if (checkGrid.winner) {
    game.gameState.winner = checkGrid.winner
    updateClientsViewResult(game, botGame);
  }


  // Sinon on finit le tour
  game.gameState.currentTurn = game.gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
  game.gameState.timer = GameService.timer.getTurnDuration();

  // On remet le deck et les choix à zéro (la grille, elle, ne change pas)
  game.gameState.deck = GameService.init.deck();
  game.gameState.choices = GameService.init.choices();

  // et on remet à jour la vue
  updateClientsViewTimers(game, botGame);
  updateClientsViewScores(game, botGame);
  updateClientsViewPawns(game, botGame);
  updateClientsViewDecks(game, botGame);
  updateClientsViewChoices(game, botGame);
  updateClientsViewGrid(game, botGame);
}

const newPlayerInQueue = (socket) => {

  queue.push(socket);

  // Queue management
  if (queue.length >= 2) {
    const player1Socket = queue.shift();
    const player2Socket = queue.shift();
    createGame(player1Socket, player2Socket);
  }
  else {
    socket.emit('queue.added', GameService.send.forPlayer.viewQueueState());
  }
};

const createGame = (player1Socket, player2Socket) => {

  console.log('oeivhuighiuvfhvu');


  const newGame = GameService.init.gameState();

  newGame['idGame'] = uniqid();
  newGame['player1Socket'] = player1Socket;
  newGame['player2Socket'] = player2Socket;

  games.push({ ...newGame });
  // games.push(JSON.parse(JSON.stringify(newGame)));

  // console.log(games);
  console.log('##########');
  // console.log(newGame);

  const gameIndex = GameService.utils.findGameIndexById(games, newGame.idGame);

  games[gameIndex].gameState.grid = GameService.init.grid()

  // On execute une fonction toutes les secondes (1000 ms)
  const gameInterval = setInterval(() => {

    games[gameIndex].gameState.timer--;

    // Si le timer tombe à zéro
    if (games[gameIndex].gameState.timer === 0) {

      // On change de tour en inversant le clé dans 'currentTurn'
      games[gameIndex].gameState.currentTurn = games[gameIndex].gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';

      // Méthode du service qui renvoie la constante 'TURN_DURATION'
      games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();
      games[gameIndex].gameState.grid = GameService.grid.resetcanBeCheckedCells(games[gameIndex].gameState.grid)

      games[gameIndex].gameState.deck = GameService.init.deck()
      games[gameIndex].gameState.choices = GameService.init.choices()

      updateClientsViewGrid(games[gameIndex])
      updateClientsViewChoices(games[gameIndex])
      updateClientsViewDecks(games[gameIndex])
    }

    updateClientsViewTimers(games[gameIndex])

  }, 1000);


  games[gameIndex].player1Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:1', games[gameIndex]));
  games[gameIndex].player2Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:2', games[gameIndex]));

  updateClientsViewPawns(games[gameIndex]);
  updateClientsViewGrid(games[gameIndex])
  updateClientsViewDecks(games[gameIndex])
  updateClientsViewTimers(games[gameIndex]);
  updateClientsViewScores(games[gameIndex]);
  updateClientsViewChoices(games[gameIndex]);

  // On prévoit de couper l'horloge
  // pour le moment uniquement quand le socket se déconnecte
  player1Socket.on('game.grid.selected', () => {
    if (games[gameIndex].gameState.winner) {
      clearInterval(gameInterval)
    }
  });

  player2Socket.on('game.grid.selected', () => {
    if (games[gameIndex].gameState.winner) {
      clearInterval(gameInterval)
    }
  });


  player1Socket.on('disconnect', () => {
    clearInterval(gameInterval);
  });

  player2Socket.on('disconnect', () => {
    clearInterval(gameInterval);
  });

};

const createBotGame = (playerSocket) => {
  const newGame = GameService.init.gameState();

  newGame['idGame'] = uniqid();
  newGame['player1Socket'] = playerSocket;
  newGame['player2Socket'] = null; // Bot n'a pas de socket

  games.push({ ...newGame });

  const gameIndex = GameService.utils.findGameIndexById(games, newGame.idGame);

  games[gameIndex].gameState.grid = GameService.init.grid();

  const gameInterval = setInterval(() => {
    games[gameIndex].gameState.timer--;

    if (games[gameIndex].gameState.timer === 0) {

      games[gameIndex].gameState.currentTurn = games[gameIndex].gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';

      // Méthode du service qui renvoie la constante 'TURN_DURATION'
      games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();
      games[gameIndex].gameState.grid = GameService.grid.resetcanBeCheckedCells(games[gameIndex].gameState.grid)

      games[gameIndex].gameState.deck = GameService.init.deck()
      games[gameIndex].gameState.choices = GameService.init.choices()

      updateClientsViewGrid(games[gameIndex], true)
      updateClientsViewChoices(games[gameIndex], true)
      updateClientsViewDecks(games[gameIndex], true)
    }

    updateClientsViewTimers(games[gameIndex], true);
  }, 1000);

  const botInterval = setInterval(() => {
    if (games[gameIndex].gameState.currentTurn == 'player:2' && games[gameIndex].gameState.deck.rollsCounter <= games[gameIndex].gameState.deck.rollsMaximum) {

      rollDices(games[gameIndex], true);

      const choices = GameService.choices.findCombinations(games[gameIndex].gameState.deck.dices, false, games[gameIndex].gameState.deck.rollsCounter === 2);
      const randomChoice = choices[Math.floor(Math.random() * choices.length)];
      
      setTimeout(() => {
        const similarIds = GameService.utils.findSimilarDiceIds(games[gameIndex].gameState.deck.dices)
        similarIds.forEach((idDice) => {
          lockDice(games[gameIndex], idDice, true);
        })
      }, 500)

      if (randomChoice) {
        setTimeout(() => {
          setTimeout(() => {
            const gridChoices = GameService.utils.findElementIndex(games[gameIndex].gameState.grid, randomChoice.id)
            const randomGridChoice = gridChoices[Math.floor(Math.random() * gridChoices.length)]

            if (randomGridChoice) {
              const data = {
                cellId: randomChoice.id,
                rowIndex: randomGridChoice.rowIndex,
                cellIndex: randomGridChoice.colIndex
              }

              selectGrid(games[gameIndex], data, true)
            }
          }, 2000);
          selectChoice(games[gameIndex], randomChoice.id, true)
        }, 2000);
      }
    }
  }, 5000);

  games[gameIndex].player1Socket.emit('game.start', GameService.send.forPlayer.viewGameState('player:1', games[gameIndex], true));

  updateClientsViewPawns(games[gameIndex], true);
  updateClientsViewGrid(games[gameIndex], true);
  updateClientsViewDecks(games[gameIndex], true);
};

// ---------------------------------------
// -------- SOCKETS MANAGEMENT -----------
// ---------------------------------------

io.on('connection', socket => {
  console.log(`[${socket.id}] socket connected`);

  socket.on('bot.join', () => {
    console.log(`[${socket.id}] new player in bot `)
    createBotGame(socket);
  });

  socket.on('queue.join', () => {
    console.log(`[${socket.id}] new player in queue `)
    newPlayerInQueue(socket);
  });

  socket.on('game.dices.roll', (botGame = false) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    const game = games[gameIndex]
    rollDices(game, botGame)
  });

  socket.on('game.dices.lock', (idDice, botGame = false) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    const game = games[gameIndex]
    lockDice(game, idDice, botGame)
  });

  socket.on('game.choices.selected', (data, botGame = false) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    const game = games[gameIndex]
    selectChoice(game, data.choiceId, botGame)
  });

  socket.on('game.grid.selected', (data, botGame = false) => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);
    const game = games[gameIndex]
    selectGrid(game, data, botGame)
  });

  socket.on('disconnect', reason => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
  });
});

// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------

app.get('/', (req, res) => res.sendFile('index.html'));

http.listen(3000, function () {
  console.log('listening on *:3000');
});