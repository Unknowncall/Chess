import { useState } from "preact/hooks"
import { PieceType, Turn, Board } from "./Board"
import { checkPromotion, getPotentialMoves, isPlayerInCheck, isPlayerInCheckmate } from "./Moves"
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


	const [board, setBoard] = useState(
		[
			[{ "type": "r", "color": "b" }, { "type": "n", "color": "b" }, { "type": "b", "color": "b" }, { "type": "q", "color": "b" }, { "type": "k", "color": "b" }, { "type": "b", "color": "b" }, { "type": "n", "color": "b" }, { "type": "r", "color": "b" }],
			[{ "type": "p", "color": "b" }, { "type": "p", "color": "b" }, { "type": "p", "color": "b" }, { "type": "p", "color": "b" }, { "type": "p", "color": "b" }, { "type": "p", "color": "b" }, { "type": "p", "color": "b" }, { "type": "p", "color": "b" }],
			[{ "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }],
			[{ "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }],
			[{ "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }],
			[{ "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }, { "type": "", "color": "" }],
			[{ "type": "p", "color": "w" }, { "type": "p", "color": "w" }, { "type": "p", "color": "w" }, { "type": "p", "color": "w" }, { "type": "p", "color": "w" }, { "type": "p", "color": "w" }, { "type": "p", "color": "w" }, { "type": "p", "color": "w" }],
			[{ "type": "r", "color": "w" }, { "type": "n", "color": "w" }, { "type": "b", "color": "w" }, { "type": "q", "color": "w" }, { "type": "k", "color": "w" }, { "type": "b", "color": "w" }, { "type": "n", "color": "w" }, { "type": "r", "color": "w" }]
		] as Board
	)

	const [selected, setSelected] = useState([-1, -1])
	const [potentialMoves, setPotentialMoves] = useState([] as number[][])
	const [inCheck, setInCheck] = useState(false)
	const [checkmate, setCheckmate] = useState(false)

	return (
		<div class="flex flex-col h-full w-full">
			<div class="border-black border-2 w-fit mx-auto">
				{board.map((row, i) => (
					<div class="flex justify-center">
						{row.map((boardSlot, j) => (
							<div
								class={`w-16 h-16 flex justify-center items-center
								${(i + j) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-500'}
								${selected[0] === i && selected[1] === j ? 'border-2 border-blue-500' : ''}
								${potentialMoves.some(move => move[0] === i && move[1] === j) ? 'bg-green-500' : ''}`
								}
								onClick={() => {
									if (selected[0] === -1 && selected[1] === -1) {
										// if it's white turn and the piece selected is black, return
										if (turn === 'w' && boardSlot.color === 'b') {
											return
										}

										// if it's black turn and the piece selected is white, return
										if (turn === 'b' && boardSlot.color === 'w') {
											return
										}

										if (boardSlot.type !== '') {
											setSelected([i, j])
										}
										const moves = getPotentialMoves(board, [i, j], boardSlot.type as PieceType, turn as Turn)
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
										newBoard[selectedI][selectedJ] = { type: '', color: '' }
										checkPromotion(newBoard, [i, j], turn as Turn)
										setBoard(newBoard)

										const isCheck = isPlayerInCheck(newBoard, turn as Turn)
										console.log('isCheck', isCheck)
										//const isCheckmate = isPlayerInCheckmate(newBoard, turn as Turn)
										//console.log('isCheckmate', isCheckmate)

										setSelected([-1, -1])
										setTurn(turn === 'w' ? 'b' : 'w')
										setPotentialMoves([])
									}
								}}
							>
								<p class="absolute text-xs text-red-700">{i},{j}</p>
								{boardSlot.type === 'p' && boardSlot.color === 'b' && <img src={pawnBlack} />}
								{boardSlot.type === 'n' && boardSlot.color === 'b' && <img src={knightBlack} />}
								{boardSlot.type === 'b' && boardSlot.color === 'b' && <img src={bishopBlack} />}
								{boardSlot.type === 'r' && boardSlot.color === 'b' && <img src={rookBlack} />}
								{boardSlot.type === 'q' && boardSlot.color === 'b' && <img src={queenBlack} />}
								{boardSlot.type === 'k' && boardSlot.color === 'b' && <img src={kingBlack} />}

								{boardSlot.type === 'p' && boardSlot.color === 'w' && <img src={pawnWhite} />}
								{boardSlot.type === 'n' && boardSlot.color === 'w' && <img src={knightWhite} />}
								{boardSlot.type === 'b' && boardSlot.color === 'w' && <img src={bishopWhite} />}
								{boardSlot.type === 'r' && boardSlot.color === 'w' && <img src={rookWhite} />}
								{boardSlot.type === 'q' && boardSlot.color === 'w' && <img src={queenWhite} />}
								{boardSlot.type === 'k' && boardSlot.color === 'w' && <img src={kingWhite} />}
							</div>
						))}
					</div>
				))}
			</div>

			<p>Turn: {turn === 'w' ? 'White' : 'Black'}</p>
		</div>
	)
}