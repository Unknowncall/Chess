
export type Position = [number, number]
export type Board = BoardRow[]
export type BoardRow = BoardSlot[]
export type BoardSlot = { type: PieceType | '', color: PieceColor | '' }
export type Move = { from: Position, to: Position, func: () => Board }
export type Turn = 'w' | 'b'
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
export type PieceColor = 'w' | 'b'

export const findByPiece = (board: Board, piece: PieceType, color?: PieceColor): Position[] => {
	const positions = [] as Position[]
	for (let x = 0; x < 8; x++) {
		for (let y = 0; y < 8; y++) {
			if (board[x][y].type === piece) {
				if (color) {
					if (board[x][y].color === color) {
						positions.push([x, y])
					}
				} else {
					positions.push([x, y])
				}
			}
		}
	}
	return positions
}

export const getPieceAtLocation = (board: Board, position: Position): BoardSlot => {
	const [x, y] = position
	return board[x][y]
}

export const getPieces = (board: Board, color: PieceColor): { position: Position, boardSlot: BoardSlot }[] => {
	const pieces = [] as { position: Position, boardSlot: BoardSlot }[]
	for (let x = 0; x < 8; x++) {
		for (let y = 0; y < 8; y++) {
			if (board[x][y].color === color) {
				pieces.push({ position: [x, y], boardSlot: board[x][y] })
			}
		}
	}
	return pieces
}

export const checkPromotion = (board: Board, position: Position, turn: Turn): void => {
	const [x, y] = position
	if ((turn === 'w' && x === 0) || (turn === 'b' && x === 7)) {
		const piece = board[x][y]
		if (piece.type === 'p') {
			board[x][y] = { type: 'q', color: piece.color }
		}
	}
}
