import ChessImageGenerator from './dist/index.js';

async function runExample() {
  console.log("Initializing chess-snap logger...");
  
  const generator = new ChessImageGenerator({
    size: 600,
    style: 'game_room',
    flipped: false,
    notations: true,
    notationStyle: 'outside',
    notationColor: '#CC0000',
    format: 'jpeg',
    quality: 80,
    light: '#f0d9b5',
    dark: '#b58863'
  });

  await generator.loadFEN('r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 1');

  generator.highlightSquares(['e4', 'e5', 'c6', 'd4']);

  const outputPath = 'output-demo.jpeg';
  console.log("Generating board image...");
  await generator.generateImage(outputPath);
  
  console.log(`Success! Board image saved at: ${outputPath}`);
}

runExample().catch(console.error);
