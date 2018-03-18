
export interface Vector {
    x: number,
    y: number
}

export abstract class Drawable {

    // row and column of the board
    boardVector: Vector
    // x and y in the canvas space
    canvasVector: Vector
    width: number
    height: number

    constructor() {
        this.boardVector = {x: 0, y:0}
        this.canvasVector = {x: 0, y:0}
    }

    draw(context: CanvasRenderingContext2D) {
        this.clear(context)
        // override for custom drawing, remember to call super
    }

    clear(context: CanvasRenderingContext2D) {
        context.clearRect(this.canvasVector.x, this.canvasVector.y, this.width, this.height);
    }
}