import { PieceStyle } from './types.js';

export const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const white = ['P', 'N', 'B', 'R', 'Q', 'K'];
export const black = ['p', 'n', 'b', 'r', 'q', 'k'];
export const defaultSize = 720;
export const defaultPadding: [number, number, number, number] = [0, 0, 0, 0];
export const defaultLight = '#f0d9b5';
export const defaultDark = '#b58863';
export const defaultHighlight = 'rgba(235, 97, 80, 0.8)';
export const defaultStyle: PieceStyle = 'merida';

export const filePaths: Record<string, string> = {
  wp: 'WhitePawn',
  wn: 'WhiteKnight',
  wb: 'WhiteBishop',
  wr: 'WhiteRook',
  wq: 'WhiteQueen',
  wk: 'WhiteKing',
  bp: 'BlackPawn',
  bn: 'BlackKnight',
  bb: 'BlackBishop',
  br: 'BlackRook',
  bq: 'BlackQueen',
  bk: 'BlackKing',
};
