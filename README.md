# ⚡ chess-snap 📸

> A blazing fast, zero-dependency Node.js chess image generator powered by Napi-RS. Convert FEN, PGN, and board arrays into highly customizable, pixel-perfect PNGs, JPEGs, and WEBPs instantly.

![NPM Version](https://img.shields.io/npm/v/chess-snap)
![Node Version](https://img.shields.io/node/v/chess-snap)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Napi-RS](https://img.shields.io/badge/@napi--rs/canvas-Powered-orange)

## 📋 Table of Contents
- [🌟 Features](#-features)
- [⚙️ Requirements](#-requirements)
- [📦 Installation](#-installation)
- [🚀 Quick Start](#-quick-start)
  - [Generating an Image from FEN](#generating-an-image-from-fen)
  - [Generating it directly into a Buffer](#generating-it-directly-into-a-buffer)
- [🎨 Configuration Reference](#-configuration-reference)
- [📚 Piece Styles (Themes)](#-piece-styles-themes)
- [🧩 API Reference](#-api-reference)
- [⚠️ Important Notes](#-important-notes)
- [📝 License](#-license)

## 🌟 Features
- **Lightning Fast Native API**: Built purely on top of `@napi-rs/canvas`. Bypasses the traditional `node-canvas` Gyps compilation hassle completely on Windows/Linux/Mac.
- **Smart Memory Caching**: Re-architected rendering engine loads visual assets directly into RAM. Subsequent frame generations drop below *~1ms*. Extremely suitable for High-Traffic Discord Bots or real-time Web Servers.
- **Endless Customization**: Supports 12 premium piece themes (Neo, Merida, Game Room, Glass, Alpha...), custom HEX backgrounds, exact pixel scaling without loss of quality, and margin configurations.
- **Native Vector Notations**: Generate algebraic notations (A-H, 1-8). Supports Classic Margin placement (`outside`) or overlapping (`inside`) perfectly colored for visual contrast.
- **Multiple Output Formats**: Not only `png`, but exports seamlessly to lightweight formats like `jpeg` and `webp` bundled with adjustable `quality` compression controls.

## ⚙️ Requirements
To get the most out of `chess-snap` effortlessly, make sure your environment matches the following criteria:
- **Node.js**: Version 22.0.0 or higher native runtimes requested.
- **ES Modules**: Fully compatible with the modern JavaScript `import` ecosystem (`"type": "module"` natively mapped).

## 📦 Installation
Use your favorite package manager to install the dependency securely:
```bash
npm install chess-snap
```

## 🚀 Quick Start

### Generating an Image from FEN
Here is a comprehensive example showing how to initialize the board, load a position via FEN, highlight specific squares, and save it as a high-quality JPEG wrapper.

```javascript
import ChessImageGenerator from 'chess-snap';

async function run() {
  // 1. Initialize options
  const generator = new ChessImageGenerator({
    size: 600,                    // Total board dimension (600x600 pixels)
    style: 'game_room',           // Premium 3D piece styling suite
    flipped: false,               // Board perspective (false = White at bottom)
    notations: true,              // Draw algebraic coordinates
    notationStyle: 'outside',     // Render coordinates inside the classic outer margin
    notationColor: '#CC0000',     // (Optional) Explicitly override colored notation text 
    format: 'jpeg',               // Output engine selection
    quality: 85,                  // Image compression level (85%)
    light: '#f0d9b5',             // HEX background code for light squares
    dark: '#b58863'               // HEX background code for dark squares
  });

  // 2. Load position state asynchronously (FEN)
  await generator.loadFEN('r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 1');

  // 3. Highlight significant moves targeting the board
  generator.highlightSquares(['e4', 'e5', 'd4']);

  // 4. Paint and stream directly onto the physical environment
  await generator.generateImage('output-board.jpeg');
  console.log('Great success!');
}

run();
```

### Generating it directly into a Buffer
Perfectly streamlined for Express.js responses, Discord.js interaction attachments, and Serverless Edge functions. Bypasses disk-write overhead for absolute peak execution speed.
```javascript
import { AttachmentBuilder } from 'discord.js';

// Inside your bot command execution block...
await generator.loadPGN('1. e4 e5 2. Nf3 Nc6 3. Bc4');
const buffer = await generator.generateBuffer();

// Pipe it securely to Discord
const attachment = new AttachmentBuilder(buffer, { name: 'board.webp' });
await interaction.reply({ files: [attachment] });
```

## 🎨 Configuration Reference
When instantiating `new ChessImageGenerator(options)`, you can securely pass an object containing combinations of the following keys (all mapped and explicitly tailored for TypeScript optional inputs):

| Property        | Type | Default      | Description |
| :---            | :--- | :---           | :--- |
| `size`          | `number` | `720`          | Pixel size of the physical layout parameters confining the 8x8 squares map. |
| `padding`       | `array`  | `[0, 0, 0, 0]` | Padding margin applied exclusively outside the scope of the board bounds: `[top, right, bottom, left]`. (*Automatically bounces to `[30, 30, 30, 30]` if neglected alongside `notationStyle: outside`*). |
| `style`         | `string` | `'merida'`     | The structural graphical theme of the pieces. |
| `light`         | `string` | `'#f0d9b5'`    | Hex pattern representing standard light squares behavior. |
| `dark`          | `string` | `'#b58863'`    | Hex pattern representing standard dark squares behavior. |
| `highlight`     | `string` | `'rgba(...)'`  | Canvas mapping for active highlights across squares. Submits seamlessly to Alpha layer transparencies. |
| `flipped`       | `boolean`| `false`        | Perspective context parameter. Mutate to `true` to immediately paint the grid from Black's perspective exclusively. |
| `notations`     | `boolean`| `false`        | Check Boolean state to `true` to enforce coordinate rendering loops. |
| `notationStyle` | `string` | `'inside'`     | `'inside'`: Overlaps texts natively adjacent to the top-left boundary of overlapping squares. `'outside'`: Safely projects coordinates outwards into isolated padded zones cleanly separated by borders. |
| `notationColor` | `string` | `Auto`         | Implement a defined Hex string format targeting strictly text elements mapping. Neglecting this actively generates a Smart-Contrast algorithm based on the nearest pixel grid context. |
| `format`        | `string` | `'png'`        | Extracted image wrapper (`'png'`, `'jpeg'`, `'webp'`). |
| `quality`       | `number` | `80`           | Explicit constraint representing the dynamic image density ratio target compressing your media ranging heavily between (0 to 100). Applies only fundamentally to `.jpeg` and `.webp`. |

## 📚 Piece Styles (Themes)
Choose your favorite flavor and dynamically swap models natively! All assets are securely vectorized and fundamentally clear. The fully embedded internal library contains:
- `'alpha'` 
- `'cburnett'`
- `'cheq'`
- `'game_room'` (Iconic sleek shadows and 3D reflections)
- `'game_room_gothic'`
- `'game_room_space'`
- `'glass'` 
- `'leipzig'`
- `'merida'` (Classic gold-standard international playbook styling reference)
- `'neo'` (Minimalist, modern web layout integration standard)
- `'neo_wood'`
- `'wood'` (Hyper-realistic physical wood carved texture)

## 🧩 API Reference

* `async loadFEN(fen: string): Promise<void>`
  Instantiates the native logical architecture mapping heavily based on the classic **Forsyth-Edwards Notation (FEN)** strings securely.
* `async loadPGN(pgn: string): Promise<void>`
  Traverses through a multi-length string containing standard chess logic execution mapping based on **Portable Game Notation (PGN)** standard arrays resolving heavily toward the resulting visual representation array limit.
* `loadArray(array: string[][]): void`
  Overwrites mappings heavily utilizing an automated 8x8 iteration schema defining columns directly referencing `[['r', ...], ...]`.
* `highlightSquares(squares: string[]): void`
  Constructs targeting coordinates expecting algebraic input syntax wrapped actively within constraints mapping format directly (e.g. `['a1', 'b2']`). Generates highlighting RGBA canvas overlays safely.
* `async generateBuffer(): Promise<Buffer>`
  Sparks the Napi-RS layer internally painting an off-screen cache frame securely handing back the parsed Node.js `Buffer` environment structure ready for payload consumption natively! (Extremely critical endpoint functionality target avoiding physical disk parsing).
* `async generateImage(path: string): Promise<string>`
  Abstraction helper securely loading `generateBuffer()` and automatically executing piping parameters parsing directly towards your explicit localized system route handling file path parameters constraints implicitly saving. Backwards compatible implicitly matching `generatePNG()`.

## ⚠️ Important Notes
1. Because `chess-snap` resolves memory resources efficiently, file system manipulation requires an aggressively asynchronous layout. Priority demands explicit handling applying the `await` keyword sequentially prioritizing events correctly spanning `loadFEN()`, `loadPGN()` instances towards generation pipelines explicitly rendering endpoints.
2. Enabling boolean metrics overriding `notations: true` bound sequentially prioritizing configurations demanding explicitly `notationStyle: 'outside'` securely overrides standard spacing injecting internally bounded margins mathematically shifting standard variables actively adding `30` localized border layout limits retaining pristine visuals securely! As a result, explicitly rendering width configurations logically mutate exceeding explicitly raw values safely maintaining aspect ratios globally.

## 📝 License
This package is thoroughly Open Sourced officially enforcing mapping under strict implementation metrics aligned within the [MIT License](LICENSE).
