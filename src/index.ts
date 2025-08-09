import { Chess } from "chess.js";

type PieceMap = { [key: string]: string };
type BoardState = { white: string; black: string };

const PIECE_NAMES: PieceMap = {
  p: "Pawn",
  r: "Rook",
  n: "Knight",
  b: "Bishop",
  q: "Queen",
  k: "King",
};

function formatLastMoveState(pgn: string, listLegalMoves: boolean): string {
  let chess = new Chess();
  try {
    chess.loadPgn(pgn);
  } catch (error) {
    throw new Error("Invalid PGN format");
  }

  const moves = chess.history();
  if (moves.length === 0) return "No moves in PGN";

  const lastMoveIndex = moves.length - 1;
  const moveNumber = Math.ceil((lastMoveIndex + 1) / 2);
  const isBlackMove = lastMoveIndex % 2 === 1;
  const moveNotation = `${moveNumber}.${isBlackMove ? ".." : ""} ${
    moves[lastMoveIndex]
  }`;

  const boardState = getBoardState(chess);
  const prompt = `${moveNotation}\n\nAfter this move,\n\nWhite has: ${boardState.white}\n\nBlack has: ${boardState.black}`;

  if (!listLegalMoves) {
    return prompt;
  }

  return `${prompt}\n\nYour ONLY legal moves are: ${chess
    .moves()
    .join(", ")}. Choose one of them.`;
}

function getBoardState(chess: Chess): BoardState {
  const whitePieces: string[] = [];
  const blackPieces: string[] = [];
  const board = chess.board();

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const square = board[rank][file];
      if (!square) continue;

      const pieceName = PIECE_NAMES[square.type];
      const squareNotation = `${String.fromCharCode(97 + file)}${8 - rank}`;
      const pieceEntry = `${pieceName} on ${squareNotation}`;

      if (square.color === "w") whitePieces.push(pieceEntry);
      else blackPieces.push(pieceEntry);
    }
  }

  return {
    white: whitePieces.join(", "),
    black: blackPieces.join(", "),
  };
}

function format() {
  const pgnInput = document.getElementById("pgn-input") as HTMLTextAreaElement;
  const output = document.getElementById("output") as HTMLTextAreaElement;
  const checkbox = document.getElementById("legal") as HTMLInputElement;

  try {
    output.value = formatLastMoveState(pgnInput.value, checkbox.checked);
  } catch (error) {
    output.value = `Error: ${(error as Error).message}`;
  }
}

function selectAll(event: FocusEvent) {
  const target = event.target as HTMLTextAreaElement;
  target?.select();
}

function initPGNFormatter() {
  const pgnInput = document.getElementById("pgn-input") as HTMLTextAreaElement;
  const output = document.getElementById("output") as HTMLTextAreaElement;
  const checkbox = document.getElementById("legal") as HTMLInputElement;
  pgnInput.addEventListener("input", format);
  checkbox.addEventListener("change", format);

  pgnInput.addEventListener("focus", selectAll);
  output.addEventListener("focus", selectAll);
  format();
}

initPGNFormatter();
