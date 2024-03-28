import { useState } from "preact/hooks"
import { PieceType, Turn, Board, checkPromotion, Move } from "./Board"
import { getPotentialMovesWithoutCheck, isPlayerInCheck, isPlayerInCheckmate } from "./Moves"

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

import normalJson from '../testing/normalBoard.json';
import getBestNextMove from "./AI"

export default function Chess() {

	const [turn, setTurn] = useState('w' as Turn)
	const [board, setBoard] = useState(
		normalJson as Board
	)
	const [selected, setSelected] = useState([-1, -1])
	const [potentialMoves, setPotentialMoves] = useState([] as Move[])
	const [inCheck, setInCheck] = useState(false)
	const [checkmate, setCheckmate] = useState(false)

	return (
		<div class={`flex flex-col h-full w-full`}>

			{checkmate &&
				<div class="absolute top-0 left-0 w-full h-full bg-white bg-opacity-80 flex flex-col justify-center items-center z-10 duration-200">
					<h1 class="text-4xl">Checkmate!</h1>
					<p>{turn === 'w' ? 'Black' : 'White'} wins!</p>
					<button class="bg-blue-500 text-white p-2 rounded-md mt-4" onClick={() => {
						setBoard(normalJson as Board)
						setTurn('w')
						setSelected([-1, -1])
						setPotentialMoves([])
						setInCheck(false)
						setCheckmate(false)
					}}>Play Again</button>
				</div>
			}

			<div class={`*:border-black border-2 w-fit mx-auto ${checkmate ? 'blur' : ''}`}>
				{board.map((row, i) => (
					<div class="flex justify-center">
						{row.map((boardSlot, j) => (
							<div
								class={`h-16 w-16 flex justify-center items-center
								${(i + j) % 2 === 0 ? 'bg-gray-300' : 'bg-gray-500'}
								${selected[0] === i && selected[1] === j ? 'border-4 border-blue-500' : ''}
								${potentialMoves.some(move => move.to[0] === i && move.to[1] === j) ? 'border-4 border-green-500' : ''}`
									+ (inCheck && boardSlot.type === 'k' && boardSlot.color === turn ? ' border-4 border-red-500' : '')
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
										const moves = getPotentialMovesWithoutCheck(board, [i, j], boardSlot.type as PieceType, turn as Turn)
										setPotentialMoves(moves)
									} else {
										// if same space is clicked, unselect
										if (selected[0] === i && selected[1] === j) {
											setSelected([-1, -1])
											setPotentialMoves([])
											return
										}

										// if the space clicked is not a potential move, return
										if (!potentialMoves.some(move => move.to[0] === i && move.to[1] === j)) {
											return
										}

										const move = potentialMoves.find(move => move.to[0] === i && move.to[1] === j)
										const newBoard = move?.func() as Board
										checkPromotion(newBoard, [i, j], turn as Turn)
										setBoard(newBoard)

										const opponent = turn === 'w' ? 'b' : 'w'
										setSelected([-1, -1])
										setTurn(opponent)
										setPotentialMoves([])

										// do the check/checkmate check
										const playerInCheck = isPlayerInCheck(newBoard, opponent)
										setInCheck(playerInCheck)
										if (playerInCheck) {
											const playerInCheckmate = isPlayerInCheckmate(newBoard, opponent)
											setCheckmate(playerInCheckmate)
										}

										// only generate the moves for black
										if (opponent === 'b') {
											const nextBestMove = getBestNextMove(newBoard, opponent as Turn, 3)
											const nextBoard = nextBestMove.func() as Board
											checkPromotion(nextBoard, nextBestMove.to, opponent as Turn)
											setBoard(nextBoard)
											setTurn('w')
											setSelected([-1, -1])
											setPotentialMoves([])
											// do the check/checkmate check
											const playerInCheck = isPlayerInCheck(nextBoard, 'w')
											setInCheck(playerInCheck)
											if (playerInCheck) {
												const playerInCheckmate = isPlayerInCheckmate(nextBoard, 'w')
												setCheckmate(playerInCheckmate)
											}
										}
									}
								}}
							>
								{/* <p class="absolute text-xs text-red-700">{i},{j}</p> */}
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
		</div>
	)
}