let fields = [
  "empty",
  "empty",
  "empty",
  "empty",
  "empty",
  "empty",
  "empty",
  "empty",
  "empty",
];

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let currentPlayer = "circle";
let winner = "";
let noWinner = "";
getItem();

function init() {
  render();
}

function showPlayersTurn() {
  if (currentPlayer === "circle") {
    document.getElementById("show-player").innerHTML =
      'Current Player is <span class="currentPlayer" style="color: #8CABFF;">CIRCLE</span>';
  }
  if (currentPlayer === "cross") {
    document.getElementById("show-player").innerHTML =
      'Current Player is <span class="currentPlayer" style="color: #FFC000;">CROSS</span>';
  }

  if (getWinningCombination()) {
    if (winner === "circle") {
      document.getElementById("show-player").innerHTML =
        'The Winner is: <span class="currentPlayer" style="color: #8CABFF;">CIRCLE</span>';
    }

    if (winner === "cross") {
      document.getElementById("show-player").innerHTML =
        'The Winner is: <span class="currentPlayer" style="color: #FFC000;">CROSS</span>';
    }
  }

  if (noWinner) {
    document.getElementById("show-player").innerHTML = noWinner;
  }
}

function render() {
  showPlayersTurn();

  const container = document.getElementById("content");

  let tableHTML = "<table>";

  for (let i = 0; i < 3; i++) {
    tableHTML += "<tr>";
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let symbol = "";
      if (fields[index] === "circle") {
        symbol = generateCircleSVG();
      } else if (fields[index] === "cross") {
        symbol = generateCrossSVG();
      }
      tableHTML += `<td id="td" onclick="handleClick(this, ${index})">${symbol}</td>`;
    }
    tableHTML += "</tr>";
  }

  tableHTML += "</table>";
  container.innerHTML = tableHTML;

  isGameFinished();
}

function handleClick(cell, index) {
  if (fields[index] === "empty") {
    fields[index] = currentPlayer;
    cell.innerHTML =
      currentPlayer === "circle" ? generateCircleSVG() : generateCrossSVG();
    winner = currentPlayer;
    setItemWinner();
    setItemField(index, currentPlayer);
    cell.onclick = null;
    currentPlayer = currentPlayer === "circle" ? "cross" : "circle";

    isGameEnded();

    isGameFinished();
  }

  showPlayersTurn();
  setItemCurrentPlayer();
}

function generateCircleSVG() {
  const color = "#00B0EF";
  const width = 70;
  const height = 70;
  return `<svg width="${width}" height="${height}">
            <circle cx="35" cy="35" r="30" stroke="#00B0EF" stroke-width="5" fill="none">
              <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.2s" fill="freeze" />
            </circle>
          </svg>`;
}

function generateCrossSVG() {
  const color = "#FFC000";
  const width = 70;
  const height = 70;

  const svgHtml = `
    <svg width="${width}" height="${height}">
      <line x1="0" y1="0" x2="${width}" y2="${height}"
        stroke="${color}" stroke-width="5">
        <animate attributeName="x2" values="0; ${width}" dur="200ms" />
        <animate attributeName="y2" values="0; ${height}" dur="200ms" />
      </line>
      <line x1="${width}" y1="0" x2="0" y2="${height}"
        stroke="${color}" stroke-width="5">
        <animate attributeName="x2" values="${width}; 0" dur="200ms" />
        <animate attributeName="y2" values="0; ${height}" dur="200ms" />
      </line>
    </svg>`;

  return svgHtml;
}

function isGameFinished() {
  if (isGameFinishedRequest()) {
    const winCombination = getWinningCombination();
    drawWinningLine(winCombination);
    fields = "";
  }
}

function isGameFinishedRequest() {
  return (
    fields.every((field) => field !== "empty") ||
    getWinningCombination() !== null
  );
}

function isGameEnded() {
  if (!fields.includes("empty")) {
    if (getWinningCombination() !== null) {
    } else {
      document.getElementById("show-player").innerHTML = "NO WINNER!";
      setItemNoWinner();
    }
  }
}

function getWinningCombination() {
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i];
    if (
      fields[a] === fields[b] &&
      fields[b] === fields[c] &&
      fields[a] !== "empty"
    ) {
      return WINNING_COMBINATIONS[i];
    }
  }
  return null;
}

function drawWinningLine(combination) {
  const lineColor = "#ffffff";
  const lineWidth = 5;

  const startCell = document.querySelectorAll(`td`)[combination[0]];
  const endCell = document.querySelectorAll(`td`)[combination[2]];
  const startRect = startCell.getBoundingClientRect();
  const endRect = endCell.getBoundingClientRect();

  const contentRect = document
    .getElementById("content")
    .getBoundingClientRect();

  const lineLength = Math.sqrt(
    Math.pow(endRect.left - startRect.left, 2) +
      Math.pow(endRect.top - startRect.top, 2)
  );
  const lineAngle = Math.atan2(
    endRect.top - startRect.top,
    endRect.left - startRect.left
  );

  const line = document.createElement("div");
  line.style.position = "absolute";
  line.style.width = `${lineLength}px`;
  line.style.height = `${lineWidth}px`;
  line.style.backgroundColor = lineColor;
  line.style.top = `${
    startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top
  }px`;
  line.style.left = `${
    startRect.left + startRect.width / 2 - contentRect.left
  }px`;
  line.style.transform = `rotate(${lineAngle}rad)`;
  line.style.transformOrigin = `top left`;
  document.getElementById("content").appendChild(line);
}

function restartGame() {
  localStorage.removeItem("noWinnerStorage");
  localStorage.removeItem("winnerStorage");
  localStorage.removeItem("currentPlayerStorage");

  fields = [
    "empty",
    "empty",
    "empty",
    "empty",
    "empty",
    "empty",
    "empty",
    "empty",
    "empty",
  ];
  for (let f = 0; f < fields.length; f++) {
    localStorage.removeItem(`fieldStorage${f}`);
  }

  currentPlayer = "circle";
  winner = "";
  noWinner = "";
  render();
}

/*-------------------------------------------------------------------------------------------------*/

function setItemWinner() {
  let winnerToText = winner;
  localStorage.setItem("winnerStorage", winnerToText);
}

function setItemNoWinner() {
  let noWinnerToText = document.getElementById("show-player").innerHTML;
  localStorage.setItem("noWinnerStorage", noWinnerToText);
}

function setItemCurrentPlayer() {
  let currentPlayerToText = currentPlayer;
  localStorage.setItem("currentPlayerStorage", currentPlayerToText);
}

function setItemField(position, player) {
  let fieldIndexToText = position;
  let playerToText = player;
  localStorage.setItem(`fieldStorage${fieldIndexToText}`, playerToText);
}

function getItem() {
  let winnerToArray = localStorage.getItem("winnerStorage");
  if (winnerToArray) {
    winner = winnerToArray;
  }

  let noWinnerToArray = localStorage.getItem("noWinnerStorage");
  if (noWinnerToArray) {
    noWinner = noWinnerToArray;
  }

  let currentPlayerToArray = localStorage.getItem("currentPlayerStorage");
  if (currentPlayerToArray) {
    currentPlayer = currentPlayerToArray;
  }

  for (let f = 0; f < fields.length; f++) {
    let fieldIndexToArray = localStorage.getItem(`fieldStorage${f}`);
    if (fieldIndexToArray) {
      fields[f] = fieldIndexToArray;
    }
  }

  isGameEnded();
}
