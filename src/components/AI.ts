import { Board, Move, PieceType, Turn, findByPiece, getPieces } from "./Board"
import { getAllPotentialMovesWithoutCheck } from "./Moves"

export default function getBestNextMove(board: Board, turn: Turn, depth: number): Move {
	let moves = getAllPotentialMovesWithoutCheck(board, turn)
	const bestMove = { score: -Infinity, move: moves[0] }

	moves.sort((a, b) => heuristic(b, turn) - heuristic(a, turn))

	// set the array to minimax the first 100 moves
	moves = moves.slice(0, 50)

	moves.forEach(move => {
		const newBoard = move.func()
		const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false)
		if (score > bestMove.score) {
			bestMove.score = score
			bestMove.move = move
		}
	})

	return bestMove.move
}

function heuristic(move: Move, turn: Turn): number {
	const newBoard = move.func()
	const random = Math.random()

	// 1. Material advantage
	const myPieces = getPieces(newBoard, turn)
	const opponentPieces = getPieces(newBoard, turn === 'w' ? 'b' : 'w')
	const materialAdvantage = myPieces.reduce((sum, piece) => sum + getPieceValue(piece.boardSlot.type), 0) - opponentPieces.reduce((sum, piece) => sum + getPieceValue(piece.boardSlot.type), 0)

	// 2. Pawn structure
	const myPawns = myPieces.filter(piece => piece.boardSlot.type === 'p')
	const pawnStructure = myPawns.reduce((sum, pawn) => sum + myPawns.filter(otherPawn => Math.abs(otherPawn.position[0] - pawn.position[0]) === 1 && otherPawn.position[1] === pawn.position[1] + (turn === 'w' ? 1 : -1)).length, 0)

	// 3. King safety
	const myKing = findByPiece(newBoard, 'k', turn)
	const kingSafety = opponentPieces.reduce((sum) => sum + getAllPotentialMovesWithoutCheck(newBoard, turn === 'w' ? 'b' : 'w').filter(move => move.to === myKing[0]).length, 0)

	// 4. Control of the center
	const centerControl = myPieces.filter(piece => piece.position[0] >= 3 && piece.position[0] <= 4 && piece.position[1] >= 3 && piece.position[1] <= 4).length

	// 5. Randomness
	return random * 0.1 + (1 - random) * (materialAdvantage + pawnStructure - kingSafety + centerControl)
}

function minimax(board: Board, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
	if (depth === 0) {
		return evaluateBoard(board)
	}

	const turn = isMaximizing ? 'b' : 'w'
	const moves = getAllPotentialMovesWithoutCheck(board, turn)

	if (isMaximizing) {
		let maxEval = -Infinity
		moves.forEach(move => {
			const newBoard = move.func()
			const evaluted = minimax(newBoard, depth - 1, alpha, beta, false)
			maxEval = Math.max(maxEval, evaluted)
			alpha = Math.max(alpha, evaluted)
			if (beta <= alpha) {
				return maxEval
			}
		})
		return maxEval
	} else {
		let minEval = Infinity
		moves.forEach(move => {
			const newBoard = move.func()
			const evaluted = minimax(newBoard, depth - 1, alpha, beta, true)
			minEval = Math.min(minEval, evaluted)
			beta = Math.min(beta, evaluted)
			if (beta <= alpha) {
				return minEval
			}
		})
		return minEval
	}
}

const pieceValue: { [key in PieceType]: number } = {
	p: 1,
	n: 3,
	b: 3,
	r: 5,
	q: 9,
	k: 100
}

function getPieceValue(piece: PieceType | ''): number {
	if (piece === '') {
		return 0
	}
	return pieceValue[piece]
}

function evaluateBoard(board: Board): number {
	let score = 0

	board.forEach(row => {
		row.forEach(piece => {
			if (piece.type === '') {
				return
			}

			if (piece.color === 'w') {
				score += pieceValue[piece.type] as number
			} else {
				score -= pieceValue[piece.type] as number
			}
		})
	})

	return score
}