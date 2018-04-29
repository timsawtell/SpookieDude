import { Drawable } from "../drawable"

export type SquareContents = "player" | "scenery" | "ghost" | "blank"

interface PathfindingData {
    gCost: number
    hCost: number
    fCost: number
}

export class Square extends Drawable {

    width: number
    contents: SquareContents
    pathFindingData: PathfindingData
    isRed: boolean

    constructor(row: number, column: number, width: number) {
        super()
        this.boardVector.y = row
        this.boardVector.x = column
        this.width = this.height = width
        this.contents = "blank"
        this.isRed = false
        this.resetPathfinding()
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
                const rockImg = new Image()
                rockImg.onload = () => {
                    context.drawImage(rockImg, this.canvasVector.x, this.canvasVector.y)
                }
                context.fillText("scenery", this.canvasVector.x, this.canvasVector.y + 10, this.width)
                break
            case "ghost":
                context.fillText("ghost", this.canvasVector.x, this.canvasVector.y + 10, this.width)
                break
        }
        if (this.isRed) {
            context.fillStyle = "red"
            context.fill()
        }
        
        context.restore();
    }

    resetPathfinding() {
        this.pathFindingData = {
            gCost: 0,
            hCost: 0,
            fCost: 0
        }
    }

}