// Durée d'un tour en secondes
const TURN_DURATION = 30;

const CHOICES_INIT = {
    isDefi: false,
    isSec: false,
    idSelectedChoice: null,
    availableChoices: [],
};

const ALL_COMBINATIONS = [
    { value: '1', id: 'brelan1' },
    { value: '2', id: 'brelan2' },
    { value: '3', id: 'brelan3' },
    { value: '4', id: 'brelan4' },
    { value: '5', id: 'brelan5' },
    { value: '6', id: 'brelan6' },
    { value: 'Full', id: 'full' },
    { value: 'Carré', id: 'carre' },
    { value: 'Yam', id: 'yam' },
    { value: 'Suite', id: 'suite' },
    { value: '≤8', id: 'moinshuit' },
    { value: 'Sec', id: 'sec' },
    { value: 'Défi', id: 'defi' }
];

const DECK_INIT = {
    dices: [
        { id: 1, value: '', locked: true },
        { id: 2, value: '', locked: true },
        { id: 3, value: '', locked: true },
        { id: 4, value: '', locked: true },
        { id: 5, value: '', locked: true },
    ],
    rollsCounter: 1,
    rollsMaximum: 3
};

const GAME_INIT = {
    gameState: {
        currentTurn: 'player:1',
        timer: null,
        player1Score: 0,
        player2Score: 0,
        player1Pawns: 12,
        player2Pawns: 12,
        winner: null,
        grid: [],
        choices: {},
        deck: {}
    }
}

const GRID_INIT = [
    [
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: 'Yam', id: 'yam', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
    ]
];

const GameService = {
    init: {
        gameState: () => {
            const game = { ...GAME_INIT };
            game['gameState']['timer'] = TURN_DURATION;
            game['gameState']['deck'] = { ...DECK_INIT };
            game['gameState']['choices'] = { ...CHOICES_INIT };
            game['gameState']['grid'] = [...GRID_INIT];
            return game;
        },
        deck: () => {
            return { ...DECK_INIT };
        },
        choices: () => {
            return { ...CHOICES_INIT };
        },
        grid: () => {
            return [...GRID_INIT];
        }
    },
    send: {
        forPlayer: {
            // Return conditionnaly gameState custom objet for player views
            viewGameState: (playerKey, game) => {
                return {
                    inQueue: false,
                    inGame: true,
                    idPlayer:
                        (playerKey === 'player:1')
                            ? game.player1Socket.id
                            : game.player2Socket.id,
                    idOpponent:
                        (playerKey === 'player:1')
                            ? game.player2Socket.id
                            : game.player1Socket.id
                };
            },
            viewQueueState: () => {
                return {
                    inQueue: true,
                    inGame: false,
                };
            },
            gameTimer: (playerKey, gameState) => {
                // Selon la clé du joueur on adapte la réponse (player / opponent)
                const playerTimer = gameState.currentTurn === playerKey ? gameState.timer : 0;
                const opponentTimer = gameState.currentTurn === playerKey ? 0 : gameState.timer;
                return { playerTimer: playerTimer, opponentTimer: opponentTimer };
            },
            deckViewState: (playerKey, gameState) => {
                const deckViewState = {
                    displayDecks: !gameState.winner,
                    displayPlayerDeck: gameState.currentTurn === playerKey,
                    displayOpponentDeck: gameState.currentTurn !== playerKey,
                    rollsCounter: gameState.deck.rollsCounter,
                    rollsMaximum: gameState.deck.rollsMaximum,
                    displayRollButton: gameState.deck.rollsCounter <= gameState.deck.rollsMaximum,
                    dices: gameState.deck.dices
                };
                return deckViewState;
            },
            choicesViewState: (playerKey, gameState) => {
                const choicesViewState = {
                    displayChoices: true,
                    canMakeChoice: playerKey === gameState.currentTurn,
                    idSelectedChoice: gameState.choices.idSelectedChoice,
                    availableChoices: gameState.choices.availableChoices
                }
                return choicesViewState;
            },
            gridViewState: (playerKey, gameState) => {
                return {
                    displayGrid: true,
                    canSelectCells: (playerKey === gameState.currentTurn) && (gameState.choices.availableChoices.length > 0),
                    grid: gameState.grid
                };
            },
            scoresViewState: (playerKey, gameState) => {
                const scoresViewState = {
                    playerScore: playerKey == 'player:1' ? gameState.player1Score : gameState.player2Score,
                    opponentScore: playerKey == 'player:1' ? gameState.player2Score : gameState.player1Score
                }
                return scoresViewState
            },
            pawnsViewState: (playerKey, gameState) => {
                const pawnsViewState = {
                    playerPawns: playerKey == 'player:1' ? gameState.player1Pawns : gameState.player2Pawns,
                    opponentPawns: playerKey == 'player:1' ? gameState.player2Pawns : gameState.player1Pawns
                }
                return pawnsViewState
            },
            resultViewState: (playerKey, gameState) => {
                let gameResult = null
                if (playerKey === gameState.winner) {
                    gameResult = "Victoire"
                } else if (playerKey !== gameState.winner) {
                    gameResult = "Défaite"
                } else {
                    gameResult = "Égalité"
                }

                return { gameResult: gameResult }

            },
        }
    },
    timer: {
        getTurnDuration: () => {
            return TURN_DURATION;
        }
    },
    dices: {
        roll: (dicesToRoll) => {
            const rolledDices = dicesToRoll.map(dice => {
                if (dice.value === "") {
                    // Si la valeur du dé est vide, alors on le lance en mettant le flag locked à false
                    const newValue = String(Math.floor(Math.random() * 6) + 1);
                    return {
                        id: dice.id,
                        value: newValue,
                        locked: false
                    };
                } else if (!dice.locked) {
                    // Si le dé n'est pas verrouillé et possède déjà une valeur, alors on le relance
                    const newValue = String(Math.floor(Math.random() * 6) + 1);
                    return {
                        ...dice,
                        value: newValue
                    };
                } else {
                    // Si le dé est verrouillé ou a déjà une valeur mais le flag locked est true, on le laisse tel quel
                    return dice;
                }
            });
            return rolledDices;
        },

        lockEveryDice: (dicesToLock) => {
            const lockedDices = dicesToLock.map(dice => ({
                ...dice,
                locked: true
            }));
            return lockedDices;
        }
    },
    choices: {
        findCombinations: (dices, isDefi, isSec) => {

            const allCombinations = ALL_COMBINATIONS;

            // Tableau des objets 'combinations' disponibles parmi 'ALL_COMBINATIONS'
            const availableCombinations = [];

            // Tableau pour compter le nombre de dés de chaque valeur (de 1 à 6)
            const counts = Array(7).fill(0);

            let hasPair = false; // check: paire
            let threeOfAKindValue = null; // check: valeur brelan
            let hasThreeOfAKind = false; // check: brelan
            let hasFourOfAKind = false; // check: carré
            let hasFiveOfAKind = false; // check: yam
            let hasStraight = false; // check: suite
            let sum = 0; // sum of dices


            for (const key in dices) {
                const dice = dices[key];
                const diceValue = dice.value;
                counts[diceValue]++
                sum += parseInt(diceValue)
            }

            let isLessThanEqual8 = sum <= 8 ? true : false

            let count = 0;
            for (let i = 0; i < counts.length; i++) {
                if (counts[i] === 5) {
                    threeOfAKindValue = i
                    hasFiveOfAKind = true
                }
                if (counts[i] >= 4) {
                    threeOfAKindValue = i
                    hasFourOfAKind = true
                }
                if (counts[i] >= 3) {
                    threeOfAKindValue = i
                    hasThreeOfAKind = true
                }
                if (counts[i] === 2) {
                    hasPair = true
                }
                // Suite
                if (counts[i] === 1) {
                    count++;
                    if (count === 5) {
                        hasStraight = true;
                    }
                } else {
                    count = 0;
                }
            }

            allCombinations.forEach(combination => {
                if (
                    (combination.id.includes('brelan') && hasThreeOfAKind && parseInt(combination.id.slice(-1)) === threeOfAKindValue) ||
                    (combination.id === 'full' && hasPair && hasThreeOfAKind) ||
                    (combination.id === 'carre' && hasFourOfAKind) ||
                    (combination.id === 'yam' && hasFiveOfAKind) ||
                    (combination.id === 'suite' && hasStraight) ||
                    (combination.id === 'moinshuit' && isLessThanEqual8) ||
                    (combination.id === 'defi' && isDefi)
                ) {
                    availableCombinations.push(combination);
                }
            });

            const notOnlyBrelan = availableCombinations.some(combination => !combination.id.includes('brelan'));

            if (isSec && availableCombinations.length > 0 && notOnlyBrelan) {
                availableCombinations.push(allCombinations.find(combination => combination.id === 'sec'));
            }

            return availableCombinations;
        }
    },
    grid: {
        resetcanBeCheckedCells: (grid) => {
            // La grille retournée doit avoir le flag 'canBeChecked' de toutes les cases de la 'grid' à 'false'
            const updatedGrid = grid.map(row =>
                row.map(cell => ({
                    ...cell,
                    canBeChecked: false
                }))
            );
            return updatedGrid;
        },

        updateGridAfterSelectingChoice: (idSelectedChoice, grid) => {
            // La grille retournée doit avoir toutes les 'cells' qui ont le même 'id' que le 'idSelectedChoice' à 'canBeChecked: true'
            const updatedGrid = grid.map(row =>
                row.map(cell => ({
                    ...cell,
                    canBeChecked: cell.id === idSelectedChoice && !cell.owner ? true : false
                }))
            );
            return updatedGrid;
        },

        selectCell: (idCell, rowIndex, cellIndex, currentTurn, grid) => {
            // La grille retournée doit avoir avoir la case selectionnée par le joueur du tour en cours à 'owner: currentTurn'
            // Nous avons besoin de rowIndex et cellIndex pour différencier les deux combinaisons similaires du plateau
            const updatedGrid = grid
            if (updatedGrid[rowIndex][cellIndex].id == idCell) {
                updatedGrid[rowIndex][cellIndex].owner = currentTurn;
            }
            return updatedGrid;
        },
        valeursSimilairesSeSuivent: (line, numberOfValues) => {
            // On donne une ligne (array) de 5 cases (horizontale, vertical ou diagonal) puis on précise la taille de la séquence
            // à laquelle on veux trouver une correspondance (ex: 4 pions alignés)
            for (let i = 0; i < line.length - (numberOfValues - 1); i++) {
                let followingValues = false;
                if (GameService.grid.checkCellOwner(line[i])) {
                    for (let j = 1; j < numberOfValues; j++) {
                        if (GameService.grid.checkCellOwner(line[i]) !== GameService.grid.checkCellOwner(line[i + j])) {
                            followingValues = false
                            break;
                        } else {
                            followingValues = true
                        }
                    }
                }
                if (followingValues) {
                    return GameService.grid.checkCellOwner(line[i]);
                }
            }
            return null;
        },
        checkCellOwner: (cell) => {
            // Retourne l'owner d'une case
            if (cell) {
                return cell.owner
            }
            return null
        },
        checkYamMaster: (grid) => {
            const rows = 5
            const columns = 5
            let winner = null;
            let score1 = 0;
            let score2 = 0;
            let pawns1 = 12;
            let pawns2 = 12;
            //  Horizontal et vertical
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    // Horizontal
                    if (j <= columns - 5) {
                        const horizontalSequence = grid[i].slice(j, j + 5);

                        if (GameService.grid.valeursSimilairesSeSuivent(horizontalSequence, 5)) {
                            winner = GameService.grid.valeursSimilairesSeSuivent(horizontalSequence, 5)
                        } else if (GameService.grid.valeursSimilairesSeSuivent(horizontalSequence, 4)) {
                            GameService.grid.valeursSimilairesSeSuivent(horizontalSequence, 4) == 'player:1' ? score1 += 2 : score2 += 2
                        } else if (GameService.grid.valeursSimilairesSeSuivent(horizontalSequence, 3)) {
                            GameService.grid.valeursSimilairesSeSuivent(horizontalSequence, 3) == 'player:1' ? score1 += 1 : score2 += 1
                        }
                    }

                    // Vertical
                    if (i <= rows - 5) {
                        const verticalSequence = [];
                        for (let k = i; k < i + 5; k++) {
                            verticalSequence.push(grid[k][j]);
                        }
                        if (GameService.grid.valeursSimilairesSeSuivent(verticalSequence, 5)) {
                            winner = GameService.grid.valeursSimilairesSeSuivent(verticalSequence, 5)
                        } else if (GameService.grid.valeursSimilairesSeSuivent(verticalSequence, 4)) {
                            GameService.grid.valeursSimilairesSeSuivent(verticalSequence, 4) == 'player:1' ? score1 += 2 : score2 += 2
                        } else if (GameService.grid.valeursSimilairesSeSuivent(verticalSequence, 3)) {
                            GameService.grid.valeursSimilairesSeSuivent(verticalSequence, 3) == 'player:1' ? score1 += 1 : score2 += 1
                        }
                    }
                    // Nombre de point
                    if (GameService.grid.checkCellOwner(grid[i][j]) == 'player:1') {
                        pawns1--
                    } else if (GameService.grid.checkCellOwner(grid[i][j]) == 'player:2') {
                        pawns2--
                    }
                }
            }

            // Diagonale bas-gauche à haut-droite
            for (let k = rows - 1; k >= 0; k--) {
                const diagonalSequence = [];
                for (let i = k, j = 0; i >= 0 && j < columns; i--, j++) {
                    diagonalSequence.push(grid[i][j]);
                }
                if (diagonalSequence.length > 0) {
                    if (GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 5)) {
                        winner = GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 5)
                    } else if (GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 4)) {
                        GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 4) == 'player:1' ? score1 += 2 : score2 += 2
                    } else if (GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 3)) {
                        GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 3) == 'player:1' ? score1 += 1 : score2 += 1
                    }
                }
            }

            // Diagonale bas-gauche à haut-droite (sans la diagonale principale)
            for (let k = 1; k < columns; k++) {
                const diagonalSequence = [];
                for (let i = rows - 1, j = k; i >= 0 && j < columns; i--, j++) {
                    diagonalSequence.push(grid[i][j]);
                    if (diagonalSequence.length > 0) {
                        if (GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 5)) {
                            winner = GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 5)
                        } else if (GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 4)) {
                            GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 4) == 'player:1' ? score1 += 2 : score2 += 2
                        } else if (GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 3)) {
                            GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 3) == 'player:1' ? score1 += 1 : score2 += 1
                        }
                    }
                }
            }

            // Diagonales haut-gauche à bas-droite
            for (let k = 0; k < columns; k++) {
                const diagonalSequence = [];
                for (let i = 0, j = k; i < rows && j < columns; i++, j++) {
                    diagonalSequence.push(grid[i][j]);
                }
                if (diagonalSequence.length > 0) {
                    if (GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 5)) {
                        winner = GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 5)
                    } else if (GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 4)) {
                        GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 4) == 'player:1' ? score1 += 2 : score2 += 2
                    } else if (GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 3)) {
                        GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 3) == 'player:1' ? score1 += 1 : score2 += 1
                    }
                }
            }

            // Diagonales haut-gauche à bas-droite (sans la diagonale principale)
            for (let k = 1; k < rows; k++) {
                const diagonalSequence = [];
                for (let i = k, j = 0; i < rows && j < columns; i++, j++) {
                    diagonalSequence.push(grid[i][j]);
                }
                if (diagonalSequence.length > 0) {
                    if (GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 5)) {
                        winner = GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 5)
                    } else if (GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 4)) {
                        GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 4) == 'player:1' ? score1 += 2 : score2 += 2
                    } else if (GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 3)) {
                        GameService.grid.valeursSimilairesSeSuivent(diagonalSequence, 3) == 'player:1' ? score1 += 1 : score2 += 1
                    }
                }
            }

            if (pawns1 == 0 || pawns2 == 0) {
                if (score1 > score2) {
                    winner == 'player:1'
                } else if (score1 > score2) {
                    winner == 'player:2'
                } else {
                    winner = 'tie'
                }
            }

            return { score1, score2, pawns1, pawns2, winner }
        }
    },
    utils: {
        // Return game index in global games array by id
        findGameIndexById: (games, idGame) => {
            for (let i = 0; i < games.length; i++) {
                if (games[i].idGame === idGame) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },

        findGameIndexBySocketId: (games, socketId) => {
            for (let i = 0; i < games.length; i++) {
                if (games[i].player1Socket.id === socketId || games[i].player2Socket.id === socketId) {
                    return i; // Retourne l'index du jeu si le socket est trouvé
                }
            }
            return -1;
        },

        findDiceIndexByDiceId: (dices, idDice) => {
            for (let i = 0; i < dices.length; i++) {
                if (dices[i].id === idDice) {
                    return i; // Retourne l'index du dé si l'id du dé est trouvé
                }
            }
            return -1;
        },
    }
}

module.exports = GameService;