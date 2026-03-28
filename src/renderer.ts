import { createCanvas, loadImage, Image } from '@napi-rs/canvas';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);
import { ChessImageOptions } from './types.js';
import { cols, filePaths } from './config.js';
import { Chess, PieceSymbol, Color } from 'chess.js';
import * as fs from 'fs/promises';

const imageCache: Map<string, Image> = new Map();

/**
 * Ensures the piece image for a given style is loaded into memory exactly once.
 */
async function getPieceImage(style: string, pieceKey: string): Promise<Image> {
  const cacheKey = `${style}_${pieceKey}`;
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  const fileName = filePaths[pieceKey];
  if (!fileName) throw new Error(`Unknown piece key: ${pieceKey}`);

  const imgPath = resolve(_dirname, `../src/assets/pieces/${style}/${fileName}.png`);
  
  try {
    const image = await loadImage(imgPath);
    imageCache.set(cacheKey, image);
    return image;
  } catch (err) {
    throw new Error(`Failed to load piece image from ${imgPath}: ${err}`);
  }
}

/**
 * Renders the algebraic notations (A-H, 1-8) around the board.
 */
function drawNotations(
  ctx: any, 
  size: number, 
  flipped: boolean, 
  light: string, 
  dark: string, 
  padding: [number, number, number, number],
  notationStyle: 'inside' | 'outside',
  notationColor?: string
) {
  const paddingTop = padding[0];
  const paddingLeft = padding[3];
  const paddingBottom = padding[2];
  const paddingRight = padding[1];
  const squareSize = size / 8;
  const fontSize = Math.max(16, Math.floor(squareSize / 3.5));
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textBaseline = 'top';

  const rows = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const columns = flipped ? [...cols].reverse() : cols;

  for (let i = 0; i < 8; i++) {
    const ySquare = (squareSize * i) + paddingTop;
    const xSquare = (squareSize * i) + paddingLeft;

    if (notationStyle === 'inside') {
      const isLightSquareForNumber = (i % 2 === 0);
      ctx.fillStyle = notationColor || (isLightSquareForNumber ? dark : light);
      
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = notationColor ? "rgba(0,0,0,0.5)" : (isLightSquareForNumber ? light : dark);
      ctx.strokeText(rows[i].toString(), paddingLeft + 4, ySquare + 4);
      ctx.fillText(rows[i].toString(), paddingLeft + 4, ySquare + 4);

      const isLightSquareForLetter = (i % 2 !== 0);
      ctx.fillStyle = notationColor || (isLightSquareForLetter ? dark : light);
      
      const textWidth = ctx.measureText(columns[i]).width;
      const letterX = xSquare + squareSize - textWidth - 2;
      const letterY = size - fontSize - 2 + paddingTop;
      
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = notationColor ? "rgba(0,0,0,0.5)" : (isLightSquareForLetter ? light : dark);
      ctx.strokeText(columns[i], letterX, letterY);
      ctx.fillText(columns[i], letterX, letterY);
    } else {
      ctx.fillStyle = notationColor || dark;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      
      const numberY = ySquare + (squareSize / 2);
      ctx.fillText(rows[i].toString(), paddingLeft / 2, numberY);

      const letterX = xSquare + (squareSize / 2);
      const letterY = (paddingTop / 2) - 4;
      ctx.fillText(columns[i], letterX, letterY);
      
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
    }
  }
}

/**
 * The core buffer generator function.
 */
export async function generateBoardBuffer(
  chess: Chess,
  options: Required<ChessImageOptions>,
  highlightedSquares: string[]
): Promise<Buffer> {
  const canvasWidth = options.size + options.padding[1] + options.padding[3];
  const canvasHeight = options.size + options.padding[0] + options.padding[2];
  
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = options.light;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const squareSize = options.size / 8;
  const paddingTop = options.padding[0];
  const paddingLeft = options.padding[3];

  const rowFn = options.flipped ? (r: number) => r + 1 : (r: number) => 8 - r;
  const colFn = options.flipped ? (c: number) => c : (c: number) => 7 - c;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const coordCol = cols[colFn(j)];
      const coordRow = rowFn(i);
      const coords = `${coordCol}${coordRow}`;

      const x = (squareSize * (7 - j)) + paddingLeft;
      const y = (squareSize * i) + paddingTop;

      if ((i + j) % 2 !== 0) {
        ctx.fillStyle = options.dark;
        ctx.fillRect(x, y, squareSize, squareSize);
      }

      if (highlightedSquares.includes(coords)) {
        ctx.fillStyle = options.highlight;
        ctx.fillRect(x, y, squareSize, squareSize);
      }

      const piece = chess.get(coords as any);
      if (piece) {
        const pieceKey = `${piece.color}${piece.type}`;
        try {
          const img = await getPieceImage(options.style, pieceKey);
          ctx.drawImage(img, x, y, squareSize, squareSize);
        } catch (e) {
          console.error(`Missing piece image for: ${pieceKey} in style ${options.style}`);
        }
      }
    }
  }

  if (options.notationStyle === 'outside') {
    ctx.lineWidth = 2;
    ctx.strokeStyle = options.dark;
    ctx.strokeRect(paddingLeft, paddingTop, options.size, options.size);
  }

  if (options.notations) {
    drawNotations(ctx, options.size, options.flipped, options.light, options.dark, options.padding, options.notationStyle, options.notationColor);
  }

  const format = options.format as string;
  const quality = options.quality as number;
  const mimeType = `image/${format}` as any;

  if (format === 'jpeg' || format === 'webp') {
    return canvas.toBuffer(mimeType, quality);
  } else {
    return canvas.toBuffer('image/png');
  }
}

/**
 * Helper to write a buffer to file securely.
 */
export async function writePNG(buffer: Buffer, filePath: string): Promise<string> {
  await fs.writeFile(filePath, buffer);
  return filePath;
}
