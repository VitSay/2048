// 2048 Game

const BOARD_WIDTH = 4
const BOARD_HEIGHT = 4
const INIT_NUMBER_OF_FILLED_CELLS = 2
const NUMBER_OF_RANDOMLY_ADDED_CELLS = 1
const MAX_SCORE = 2048

class Cell {
    constructor() {
        this.value = 0
    }

    randomiseValue() {
        this.value = Math.random() < 0.5 ? 2 : 4
    }

    canMergeWith(other)
    {
        return this.value === other.value
    }

    mergeWith(other)
    {
        if (this.canMergeWith(other))
            {
                this.value += other.value
            }
    }
}

class Game2048{
    constructor(board_width, board_height, max_score, init_filled_count, randomly_add_num) {
        this.width = board_width
        this.height = board_height
        this.max_score = max_score
        this.init_filled_count = init_filled_count
        this.randomly_add_count = randomly_add_num
        this.board = this.createBoard()

        this.current_score = this.getBoardScore()
        this.best_score = localStorage.getItem('best_score') || 0

        this.displayBoard()
    }

    createBoard() {
        const playingFieldEl = document.getElementById('game-field')
        playingFieldEl.style.display = 'grid'
        playingFieldEl.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`
        playingFieldEl.style.gridTemplateRows = `repeat(${this.height}, 1fr)`
        playingFieldEl.style.gap = '15px'
        let board = Array.from({length: this.height}, () => new Array(this.width).fill(null).map(() => new Cell()))
        for (let i=0; i<this.init_filled_count;++i)
            {
                let obj = this.getRandomCellPosition(board)
                board[obj.row][obj.col].randomiseValue()
            }
        return board
    }

    getRandomCellPosition(board)
    {
        let flat_board = board.flat()
        let free_indises = new Array()
        for (let i =0; i < flat_board.length;++i)
            {
                if (flat_board[i].value === 0)
                    free_indises.push(i)
            }
        if (free_indises.length === 0)
            {
                alert('Вы проиграли! Игра начнется заново')
                this.restartGame()
                return 
            }
        let rand_indx = free_indises[Math.floor(Math.random() * free_indises.length)]
        return {row: Math.floor(rand_indx / board[0].length), col: rand_indx % board.length}
    }

    restartGame()
    {
        this.board = this.createBoard()
        this.current_score = this.getBoardScore()
        this.best_score = localStorage.getItem('best_score') || 0
        this.displayBoard()
    }

    getBoardScore(){
        const flat_arr = this.board.flat()
        const value_sum = flat_arr.reduce((accumulator, cell) => {return accumulator + cell.value}, 0)
        return value_sum
    }

    updateBoardScore(){
        this.current_score = this.getBoardScore()
        if (this.current_score > this.best_score)
            {
                this.best_score = this.current_score
                localStorage.setItem('best_score', this.current_score)
            }
        const current_score_el = document.getElementById('current-score')
        const best_score_el = document.getElementById('best-score')
        best_score_el.textContent = `Best: ${this.best_score}`
        current_score_el.textContent = `Score: ${this.current_score}`
    }

    displayBoard()
    {
        const playingFieldEl = document.getElementById('game-field')
        playingFieldEl.innerHTML = ''
        this.board.forEach(row => {
            row.forEach(cell => {
                let cellEl = document.createElement('div')
                cellEl.classList.add('cell')
                if (cell.value !== 0)
                    {
                        cellEl.classList.add(`cell-${cell.value}`)
                        cellEl.textContent = cell.value
                    }
                playingFieldEl.appendChild(cellEl)
            })
        })
        this.updateBoardScore()
    }

    slideRowLeft(row) {
        const newRow = row.filter(cell => cell.value !== 0);
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i].canMergeWith(newRow[i + 1])) {
                newRow[i].mergeWith(newRow[i + 1]);
                newRow.splice(i + 1, 1);
                //newRow.push(new Cell());
            }
        }
        return newRow.concat(Array(this.width - newRow.length).fill(null).map(()=>new Cell()));
    }

    rotateGridRight() {
        const newBoard = Array.from({length: this.width}, () => new Array(this.height).fill(null).map(() => new Cell()))
        for (let row = 0; row < this.height; ++row) {
            for (let col = 0; col < this.width; ++col) {
                newBoard[col][this.height - 1 - row] = this.board[row][col];
            }
        }
        this.board = newBoard;
        let temp = this.width
        this.width = this.height
        this.height = temp
    }

    move(direction) {
        if (direction === 'left') {
            for (let row = 0; row < this.height; row++) {
                this.board[row] = this.slideRowLeft(this.board[row]);
            }
        } else if (direction === 'right') {
            this.rotateGridRight();
            this.rotateGridRight();
            for (let row = 0; row < this.height; row++) {
                this.board[row] = this.slideRowLeft(this.board[row]);
            }
            this.rotateGridRight();
            this.rotateGridRight();
        } else if (direction === 'up') {
            this.rotateGridRight();
            this.rotateGridRight();
            this.rotateGridRight();
            for (let row = 0; row < this.height; row++) {
                this.board[row] = this.slideRowLeft(this.board[row]);
            }
            this.rotateGridRight();
        } else if (direction === 'down') {
            this.rotateGridRight();
            for (let row = 0; row < this.height; row++) {
                this.board[row] = this.slideRowLeft(this.board[row]);
            }
            this.rotateGridRight();
            this.rotateGridRight();
            this.rotateGridRight();
        }
        for (let i=0; i < this.randomly_add_count; ++i)
            {
                let obj = this.getRandomCellPosition(this.board)
                this.board[obj.row][obj.col].randomiseValue()
            }
        this.updateBoardScore()
        this.displayBoard()
    }
}

const game = new Game2048(BOARD_WIDTH, BOARD_HEIGHT, MAX_SCORE, INIT_NUMBER_OF_FILLED_CELLS, NUMBER_OF_RANDOMLY_ADDED_CELLS)

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

document.getElementById('reset-button').addEventListener('click', ()=> game.restartGame())
