import { type Board, type Position, type PieceType, type Turn, findByPiece } from './Board'

const isSpaceOccupied = (board: Board, position: Position, turn: Turn): boolean => {
	const [x, y] = position
	const piece = board[x][y]

	if (piece.type === '') {
		return true
	}

	// if it's white
	if (turn === 'w') {
		if (piece.color === 'b') {
			return true
		}
		return false
	}

	// if it's black
	if (turn === 'b') {
		if (piece.color === 'w') {
			return true
		}
		return false
	}

	return false
}

export const getPawnMoves = (board: Board, position: Position, turn: Turn): Position[] => {
	const [x, y] = position
	const moves = [] as Position[]
	const direction = turn === 'w' ? -1 : 1

	if (board[x + direction][y].type === '') {
		moves.push([x + direction, y])
		if ((turn === 'w' && x === 6) || (turn === 'b' && x === 1)) {
			if (board[x + 2 * direction][y].type === '') {
				moves.push([x + 2 * direction, y])
			}
		}
	}

	if (y > 0 && board[x + direction][y - 1].type !== '' && board[x + direction][y - 1].color !== turn) {
		moves.push([x + direction, y - 1])
	}

	if (y < 7 && board[x + direction][y + 1].type !== '' && board[x + direction][y + 1].color !== turn) {
		moves.push([x + direction, y + 1])
	}

	return moves.filter(move => isSpaceOccupied(board, move, turn))
}

export const getKnightMoves = (board: Board, position: Position, turn: Turn): Position[] => {
	const [x, y] = position
	const moves = [] as Position[]
	const directions = [
		[-2, -1], [-2, 1], [-1, -2], [-1, 2],
		[1, -2], [1, 2], [2, -1], [2, 1]
	]

	for (const [dx, dy] of directions) {
		const newX = x + dx
		const newY = y + dy
		if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
			if (board[newX][newY].type === '' || board[newX][newY].color !== turn) {
				moves.push([newX, newY])
			}
		}
	}

	return moves.filter(move => isSpaceOccupied(board, move, turn))
}

export const getBishopMoves = (board: Board, position: Position, turn: Turn): Position[] => {
	const [x, y] = position
	const moves = [] as Position[]
	const directions = [
		[-1, -1], [-1, 1], [1, -1], [1, 1]
	]

	for (const [dx, dy] of directions) {
		let newX = x + dx
		let newY = y + dy
		while (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
			if (board[newX][newY].type === '') {
				moves.push([newX, newY])
			} else {
				if (board[newX][newY].color !== turn) {
					moves.push([newX, newY])
				}
				break
			}
			newX += dx
			newY += dy
		}
	}

	return moves.filter(move => isSpaceOccupied(board, move, turn))
}

export const getRookMoves = (board: Board, position: Position, turn: Turn): Position[] => {
	const [x, y] = position
	const moves = [] as Position[]
	const directions = [
		[-1, 0], [1, 0], [0, -1], [0, 1]
	]

	for (const [dx, dy] of directions) {
		let newX = x + dx
		let newY = y + dy
		while (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
			if (board[newX][newY].type === '') {
				moves.push([newX, newY])
			} else {
				if (board[newX][newY].color !== turn) {
					moves.push([newX, newY])
				}
				break
			}
			newX += dx
			newY += dy
		}
	}

	return moves.filter(move => isSpaceOccupied(board, move, turn))
}

export const getQueenMoves = (board: Board, position: Position, turn: Turn): Position[] => {
	return [
		...getBishopMoves(board, position, turn),
		...getRookMoves(board, position, turn)
	]
}

export const getKingMoves = (board: Board, position: Position, turn: Turn): Position[] => {
	const [x, y] = position
	const moves = [] as Position[]
	const directions = [
		[-1, -1], [-1, 0], [-1, 1],
		[0, -1], [0, 1],
		[1, -1], [1, 0], [1, 1]
	]

	for (const [dx, dy] of directions) {
		const newX = x + dx
		const newY = y + dy
		if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
			if (board[newX][newY].color === '' || board[newX][newY].color !== turn) {
				moves.push([newX, newY])
			}
		}
	}

	return moves.filter(move => isSpaceOccupied(board, move, turn))
}

export const getPotentialMoves = (board: Board, position: Position, pieceType: PieceType, turn: Turn): Position[] => {
	switch (pieceType) {
		case 'p':
			return getPawnMoves(board, position, turn)
		case 'n':
			return getKnightMoves(board, position, turn)
		case 'b':
			return getBishopMoves(board, position, turn)
		case 'r':
			return getRookMoves(board, position, turn)
		case 'q':
			return getQueenMoves(board, position, turn)
		case 'k':
			return getKingMoves(board, position, turn)
		default:
			return []
	}
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

export const isPlayerInCheck = (board: Board, playerToCheck: Turn): boolean => {
	const pieceLocation = findByPiece(board, playerToCheck === 'w' ? 'k' : 'K')
	if (pieceLocation.length === 0) {
		return false
	}

	const opponent = playerToCheck === 'w' ? 'b' : 'w'

	for (let i = 0; i < 8; i++) { // rows
		for (let j = 0; j < 8; j++) { // columns
			if (board[i][j].color === opponent) {
				// get all potential moves for that piece
				const moves = getPotentialMoves(board, [i, j], board[i][j].type as PieceType, playerToCheck)
				console.log(`Got moves for ${board[i][j]} at ${i},${j}`, moves)
				for (const move of moves) { // check if any of the moves are the king
					const [x, y] = move
					const pieceAtNewLocation = board[x][y]
					if (pieceAtNewLocation.type === 'k' || pieceAtNewLocation.color === opponent) {
						return true
					}
				}
			}
		}
	}
	return false
}

export const isPlayerInCheckmate = (board: Board, playerToCheck: Turn): boolean => {
	// basically need to make a new board with every possible move and check if the player is still in check

	const kingPosition = findByPiece(board, playerToCheck === 'w' ? 'k' : 'K')[0]
	const kingMoves = getKingMoves(board, kingPosition, playerToCheck)

	for (const move of kingMoves) {
		const newBoard = JSON.parse(JSON.stringify(board))
		const [x, y] = move
		newBoard[x][y] = newBoard[kingPosition[0]][kingPosition[1]]
		newBoard[kingPosition[0]][kingPosition[1]] = ''
		if (!isPlayerInCheck(newBoard, playerToCheck)) {
			return false
		}
	}

	return true
}