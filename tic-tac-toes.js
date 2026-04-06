// --- Elements ---
const statusElement = document.getElementById('status');
const xWinElement = document.getElementById('x-wins');
const oWinElement = document.getElementById('o-wins');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restartBtn');
const overlay = document.getElementById('game-overlay');
const winnerText = document.getElementById('winner-text');
const nextRoundBtn = document.getElementById('nextRoundBtn');

// Theme Elements
const toggleSwitch = document.querySelector('#checkbox');
const themeIcon = document.getElementById('theme-icon');
const iconBox = document.querySelector('.icon-box');

// --- Game State ---
let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let xWins = 0;
let oWins = 0;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// --- Core Logic ---

function shuffleSymbol() {
    currentPlayer = Math.random() > 0.5 ? 'X' : 'O';
    updateStatusDisplay();
}

function updateStatusDisplay() {
    statusElement.innerText = `Player ${currentPlayer}'s Turn`;
    statusElement.style.color = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
}

function handleCellClick(e) {
    const clickedCell = e.target;
    const index = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[index] !== "" || !gameActive) return;

    gameState[index] = currentPlayer;
    clickedCell.innerText = currentPlayer;
    clickedCell.classList.add(currentPlayer === 'X' ? 'x-color' : 'o-color');
    
    checkResult();
}

function checkResult() {
    let roundWon = false;
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true; 
            break;
        }
    }

    if (roundWon) {
        currentPlayer === 'X' ? xWins++ : oWins++;
        xWinElement.innerText = xWins;
        oWinElement.innerText = oWins;
        showOverlay(`🎉 Player ${currentPlayer} Wins!`);
        return;
    }

    if (!gameState.includes("")) {
        showOverlay("🤝 It's a Draw!");
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatusDisplay();
}

function showOverlay(message) {
    gameActive = false;
    winnerText.innerText = message;
    overlay.classList.remove('hidden');
}

function resetBoard() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x-color', 'o-color');
    });
    overlay.classList.add('hidden');
    shuffleSymbol();
}

// --- Theme Toggle Logic ---

function switchTheme(e) {
    // Animation trigger
    iconBox.classList.add('rotate-icon');
    setTimeout(() => iconBox.classList.remove('rotate-icon'), 500);

    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.innerText = "☀️";
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.innerText = "🌙";
    }
    // Color update for turn text
    updateStatusDisplay();
}

// --- Event Listeners ---

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

nextRoundBtn.addEventListener('click', resetBoard);

restartBtn.addEventListener('click', () => {
    xWins = 0; 
    oWins = 0;
    xWinElement.innerText = 0;
    oWinElement.innerText = 0;
    resetBoard();
});

toggleSwitch.addEventListener('change', switchTheme, false);

// Initialize Game
shuffleSymbol();