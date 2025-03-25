document.addEventListener("DOMContentLoaded", () => {
    const selectionScreen = document.getElementById("selection-screen");
    const gameScreen = document.getElementById("game-screen");
    const onePlayerBtn = document.getElementById("one-player");
    const twoPlayerBtn = document.getElementById("two-player");
    const difficultyDiv = document.getElementById("difficulty");
    const chooseX = document.getElementById("choose-x");
    const chooseO = document.getElementById("choose-o");
    const restartBtn = document.getElementById("restart");
    const backBtn = document.getElementById("back");
    const cells = document.querySelectorAll(".cell");
    const statusText = document.querySelector(".status");
    
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let opponent = "O";
    let gameMode = "two-player";
    let isGameActive = true;
    let previousPlayer = "X";
    let previousOpponent = "O";
    
    function highlightButton(button) {
        button.classList.add("selected");
    }
    
    function removeHighlights() {
        document.querySelectorAll("button").forEach(btn => btn.classList.remove("selected"));
    }
    
    onePlayerBtn.addEventListener("click", () => {
        gameMode = "one-player";
        difficultyDiv.classList.remove("hidden");
        removeHighlights();
        highlightButton(onePlayerBtn);
    });

    twoPlayerBtn.addEventListener("click", () => {
        gameMode = "two-player";
        selectionScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        removeHighlights();
        highlightButton(twoPlayerBtn);
    });

    chooseX.addEventListener("click", () => {
        startGame("X", "O");
        removeHighlights();
        highlightButton(chooseX);
    });
    
    chooseO.addEventListener("click", () => {
        startGame("O", "X");
        removeHighlights();
        highlightButton(chooseO);
    });

    function startGame(player, comp) {
        currentPlayer = player;
        opponent = comp;
        previousPlayer = player;
        previousOpponent = comp;
        selectionScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (!isGameActive || cell.textContent !== "") return;
            removeHighlights();
            cell.textContent = currentPlayer;
            board[cell.dataset.index] = currentPlayer;
            if (!checkWinner()) {
                if (gameMode === "one-player" && isGameActive) {
                    setTimeout(computerMove, 500);
                } else {
                    currentPlayer = currentPlayer === "X" ? "O" : "X";
                    statusText.textContent = `Player ${currentPlayer}'s turn`;
                }
            }
        });
    });

    function computerMove() {
        let availableCells = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
        if (availableCells.length > 0) {
            let move = availableCells[Math.floor(Math.random() * availableCells.length)];
            board[move] = opponent;
            cells[move].textContent = opponent;
            checkWinner();
        }
    }

    function checkWinner() {
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        for (let condition of winningConditions) {
            let [a, b, c] = condition;
            if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
                isGameActive = false;
                statusText.textContent = board[a] === previousPlayer ? `Player ${board[a]} Wins!` : `Player ${board[a]} Wins!`;
                return true;
            }
        }
        
        if (!board.includes("")) {
            statusText.textContent = "It's a Draw!";
            isGameActive = false;
            return true;
        }
        return false;
    }

    restartBtn.addEventListener("click", resetGame);
    backBtn.addEventListener("click", () => {
        gameScreen.classList.add("hidden");
        selectionScreen.classList.remove("hidden");
        resetGame(true);
    });
    
    function resetGame(keepSettings = false) {
        highlightButton(restartBtn);
        board = ["", "", "", "", "", "", "", "", ""];
        cells.forEach(cell => cell.textContent = "");
        isGameActive = true;
        if (!keepSettings) {
            currentPlayer = "X";
            opponent = "O";
        } else {
            currentPlayer = previousPlayer;
            opponent = previousOpponent;
        }
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
});
