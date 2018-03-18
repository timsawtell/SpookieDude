import { Player } from "../drawable/player/player"
import { Board, Direction } from "../drawable/board/board"
import { Ghost } from "../drawable/ghost/ghost"

export class Engine {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    player: Player
    ghost: Ghost
    board: Board

    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement
        this.context = this.canvas.getContext("2d")

        this.player = new Player()
        this.ghost = new Ghost()

        this.board = new Board(this.canvas.width, this.canvas.height, this.player, this.ghost)
        this.board.canvasVector.x = this.board.canvasVector.y = 0

        this.runLoop()
        this.check = this.check.bind(this)
    }

    runLoop() {
        
        this.board.draw(this.context)
        
    }

    check(e: KeyboardEvent) {
        let direction: Direction
        var code = e.keyCode;
        switch (code) {
            case 37: {
                direction = Direction.left
                break
            }
            case 38: {
                direction = Direction.up
                break
            }
            case 39: {
                direction = Direction.right
                break
            }
            case 40: {
                direction = Direction.down
                break
            }
            default: break
        }
        if (this.board.movePlayer(direction)) {
            this.runLoop()
        }
    }

}

window.onload = () => {
    const engine = new Engine()
    window.addEventListener('keydown', engine.check, false)
}

