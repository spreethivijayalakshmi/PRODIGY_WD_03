const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
let currentPlayer = 'X';
let gameState = Array(9).fill('');

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', restartGame);

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');
    
    if (gameState[index] !== '' || checkWinner()) {
        return;
    }
    
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    
    if (checkWinner()) {
        setTimeout(() => alert(`${currentPlayer} has won!`), 100);
    } else if (gameState.every(cell => cell !== '')) {
        setTimeout(() => alert('It\'s a draw!'), 100);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === 'O') {
            bestMove();
            currentPlayer = 'X';
        }
    }
}

function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    gameState[move] = 'O';
    cells[move].textContent = 'O';
    if (checkWinner()) {
        setTimeout(() => alert('O has won!'), 100);
    } else if (gameState.every(cell => cell !== '')) {
        setTimeout(() => alert('It\'s a draw!'), 100);
    }
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        if (result === 'X') return -10;
        else if (result === 'O') return 10;
        else return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    let winner = null;
    winningConditions.forEach(condition => {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            winner = gameState[a];
        }
    });
    if (winner === null && gameState.every(cell => cell !== '')) {
        return 'Draw';
    }
    return winner;
}

function restartGame() {
    gameState.fill('');
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
    });
}
