import { Drawable, Vector } from "../drawable"
import { Square, SquareContents } from "./square"
import { Player } from "../player/player"
import { Ghost } from "../ghost/ghost"
import { travelCost } from "../../common/pathFinding"

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
    gameOver: boolean

    constructor(width: number, height: number, player: Player, ghost: Ghost) {
        super()
        this.width = width
        this.height = height
        this.player = player
        this.ghost = ghost
        this.numberOfXSquares = width / squareWidth
        this.numberOfYSquares = height / squareWidth
        this.gameOver = false

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
            this.ghost.hunt(this, this.player)
        /*
        const destinationVector = this.playerSquare.boardVector
        const currentVector = this.ghostSquare.boardVector

        let nextVector: Vector = {
            x: currentVector.x,
            y: currentVector.y
        }

        if (destinationVector.x > currentVector.x) {
            if (this.isValidXMove(1, this.ghostSquare)) {
                nextVector.x = nextVector.x + 1
            }
        } else if (destinationVector.x < currentVector.x) {
            if (this.isValidXMove(- 1, this.ghostSquare)) {
                nextVector.x = nextVector.x - 1
            }
        } else if (destinationVector.y > currentVector.y) {
            if (this.isValidYMove(1, this.ghostSquare)) {
                nextVector.y = nextVector.y + 1
            }
        } else if (destinationVector.y < currentVector.y) {
            if (this.isValidYMove(- 1, this.ghostSquare)) {
                nextVector.y = nextVector.y - 1
            }
        }

        if (nextVector.x !== currentVector.x || nextVector.y !== currentVector.y) {
            const oldGhostSquare = this.ghostSquare
            this.ghostSquare = this.squares[nextVector.y][nextVector.x]
            this.ghostSquare.contents = "ghost"
            oldGhostSquare.contents = "blank"
        }
        */
    }

    moveGhost(square: Square) {
        if (square.contents === "player") {
            this.gameOver = true
            square.isRed = true
        }
        const oldGhostSquare = this.ghostSquare
        this.ghostSquare = square
        this.ghostSquare.contents = "ghost"
        oldGhostSquare.contents = "blank"
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
        const intendedX = squareInQuestion.boardVector.x + intendedXDelta
        if (intendedX < 0) {
            return false
        }
        if (intendedX > this.numberOfXSquares) {
            return false
        }
        if (this.squares[squareInQuestion.boardVector.y][intendedX].contents !== "blank") {
            return false
        }
        return true
    }

    isValidYMove(intendedYDelta: number, squareInQuestion: Square): boolean {
        const intendedY = squareInQuestion.boardVector.y + intendedYDelta
        if (intendedY < 0) {
            return false
        }
        if (intendedY > this.numberOfYSquares) {
            return false
        }
        
        if (this.squares[intendedY][squareInQuestion.boardVector.x].contents !== "blank") {
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

    neighbors(square: Square) {
        let neighbors: Square[] = new Array()
        const north = square.boardVector.y > 0 ? this.squares[square.boardVector.y - 1][square.boardVector.x] : null
        const south = square.boardVector.y < this.numberOfYSquares - 1 ? this.squares[square.boardVector.y + 1][square.boardVector.x] : null
        const east = square.boardVector.x < this.numberOfXSquares - 1 ? this.squares[square.boardVector.y][square.boardVector.x + 1] : null
        const west = square.boardVector.x > 0 ? this.squares[square.boardVector.y][square.boardVector.x - 1] : null
        if (north && north.contents !== "scenery") {
            neighbors.push(north)
        }
        if (south && south.contents !== "scenery") {
            neighbors.push(south)
        }
        if (east && east.contents !== "scenery") {
            neighbors.push(east)
        }
        if (west && west.contents !== "scenery") {
            neighbors.push(west)
        }
        return neighbors
    }

    hCostForSquare(start: Square, end: Square) {
        const xCost = Math.abs(start.boardVector.x - end.boardVector.x)
        const yCost = Math.abs(start.boardVector.y - end.boardVector.y)
        return (xCost * travelCost) + (yCost * travelCost)
    }
}