import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import ChessImageGenerator from '../src/index.js';
import * as fs from 'fs/promises';

describe('ChessImageGenerator', () => {
  it('should instantiate properly', () => {
    const generator = new ChessImageGenerator();
    assert.ok(generator !== undefined);
    assert.strictEqual(generator.ready, false);
  });

  it('should load a FEN string', async () => {
    const generator = new ChessImageGenerator();
    await generator.loadFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    assert.strictEqual(generator.ready, true);
  });

  it('should generate a PNG buffer successfully', async () => {
    const generator = new ChessImageGenerator({ size: 400 });
    await generator.loadFEN('r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 1');
    const buffer = await generator.generateBuffer();
    
    assert.ok(buffer instanceof Buffer);
    assert.ok(buffer.length > 0);
  });

  it('should create a PNG file correctly', async () => {
    const generator = new ChessImageGenerator({
      size: 500,
      notations: true,
      flipped: true,
      light: '#f0d9b5',
      dark: '#b58863',
      style: 'alpha'
    });
    
    await generator.loadFEN('r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 1');
    generator.highlightSquares(['e4', 'e5', 'c6', 'd4']);
    
    const outputPath = './test-output.png';
    const resultPath = await generator.generatePNG(outputPath);
    
    // Check if the file exists
    const stats = await fs.stat(resultPath);
    assert.ok(stats.size > 0);
    
    // Cleanup
    await fs.unlink(resultPath);
  });
});
