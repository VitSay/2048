class Tile {
    constructor(value = 2) {
        this.value = value;
        this.merged = false; // Track if tile has merged in the current move
    }

    canMergeWith(other) {
        return !this.merged && !other.merged && this.value === other.value;
    }

    mergeWith(other) {
        if (this.canMergeWith(other)) {
            this.value += other.value;
            this.merged = true;
            return this.value;
        }
        return 0;
    }
}

class Game2048 {
    constructor(size = 4) {
        this.size = size;
        this.grid = this.createGrid();
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore') || 0;
        this.addRandomTile();
        this.addRandomTile();
    }

    createGrid() {
        return Array.from({ length: this.size }, () => Array.from({ length: this.size }, () => null));
    }

    addRandomTile() {
        const emptyPositions = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (!this.grid[row][col]) {
                    emptyPositions.push({ row, col });
                }
            }
        }
        if (emptyPositions.length > 0) {
            const { row, col } = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
            this.grid[row][col] = new Tile();
        }
    }

    slideRowLeft(row) {
        const newRow = row.filter(tile => tile !== null);
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i].canMergeWith(newRow[i + 1])) {
                this.score += newRow[i].mergeWith(newRow[i + 1]);
                newRow.splice(i + 1, 1);
                newRow.push(null);
            }
        }
        return newRow.concat(Array(this.size - newRow.length).fill(null));
    }

    rotateGridRight() {
        const newGrid = this.createGrid();
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                newGrid[col][this.size - 1 - row] = this.grid[row][col];
            }
        }
        this.grid = newGrid;
    }

    move(direction) {
        for (let row of this.grid) {
            for (let tile of row) {
                if (tile) {
                    tile.merged = false;
                }
            }
        }
        if (direction === 'left') {
            for (let row = 0; row < this.size; row++) {
                this.grid[row] = this.slideRowLeft(this.grid[row]);
            }
        } else if (direction === 'right') {
            this.rotateGridRight();
            this.rotateGridRight();
            for (let row = 0; row < this.size; row++) {
                this.grid[row] = this.slideRowLeft(this.grid[row]);
            }
            this.rotateGridRight();
            this.rotateGridRight();
        } else if (direction === 'up') {
            this.rotateGridRight();
            this.rotateGridRight();
            this.rotateGridRight();
            for (let row = 0; row < this.size; row++) {
                this.grid[row] = this.slideRowLeft(this.grid[row]);
            }
            this.rotateGridRight();
        } else if (direction === 'down') {
            this.rotateGridRight();
            for (let row = 0; row < this.size; row++) {
                this.grid[row] = this.slideRowLeft(this.grid[row]);
            }
            this.rotateGridRight();
            this.rotateGridRight();
            this.rotateGridRight();
        }
        this.addRandomTile();
        this.updateBestScore();
        this.updateDisplay();
    }

    updateBestScore() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
        }
    }

    updateDisplay() {
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = '';
        for (let row of this.grid) {
            for (let tile of row) {
                const tileElement = document.createElement('div');
                tileElement.classList.add('tile');
                if (tile) {
                    tileElement.textContent = tile.value;
                    tileElement.classList.add(`tile-${tile.value}`);
                }
                gameContainer.appendChild(tileElement);
            }
        }
        document.getElementById('current-score').textContent = `Score: ${this.score}`;
        document.getElementById('best-score').textContent = `Best: ${this.bestScore}`;
    }

    resetGame() {
        this.grid = this.createGrid();
        this.score = 0;
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
    }
}

// Initialize the game
const game = new Game2048();
game.updateDisplay();

// Add event listeners for controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        game.move('left');
    } else if (event.key === 'ArrowRight') {
        game.move('right');
    } else if (event.key === 'ArrowUp') {
        game.move('up');
    } else if (event.key === 'ArrowDown') {
        game.move('down');
    }
});

document.getElementById('reset-button').addEventListener('click', () => {
    game.resetGame();
});