# ⚡ chess-snap 📸

> Một lõi tạo ảnh cờ vua siêu tốc, nhỏ gọn và mạnh mẽ, được viết 100% bằng TypeScript và Napi-RS. `chess-snap` giúp bạn xuất trạng thái ván cờ (từ FEN, PGN, Array) thành ảnh động chuẩn mực như các nền tảng Chess.com và Lichess.

![NPM Version](https://img.shields.io/npm/v/chess-snap)
![Node Version](https://img.shields.io/node/v/chess-snap)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Napi-RS](https://img.shields.io/badge/@napi--rs/canvas-Powered-orange)

## 🌟 Chức năng nổi bật

- ⚡ **Siêu Tốc Độ (Napi-RS Canvas)**: Bỏ qua hoàn toàn những rắc rối về biên dịch (gyp) của canvas truyền thống trên Windows. Engine `@napi-rs/canvas` đảm bảo mã nguồn chạy trực tiếp mọi lúc, mọi nơi tại Node 22+.
- 🧠 **Cơ chế Cache Thông Minh**: Viết lại hoàn toàn thuật toán render, đưa asset images vào RAM ngay sau lần Draw đầu tiên giúp tốc độ render các khung hình kết tiếp giảm xuống **dưới 1ms**.
- 🖌️ **Hỗ Trợ Rất Nhiều Giao Diện (Theme & Style)**: 12 bộ style quân cờ (Alpha, Neo, Game Room, Merida...) và khả năng biến hóa màu nền (Light/Dark Squares) tùy ý qua mã HEX.
- 📐 **Kiểm Soát Kích Thước & Padding**: Scale lên tới hàng nghìn pixels mà không hề vỡ hạt, kết hợp Padding margin cao cấp.
- 🔠 **Tọa độ siêu nét (Native Text Notation)**: Hỗ trợ in Vector Text A-H và 1-8. Tính năng **`notationStyle: 'outside'`** giúp bạn tạo Classic Margin (đưa tọa độ bao ngoài bàn cờ cực chuyên nghiệp) hoặc chìm bên trong như mặc định. Cùng tính năng tuỳ chỉnh màu chữ **`notationColor`**.
- 🗜️ **Hỗ Trợ PNG, JPEG, WEBP**: Không chỉ xuất ra Buffer, mà bạn có thể xuất ra trực tiếp những file nén dung lượng thấp cực tối ưu cho Web/Mobile App với tính năng `quality`.

## 📦 Cài đặt

```bash
npm install chess-snap
```

## 🚀 Hướng dẫn nhanh

Ví dụ cơ bản: Xuất file ảnh JPEG từ FEN Board State:

```javascript
import ChessImageGenerator from 'chess-snap';

// 1. Khởi tạo
const generator = new ChessImageGenerator({
  size: 600,                    // Kích thước ô cờ tổng (600x600)
  style: 'game_room',           // Bộ quân cờ bóng bẩy 3D
  flipped: false,               // Xoay bàn cờ
  notations: true,              // Hiện tọa độ
  notationStyle: 'outside',     // Bao tọa độ bên ngoài (Classic margin)
  format: 'jpeg',               // Xuất định dạng JPEG
  quality: 85                   // Giảm dung lượng ảnh
});

// 2. Load trạng thái cờ từ mã FEN
await generator.loadFEN('r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 1');

// 3. Highlight vài ô (nếu có)
generator.highlightSquares(['e4', 'e5', 'd4']);

// 4. Lưu ra ảnh
await generator.generateImage('output-board.jpeg');
```

---

## 🎨 Tùy chọn Cấu hình (Options)

Khi khởi tạo `new ChessImageGenerator(options)`, bạn có thể truyền vào các giá trị sau:

| Thuộc tính        | Kiểu dữ liệu | Mặc định           | Mô tả |
| :---              | :---     | :---               | :--- |
| `size`            | `number` | `720`              | Kích thước (pixels) của không gian chứa 64 ô cờ. |
| `padding`         | `array`  | `[0, 0, 0, 0]`     | Viền biên bàn cờ theo thứ tự: `[top, right, bottom, left]`. (*Nếu dùng `notationStyle: outside`, mặc định tự chuyển thành `[30,30,30,30]`*). |
| `style`           | `string` | `'merida'`         | Phong cách quân cờ. |
| `light`           | `string` | `'#f0d9b5'`        | Mã màu HEX của ô sáng. |
| `dark`            | `string` | `'#b58863'`        | Mã màu HEX của ô tối. |
| `highlight`       | `string` | `'rgba(235, 97, 80, 0.8)'` | Mã màu HEX / RGBA phủ lên các ô được Highlight. |
| `flipped`         | `boolean`| `false`            | Bàn cờ nhìn từ góc độ Trắng (false) hay Đen (true). |
| `notations`       | `boolean`| `false`            | Kích hoạt hiển thị tọa độ góc (A-H, 1-8). |
| `notationStyle`   | `string` | `'inside'`         | `'inside'`: Đè số lên góc trong ô cờ. `'outside'`: Kéo hẳn ra Margin viền bao cực chuẩn. |
| `notationColor`   | `string` | Tự động            | Màu của các số và chữ tọa độ. Nếu không điền, hệ thống sẽ tự động bù sáng/tối để luôn tương phản với background. |
| `format`          | `string` | `'png'`            | Định dạng ảnh xuất (`'png'`, `'jpeg'`, `'webp'`). |
| `quality`         | `number` | `80`               | Độ nén file (0-100) dùng khi xuất `'jpeg'` và `'webp'`. |

---

## 📚 Danh sách Quân cờ (Styles)

12 phong cách hiện tại được tích hợp nguyên bản, bao gồm:
- `'alpha'` 
- `'cburnett'`
- `'cheq'`
- `'game_room'` (Phong cách chơi bóng bảy 3D của Chess.com)
- `'game_room_gothic'`
- `'game_room_space'`
- `'glass'` 
- `'leipzig'`
- `'merida'` (Huyền thoại mặc định chuẩn chỉnh)
- `'neo'` (Mới mẻ, tối giản từ Chess.com design)
- `'neo_wood'`
- `'wood'`

---

## 🧩 Danh sách các hàm API (Methods)

- **`async loadFEN(fen: string)`**: Khởi tạo bàn cờ bằng Forsyth-Edwards Notation.
- **`async loadPGN(pgn: string)`**: Khởi tạo bàn cờ bằng chuỗi Portable Game Notation tiêu chuẩn với vô số chiêu thức.
- **`loadArray(array: string[][])`**: Truyền cấu hình mảng hai chiều dạng `[['r', ...], ...]` nhanh chóng.
- **`highlightSquares(squares: string[])`**: Tô sáng các ô nhất định (`['a1', 'b2']`).
- **`async generateBuffer(): Promise<Buffer>`**: Hàm mạnh nhất của thư viện để trả về `Buffer` thay vì lưu ra file (Siêu tốc). Phù hợp tuyệt vời cho các Express API, Discord Bot, Telegram Bot mà không cần thao tác đọc-ghi vào ổ cứng lãng phí RAM.
- **`async generateImage(path: string): Promise<string>`**: Tạo ảnh và lưu tự động vào bộ nhớ (Disk) theo đường dẫn.

---

> Được tái thiết và tối ưu hóa tối đa dựa trên thư viện gốc `chess-fen2img`. Tương thích tuyệt đối Node.JS 22+ (Không cần compiler N-API / Native Gyps). Đẹp hơn, gọn hơn, mãnh liệt hơn.
