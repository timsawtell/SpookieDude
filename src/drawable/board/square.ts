import { Drawable } from "../drawable";

export type SquareContents = "player" | "scenery" | "ghost" | "blank"

export class Square extends Drawable {

    width: number
    contents: SquareContents

    constructor(row: number, column: number, width: number) {
        super()
        this.boardVector.y = row
        this.boardVector.x = column
        this.width = this.height = width
        this.contents = "blank"
    }

    draw(context: CanvasRenderingContext2D) {
        super.draw(context)

        //draw your own border
        context.save()
        context.beginPath()
        context.strokeStyle = "black"
        context.lineWidth = 1
        context.moveTo(this.canvasVector.x, this.canvasVector.y)
        context.lineTo(this.canvasVector.x + this.width, this.canvasVector.y)
        context.lineTo(this.canvasVector.x + this.width, this.canvasVector.y + this.width)
        context.lineTo(this.canvasVector.x, this.canvasVector.y + this.width)
        context.lineTo(this.canvasVector.x, this.canvasVector.y)
        context.stroke();
        context.font = "18px Arial"
        // draw your contents
        switch (this.contents) {
            case "player":
                context.fillText("player", this.canvasVector.x, this.canvasVector.y + 10, this.width)
                break
            case "scenery": 
                context.fillText("scenery", this.canvasVector.x, this.canvasVector.y + 10, this.width)
                break
            case "ghost":
                context.fillText("ghost", this.canvasVector.x, this.canvasVector.y + 10, this.width)
                break
        }
        
        context.restore();
    }

}