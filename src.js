// 2048 Game

const BOARD_WIDTH = 4
const BOARD_HEIGHT = 4
const MAX_SCORE = 2048

class Cell {
    constructor() {
        this.value = Math.random() < 0.5 ? 2 : 4
    }
}

class Game2048{
    constructor(board_width, board_height, max_score) {
        this.width = board_width
        this.height = board_height
        this.max_score = max_score
        this.board = this.createBoard()
    }

    createBoard() {
        const playingFieldEl = document.getElementById('game-field')
        playingFieldEl.style.display = 'grid'
        playingFieldEl.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`
        playingFieldEl.style.gridTemplateRows = `repeat(${this.height}, 1fr)`
        playingFieldEl.style.gap = '15px'
        let board = Array.from({length: this.width}, () => new Array(this.height).fill(null).map(() => new Cell()))
        return board
    }

    displayBoard()
    {
        const playingFieldEl = document.getElementById('game-field')
        playingFieldEl.innerHTML = ''
        this.board.forEach(row => {
            row.forEach(cell => {
                let cellEl = document.createElement('div')
                cellEl.classList.add('cell')
                cellEl.classList.add(`cell-${cell.value}`)
                cellEl.textContent = cell.value
                playingFieldEl.appendChild(cellEl)
            })
        })
    }

}

const game = new Game2048(BOARD_WIDTH, BOARD_HEIGHT, MAX_SCORE)
game.board[0][0].value = 2
game.displayBoard()
