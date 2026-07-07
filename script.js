// ===== Game State Variables =====
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

// Scoreboard counters (reset only on page refresh)
let scores = {
  X: 0,
  O: 0,
  Draw: 0
};

// All possible winning combinations (rows, columns, diagonals)
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// ===== DOM Elements =====
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("statusText");
const restartBtn = document.getElementById("restartBtn");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDrawEl = document.getElementById("scoreDraw");

// ===== Sound Effects (using freely available audio URLs) =====
const clickSound = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flick.ogg");
const winSound = new Audio("https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg");
const drawSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");

// ===== Initialize Game =====
function initGame() {
  cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
  });
  restartBtn.addEventListener("click", restartGame);
  updateStatusText();
}

// ===== Handle Cell Click =====
function handleCellClick(event) {
  const cell = event.target;
  const index = parseInt(cell.getAttribute("data-index"));

  // Prevent clicking if cell is filled or game has ended
  if (board[index] !== "" || !gameActive) {
    return;
  }

  placeMark(cell, index);
  checkGameResult();
}

// ===== Place Player's Mark =====
function placeMark(cell, index) {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.classList.add("disabled");

  playSound(clickSound);
}

// ===== Switch Turn Between Players =====
function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatusText();
}

// ===== Update Status Text (Turn Display) =====
function updateStatusText() {
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

// ===== Check for Win or Draw =====
function checkGameResult() {
  let roundWon = false;
  let winningCells = [];

  // Loop through all winning combinations
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      winningCells = combination;
      break;
    }
  }

  if (roundWon) {
    handleWin(winningCells);
    return;
  }

  // Check for draw (all cells filled, no winner)
  if (!board.includes("")) {
    handleDraw();
    return;
  }

  // No win or draw yet, continue game
  switchPlayer();
}

// ===== Handle Win Scenario =====
function handleWin(winningCells) {
  gameActive = false;
  statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;

  // Highlight winning cells with animation
  winningCells.forEach(index => {
    cells[index].classList.add("winning-cell");
  });

  // Update scoreboard
  scores[currentPlayer]++;
  updateScoreboard();

  playSound(winSound);
  lockBoard();
}

// ===== Handle Draw Scenario =====
function handleDraw() {
  gameActive = false;
  statusText.textContent = "It's a Draw! 🤝";

  scores.Draw++;
  updateScoreboard();

  playSound(drawSound);
}

// ===== Update Scoreboard Display =====
function updateScoreboard() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDrawEl.textContent = scores.Draw;
}

// ===== Lock Board (Prevent Further Clicks After Win) =====
function lockBoard() {
  cells.forEach(cell => cell.classList.add("disabled"));
}

// ===== Play Sound Helper =====
function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {
    // Silently ignore autoplay restrictions/errors
  });
}

// ===== Restart Game (Reset Board Only, Not Scoreboard) =====
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("x", "o", "disabled", "winning-cell");
  });

  updateStatusText();
}

// ===== Start the Game =====
initGame();