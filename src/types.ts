export type PieceStyle = 
  | 'neo'
  | 'glass'
  | 'wood'
  | 'game_room'
  | 'merida'
  | 'alpha'
  | 'cheq'
  | 'cburnett'
  | 'game_room_gothic'
  | 'game_room_space'
  | 'leipzig'
  | 'neo_wood';

export interface ChessImageOptions {
  /** Pixel size of the generated board (e.g. 720) */
  size?: number;
  /** Padding around the board [top, right, bottom, left] */
  padding?: [number, number, number, number];
  /** Color of light squares */
  light?: string;
  /** Color of dark squares */
  dark?: string;
  /** Color of highlighted squares */
  highlight?: string;
  /** Desired style of standard pieces */
  style?: PieceStyle;
  /** View the board from Black's perspective */
  flipped?: boolean;
  /** Draw algebraic notations (A-H, 1-8) around the board */
  notations?: boolean;
  /** Custom color for the notation texts */
  notationColor?: string;
  /** Placement of the notations */
  notationStyle?: 'inside' | 'outside';
  /** Image output format (png, jpeg, webp) */
  format?: 'png' | 'jpeg' | 'webp';
  /** Image quality (0-100) for jpeg and webp formats */
  quality?: number;
}
