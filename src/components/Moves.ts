import { type Board, type Position, type PieceType, type Turn, findByPiece, PieceColor, getPieces, Move } from './Board'

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

// if the king and rook haven't moved, and the spaces between them are empty, return the castling move
export const getCastlingMoves = (board: Board, position: Position, turn: Turn): Position[] => {
	const [x, y] = position
	const moves = [] as Position[]
	const king = board[x][y]

	if (king.type !== 'k') {
		return []
	}

	const kingSideRook = board[x][7]
	const queenSideRook = board[x][0]

	if (kingSideRook.type === 'r' && kingSideRook.color === turn) {
		if (board[x][6].type === '' && board[x][5].type === '') {
			moves.push([x, 7])
		}
	}

	if (queenSideRook.type === 'r' && queenSideRook.color === turn) {
		if (board[x][3].type === '' && board[x][2].type === '' && board[x][1].type === '') {
			moves.push([x, 0])
		}
	}

	return moves
}

export const getPotentialMoves = (board: Board, position: Position, pieceType: PieceType, turn: Turn): Move[] => {
	const positionMoves = [] as Position[]
	switch (pieceType) {
		case 'p':
			positionMoves.push(...getPawnMoves(board, position, turn))
			break
		case 'n':
			positionMoves.push(...getKnightMoves(board, position, turn))
			break
		case 'b':
			positionMoves.push(...getBishopMoves(board, position, turn))
			break
		case 'r':
			positionMoves.push(...getRookMoves(board, position, turn))
			break
		case 'q':
			positionMoves.push(...getQueenMoves(board, position, turn))
			break
		case 'k':
			positionMoves.push(...getKingMoves(board, position, turn))
			break
		default:
			return []
	}

	const moves = [] as Move[]
	for (const moveTo of positionMoves) {
		const move = {
			from: position, to: moveTo, func: () => {
				const newBoard = board.map(row => row.map(slot => ({ ...slot })))
				const [x, y] = position
				const [newX, newY] = moveTo
				newBoard[newX][newY] = newBoard[x][y]
				newBoard[x][y] = { type: '', color: '' }
				return newBoard
			}
		} as Move
		moves.push(move)
	}

	const castlingMoves = getCastlingMoves(board, position, turn)
	moves.push(...castlingMoves.map(move => ({
		from: position, to: move, func: () => {
			// logic to handle castling, for ex if kingSideRook is at [x, 7], move it to [x, 6] and move the king to [x, 7]
			// opposite for queenSideRook
			const newBoard = board.map(row => row.map(slot => ({ ...slot })))
			const [x, y] = position
			const [newX, newY] = move
			const king = newBoard[x][y]
			const rook = newBoard[newX][newY]

			// delete the king and rook from their original positions
			if (newY === 7) {
				newBoard[x][7] = { type: '', color: '' }
				newBoard[x][6] = king
				newBoard[x][5] = rook
				newBoard[x][4] = { type: '', color: '' }
			} else {
				newBoard[x][0] = { type: '', color: '' }
				newBoard[x][2] = king
				newBoard[x][3] = rook
				newBoard[x][4] = { type: '', color: '' }
			}
			return newBoard
		}
	})))
	return moves
}

// checking if X player is in check
export const isPlayerInCheck = (board: Board, playerToCheck: PieceColor): boolean => {
	const opponent = playerToCheck === 'w' ? 'b' : 'w'
	const kingPosition = findByPiece(board, 'k', playerToCheck)[0]
	const opponentPieces = getPieces(board, opponent)

	for (const piece of opponentPieces) {
		const moves = getPotentialMoves(board, piece, board[piece[0]][piece[1]].type as PieceType, opponent as Turn)
		if (moves.some(move => move.to[0] === kingPosition[0] && move.to[1] === kingPosition[1])) {
			return true
		}
	}
	return false
}

// checking if X player is in checkmate
export const isPlayerInCheckmate = (board: Board, playerToCheck: PieceColor): boolean => {
	const playerPieces = getPieces(board, playerToCheck)
	for (const piece of playerPieces) {
		const moves = getPotentialMoves(board, piece, board[piece[0]][piece[1]].type as PieceType, playerToCheck as Turn)
		for (const move of moves) {
			const newBoard = board.map(row => row.map(slot => ({ ...slot })))
			move.func()
			if (!isPlayerInCheck(newBoard, playerToCheck)) {
				return false
			}
		}
	}
	return true
}
