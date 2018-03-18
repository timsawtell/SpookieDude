import { Drawable, Vector } from "../drawable"
import { Square } from "./square"
import { Player } from "../player/player"
import { Ghost } from "../ghost/ghost"

const squareWidth = 50
const sceneryPercent = 0.1

export enum Direction {
    "left",
    "right",
    "up",
    "down"
}

export class Board extends Drawable {

    squares: Square[][]
    width: number
    height: number
    player: Player
    ghost: Ghost
    playerSquare: Square
    ghostSquare: Square
    numberOfXSquares: number
    numberOfYSquares: number

    constructor(width: number, height: number, player: Player, ghost: Ghost) {
        super()
        this.width = width
        this.height = height
        this.numberOfXSquares = width / squareWidth
        this.numberOfYSquares = height / squareWidth

        this.squares = new Array()
        for (let yStep = 0; yStep < this.numberOfYSquares; yStep++) {
            this.squares[yStep] = new Array()
            for (let xStep = 0; xStep < this.numberOfXSquares; xStep++) {
                const square = new Square(yStep, xStep, squareWidth)
                square.canvasVector.x = xStep * squareWidth
                square.canvasVector.y = yStep * squareWidth
                const rando = Math.random()
                if (rando <= sceneryPercent) {
                    square.contents = "scenery"
                }
                this.squares[yStep][xStep] = square
            }
        }
        // Put the player on a random square
        this.setPlayerAtRandomSquare()
        // Put the ghost on a random square
        this.setGhostAtRandomSquare()
    }

    setPlayerAtRandomSquare() {
        
        let rando = Math.random()
        const columnForPlayer = Math.floor(this.numberOfXSquares * rando)
        rando = Math.random()
        const rowForPlayer = Math.floor(this.numberOfYSquares * rando)
        this.squares[rowForPlayer][columnForPlayer].contents = "player"
        this.playerSquare = this.squares[rowForPlayer][columnForPlayer]
    }

    setGhostAtRandomSquare() {
        let rando = Math.random()
        const columnForGhost = Math.floor(this.numberOfXSquares * rando)
        rando = Math.random()
        const rowForGhost = Math.floor(this.numberOfYSquares * rando)
        const ghostSquare = this.squares[rowForGhost][columnForGhost]
        if (ghostSquare.contents === "player") {
            this.setGhostAtRandomSquare()
            return
        }
        this.squares[rowForGhost][columnForGhost].contents = "ghost"
        this.ghostSquare = this.squares[rowForGhost][columnForGhost]
    }

    /**
     * Make the ghost move after the player. Doesn't work yet / isn't cooridinated yet by enginge
     */
    ghostHunt() {
        const destinationVector = this.playerSquare.boardVector
        const currentVector = this.ghostSquare.boardVector

        let nextVector = currentVector

        if (destinationVector.x > currentVector.x) {
            if (this.isValidXMove(nextVector.x + 1, this.ghostSquare)) {
                nextVector.x = nextVector.x + 1
            }
        }
    }

    movePlayer(direction: Direction): boolean {
        let intendedXDelta = 0
        let intendedYDelta = 0
        switch (direction) {
            case Direction.up: {
                intendedYDelta = -1
                break
            }
            case Direction.down: {
                intendedYDelta = 1
                break
            }
            case Direction.left: {
                intendedXDelta = -1
                break
            }
            case Direction.right: {
                intendedXDelta = 1
                break
            }
        }
        
        const oldPlayerSquare = this.playerSquare
        if (intendedXDelta !== 0 && this.isValidXMove(intendedXDelta, this.playerSquare)) {
            this.playerSquare = this.squares[oldPlayerSquare.boardVector.y][oldPlayerSquare.boardVector.x + intendedXDelta]
            this.playerSquare.contents = "player"
            oldPlayerSquare.contents = "blank"
        } else if (intendedYDelta !== 0 && this.isValidYMove(intendedYDelta, this.playerSquare)) {
            this.playerSquare = this.squares[oldPlayerSquare.boardVector.y + intendedYDelta][oldPlayerSquare.boardVector.x]
            this.playerSquare.contents = "player"
            oldPlayerSquare.contents = "blank"
        } else {
            return false
        }
        return true
    }

    isValidXMove(intendedXDelta: number, squareInQuestion: Square): boolean {
        const intendedX = this.playerSquare.boardVector.x + intendedXDelta
        if (intendedX < 0) {
            return false
        }
        if (intendedX > this.numberOfXSquares) {
            return false
        }
        if (this.squares[this.playerSquare.boardVector.y][intendedX].contents !== "blank") {
            return false
        }
        return true
    }

    isValidYMove(intendedYDelta: number, squareInQuestion: Square): boolean {
        const intendedY = this.playerSquare.boardVector.y + intendedYDelta
        if (intendedY < 0) {
            return false
        }
        if (intendedY > this.numberOfYSquares) {
            return false
        }
        if (this.squares[intendedY][this.playerSquare.boardVector.x].contents !== "blank") {
            return false
        }
        return true
    }

    draw(context: CanvasRenderingContext2D) {
        const numberOfXSquares = this.width / squareWidth
        const numberOfYSquares = this.height / squareWidth
        for (let yStep = 0; yStep < numberOfYSquares; yStep++) {
            for (let xStep = 0; xStep < numberOfXSquares; xStep++) {
                this.squares[yStep][xStep].draw(context)
            }
        }
    }
}