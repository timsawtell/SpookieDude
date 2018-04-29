import { Drawable } from "../drawable"
import { Player } from "../player/player"
import { Board } from "../board/board"
import { Square } from "../board/square";
import { travelCost } from "../../common/pathFinding"

export class Ghost extends Drawable {

    hunt(board: Board, player: Player) {
        const startSquare = board.ghostSquare
        const endSquare = board.playerSquare
        const neighbors = board.neighbors(startSquare)
        neighbors.forEach((square) => {
            square.pathFindingData.gCost = travelCost
            square.pathFindingData.hCost = board.hCostForSquare(square, endSquare)
            square.pathFindingData.fCost = square.pathFindingData.gCost + square.pathFindingData.hCost
        })
        neighbors.sort((aSquare, bSquare) => {
            return aSquare.pathFindingData.fCost - bSquare.pathFindingData.fCost
        })
        // reset their pathfinding data since it's not needed this iteration
        neighbors.forEach((square) => {
            square.resetPathfinding()
        })
        if (neighbors.length > 0) {
            const nextSquare = neighbors[0]
            board.moveGhost(nextSquare)
        }
    }
}