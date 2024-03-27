import { useState } from "preact/hooks"
import { PieceType, Turn } from "./Board"
import { checkPromotion, getPotentialMoves, isPlayerInCheck } from "./Moves"
import pawnBlack from "../assets/pieces/black/p.png"
import knightBlack from "../assets/pieces/black/n.png"
import bishopBlack from "../assets/pieces/black/b.png"
import rookBlack from "../assets/pieces/black/r.png"
import queenBlack from "../assets/pieces/black/q.png"
import kingBlack from "../assets/pieces/black/k.png"

import pawnWhite from "../assets/pieces/white/p.png"
import knightWhite from "../assets/pieces/white/n.png"
import bishopWhite from "../assets/pieces/white/b.png"
import rookWhite from "../assets/pieces/white/r.png"
import queenWhite from "../assets/pieces/white/q.png"
import kingWhite from "../assets/pieces/white/k.png"

export default function Chess() {

	const [turn, setTurn] = useState('w')

	// lowercase = black, uppercase = white
	const [board, setBoard] = useState([
		['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
		['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
		['', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', ''],
		['', '', '', '', '', '', '', ''],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
	])
	const [selected, setSelected] = useState([-1, -1])
	const [potentialMoves, setPotentialMoves] = useState([] as number[][])
	const [inCheck, setInCheck] = useState(false)
	const [checkmate, setCheckmate] = useState(false)

	return (
		<div class="flex flex-col h-full w-full">
			<div class="border-black border-2 w-fit mx-auto">
			{board.map((row, i) => (
				<div class="flex justify-center">
					{row.map((piece, j) => (
						<div
							class={`w-16 h-16 flex justify-center items-center
								${(i + j) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-500'}
								${selected[0] === i && selected[1] === j ? 'border-2 border-blue-500' : ''}
								${potentialMoves.some(move => move[0] === i && move[1] === j) ? 'bg-green-500' : ''}`
							}
							onClick={() => {
								if (selected[0] === -1 && selected[1] === -1) {
									// if it's white turn and the piece selected is black, return
									if (turn === 'w' && piece === piece.toLowerCase()) {
										return
									}

									// if it's black turn and the piece selected is white, return
									if (turn === 'b' && piece === piece.toUpperCase()) {
										return
									}

									if (piece !== '') {
										setSelected([i, j])
									}
									const moves = getPotentialMoves(board, [i, j], piece.toLowerCase() as PieceType, turn as Turn)
									setPotentialMoves(moves)
								} else {
									// if same space is clicked, unselect
									if (selected[0] === i && selected[1] === j) {
										setSelected([-1, -1])
										setPotentialMoves([])
										return
									}

									// if the space clicked is not a potential move, return
									if (!potentialMoves.some(move => move[0] === i && move[1] === j)) {
										return
									}

									const [selectedI, selectedJ] = selected
									const newBoard = board.map(row => row.slice())
									newBoard[i][j] = newBoard[selectedI][selectedJ]
									newBoard[selectedI][selectedJ] = ''
									checkPromotion(newBoard, [i, j], turn as Turn)
									setBoard(newBoard)
									setSelected([-1, -1])
									setTurn(turn === 'w' ? 'b' : 'w')
									setPotentialMoves([])
								}
							}}
						>
							<p class="absolute text-xs text-red-700">{i},{j}</p>
							{piece === 'p' && <img src={pawnBlack} />}
							{piece === 'n' && <img src={knightBlack} />}
							{piece === 'b' && <img src={bishopBlack} />}
							{piece === 'r' && <img src={rookBlack} />}
							{piece === 'q' && <img src={queenBlack} />}
							{piece === 'k' && <img src={kingBlack} />}

							{piece === 'P' && <img src={pawnWhite} />}
							{piece === 'N' && <img src={knightWhite} />}
							{piece === 'B' && <img src={bishopWhite} />}
							{piece === 'R' && <img src={rookWhite} />}
							{piece === 'Q' && <img src={queenWhite} />}
							{piece === 'K' && <img src={kingWhite} />}
						</div>
					))}
				</div>
			))}
			</div>

			<p>Turn: {turn === 'w' ? 'White' : 'Black'}</p>
		</div>
	)
}