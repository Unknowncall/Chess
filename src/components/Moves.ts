import type { Board, Position, PieceType, Turn } from './Board'

export const isPlayerInCheck = (board: Board, playerToCheck: Turn): boolean => {
	const king = playerToCheck === 'w' ? 'k' : 'K'
	const opponent = playerToCheck === 'w' ? 'b' : 'B'
	const kingPosition = [] as Position

	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			if (board[i][j] === king) {
				kingPosition.push(i, j)
				break
			}
		}
	}

	const moves = getPotentialMoves(board, kingPosition, 'k', playerToCheck)
	return moves.some(move => {
		const [x, y] = move
		return board[x][y].toLowerCase() === opponent
	})
}
export const isPlayerInCheckmate = (board: Board, playerToCheck: Turn): boolean => {
	const player = playerToCheck === 'w' ? 'w' : 'b'
	const opponent = playerToCheck === 'w' ? 'b' : 'w'

	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			if (board[i][j].toLowerCase() === player) {
				const moves = getPotentialMoves(board, [i, j], board[i][j].toLowerCase() as PieceType, playerToCheck)
				for (const move of moves) {
					const newBoard = board.map(row => row.slice())
					const [x, y] = move
					newBoard[x][y] = newBoard[i][j]
					newBoard[i][j] = ''
					if (!isPlayerInCheck(newBoard, playerToCheck)) {
						return false
					}
				}
			}
		}
	}

	return true
}

const isSpaceOccupied = (board: Board, position: Position, turn: Turn): boolean => {
	const [x, y] = position
	const piece = board[x][y]
	const isBlackTurn = turn === 'b'

	if (isBlackTurn && piece === piece.toUpperCase()) {
		return true
	}

	if (!isBlackTurn && piece === piece.toLowerCase()) {
		return true
	}

	return false
}

export const getPawnMoves = (board: Board, position: Position, turn: Turn): Position[] => {
	const [x, y] = position
	const moves = [] as Position[]
	const direction = turn === 'w' ? -1 : 1

	if (board[x + direction][y] === '') {
		moves.push([x + direction, y])
		if ((turn === 'w' && x === 6) || (turn === 'b' && x === 1)) {
			if (board[x + 2 * direction][y] === '') {
				moves.push([x + 2 * direction, y])
			}
		}
	}

	if (y > 0 && board[x + direction][y - 1] !== '' && board[x + direction][y - 1].toLowerCase() !== turn) {
		moves.push([x + direction, y - 1])
	}

	if (y < 7 && board[x + direction][y + 1] !== '' && board[x + direction][y + 1].toLowerCase() !== turn) {
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
			if (board[newX][newY] === '' || board[newX][newY].toLowerCase() !== turn) {
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
			if (board[newX][newY] === '') {
				moves.push([newX, newY])
			} else {
				if (board[newX][newY].toLowerCase() !== turn) {
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
			if (board[newX][newY] === '') {
				moves.push([newX, newY])
			} else {
				if (board[newX][newY].toLowerCase() !== turn) {
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
			if (board[newX][newY] === '' || board[newX][newY].toLowerCase() !== turn) {
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
		board[x][y] = turn === 'w' ? 'Q' : 'q'
	}
}