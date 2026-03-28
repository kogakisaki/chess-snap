import { Chess } from 'chess.js';
import { ChessImageOptions, PieceStyle } from './types.js';
import { defaultSize, defaultPadding, defaultLight, defaultDark, defaultHighlight, defaultStyle, white, black, cols } from './config.js';
import { generateBoardBuffer, writePNG } from './renderer.js';

export default class ChessImageGenerator {
  private chess: Chess;
  private options: Required<ChessImageOptions>;
  private highlightedSquares: string[];
  public ready: boolean;

  constructor(options: ChessImageOptions = {}) {
    this.chess = new Chess();
    this.highlightedSquares = [];
    this.ready = false;

    this.options = {
      size: options.size || defaultSize,
      padding: options.padding || defaultPadding,
      light: options.light || defaultLight,
      dark: options.dark || defaultDark,
      highlight: options.highlight || defaultHighlight,
      style: options.style || defaultStyle,
      flipped: options.flipped ?? false,
      notations: options.notations ?? false,
      notationColor: options.notationColor || '',
      notationStyle: options.notationStyle || 'inside',
      format: options.format || 'png',
      quality: options.quality ?? 80,
    };

    if (this.options.notationStyle === 'outside' && this.options.padding.every(p => p === 0)) {
      this.options.padding = [30, 30, 30, 30];
    }
  }

  /**
   * Loads PGN into chess object
   * @param pgn Chess game PGN
   */
  public async loadPGN(pgn: string): Promise<void> {
    this.chess.loadPgn(pgn);
    this.ready = true;
  }

  /**
   * Loads FEN into chess object
   * @param fen Chess position FEN
   */
  public async loadFEN(fen: string): Promise<void> {
    this.chess.load(fen);
    this.ready = true;
  }

  /**
   * Loads a generic 2D Array into chess object
   * @param array 8x8 Chess position array
   */
  public loadArray(array: string[][]): void {
    this.chess.clear();

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            const piece = array[i][j];
            if (piece !== '' && black.includes(piece.toLowerCase())) {
                const color = white.includes(piece) ? 'w' : 'b';
                const type = piece.toLowerCase() as any;
                const square = `${cols[j]}${8 - i}` as any;
                this.chess.put({ type, color }, square);
            }
        }
    }
    this.ready = true;
  }

  /**
   * Highlight specified squares
   * @param array Array of square coordinates (e.g. ['e4', 'e5'])
   */
  public highlightSquares(array: string[]): void {
    this.highlightedSquares = array;
  }

  /**
   * Generates buffer image based on position
   * @returns Image Buffer
   */
  public async generateBuffer(): Promise<Buffer> {
    if (!this.ready) {
      throw new Error('Load a position first (loadFEN, loadPGN, or loadArray)');
    }
    return generateBoardBuffer(this.chess, this.options, this.highlightedSquares);
  }

  /**
   * Generates a PNG image and saves it to a file (kept for backward compatibility)
   * @param pngPath Output Path
   */
  public async generatePNG(pngPath: string): Promise<string> {
    const buffer = await this.generateBuffer();
    return writePNG(buffer, pngPath);
  }

  /**
   * Generates an image and saves it to a file using the configured format (png, jpeg, webp)
   * @param imagePath Output Path
   */
  public async generateImage(imagePath: string): Promise<string> {
    const buffer = await this.generateBuffer();
    return writePNG(buffer, imagePath);
  }
}
