import type { Board, Position, PieceType, Turn } from './Board'

type MoveEvent = 'move' | 'capture' | 'en passant' | 'castle' | 'promotion'

const handleMove = (board: Board, from: Position, to: Position, event: MoveEvent): Board => { }

export const getPotentialMoves = (board: Board, position: Position, pieceType: PieceType, turn: Turn): Position[] => {
	switch (pieceType) {
		case 'p':
			return getPawnMoves(board, position, turn)
	}
	return []
}