export type Position = [number, number]
export type Board = BoardRow[]
export type BoardRow = BoardSlot[]
export type BoardSlot = { type: PieceType | '', color: PieceColor | '' }

export type Moves = Position[]
export type Turn = 'w' | 'b'
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
export type PieceColor = 'w' | 'b'

export const findByPiece = (board: Board, piece: PieceType): Position[] => {
	const positions = [] as Position[]
	for (let x = 0; x < 8; x++) {
		for (let y = 0; y < 8; y++) {
			if (board[x][y].type === piece) {
				positions.push([x, y])
			}
		}
	}
	return positions
}