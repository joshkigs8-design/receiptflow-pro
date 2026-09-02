const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function createFaviconPNG(size) {
  const png = new PNG({ width: size, height: size });

  const bgNavy = [11, 18, 32, 255];       // #0B1220
  const bgSlate = [17, 28, 46, 255];      // #111C2E
  const orange = [255, 122, 0, 255];      // #FF7A00
  const amber = [255, 176, 32, 255];      // #FFB020

  const radius = size * 0.22;
  const cx = size / 2;
  const cy = size / 2;

  // Draw squircle background
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      const dx = Math.max(0, Math.abs(x - cx) - (size / 2 - radius));
      const dy = Math.max(0, Math.abs(y - cy) - (size / 2 - radius));
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
        const t = (x + y) / (2 * size);
        const r = Math.round(bgSlate[0] * (1 - t) + bgNavy[0] * t);
        const g = Math.round(bgSlate[1] * (1 - t) + bgNavy[1] * t);
        const b = Math.round(bgSlate[2] * (1 - t) + bgNavy[2] * t);
        png.data[idx] = r;
        png.data[idx + 1] = g;
        png.data[idx + 2] = b;
        png.data[idx + 3] = 255;
      } else {
        png.data[idx + 3] = 0; // Transparent
      }
    }
  }

  // Draw Receipt Body
  const rw = size * 0.58;
  const rh = size * 0.62;
  const rx = (size - rw) / 2;
  const ry = size * 0.18;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) {
        const relY = y - ry;
        const relX = x - rx;
        const period = rw / 6;
        const wave = Math.abs((relX % period) - period / 2) / (period / 2);
        const tearLimit = rh - (1 - wave) * (size * 0.04);

        if (relY <= tearLimit) {
          const idx = (size * y + x) << 2;
          const t = relY / rh;
          const r = Math.round(amber[0] * (1 - t) + orange[0] * t);
          const g = Math.round(amber[1] * (1 - t) + orange[1] * t);
          const b = Math.round(amber[2] * (1 - t) + orange[2] * t);
          png.data[idx] = r;
          png.data[idx + 1] = g;
          png.data[idx + 2] = b;
          png.data[idx + 3] = 255;
        }
      }
    }
  }

  const linePad = rx + size * 0.08;
  const lineW1 = rw * 0.45;
  const lineW2 = rw * 0.75;
  const lineW3 = rw * 0.60;
  const lineW4 = rw * 0.68;
  const lineH = Math.max(2, size * 0.035);

  const drawRect = (px, py, w, h, col) => {
    for (let y = Math.round(py); y < Math.round(py + h); y++) {
      for (let x = Math.round(px); x < Math.round(px + w); x++) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
          const idx = (size * y + x) << 2;
          png.data[idx] = col[0];
          png.data[idx + 1] = col[1];
          png.data[idx + 2] = col[2];
          png.data[idx + 3] = col[3] ?? 255;
        }
      }
    }
  };

  drawRect(linePad, ry + size * 0.10, lineW1, lineH * 1.6, [11, 18, 32, 230]);
  drawRect(linePad, ry + size * 0.20, lineW2, lineH, [11, 18, 32, 140]);
  drawRect(linePad, ry + size * 0.27, lineW3, lineH, [11, 18, 32, 140]);
  drawRect(linePad, ry + size * 0.34, lineW4, lineH, [11, 18, 32, 140]);

  // Verified Badge Circle
  const badgeCx = rx + rw * 0.72;
  const badgeCy = ry + rh * 0.70;
  const badgeR = size * 0.12;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.sqrt((x - badgeCx) ** 2 + (y - badgeCy) ** 2);
      const idx = (size * y + x) << 2;
      if (d <= badgeR) {
        if (d >= badgeR - size * 0.02) {
          png.data[idx] = amber[0];
          png.data[idx + 1] = amber[1];
          png.data[idx + 2] = amber[2];
          png.data[idx + 3] = 255;
        } else {
          png.data[idx] = bgNavy[0];
          png.data[idx + 1] = bgNavy[1];
          png.data[idx + 2] = bgNavy[2];
          png.data[idx + 3] = 255;
        }
      }
    }
  }

  // Draw Checkmark
  const checkThick = Math.max(2, size * 0.025);
  for (let i = 0; i <= size * 0.05; i += 0.5) {
    const px1 = badgeCx - size * 0.05 + i;
    const py1 = badgeCy + i;
    drawRect(px1, py1, checkThick, checkThick, amber);
  }
  for (let i = 0; i <= size * 0.09; i += 0.5) {
    const px2 = badgeCx + i;
    const py2 = badgeCy + size * 0.05 - i * 1.4;
    drawRect(px2, py2, checkThick, checkThick, amber);
  }

  return PNG.sync.write(png);
}

function createMultiResolutionICO(pngList) {
  // pngList is array of { size, buffer }
  const count = pngList.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ICO
  header.writeUInt16LE(count, 4); // count

  let currentOffset = 6 + count * 16;
  const dirEntries = [];
  const imageBuffers = [];

  for (const item of pngList) {
    const entry = Buffer.alloc(16);
    // width & height: 256 is represented as 0
    const w = item.size >= 256 ? 0 : item.size;
    const h = item.size >= 256 ? 0 : item.size;

    entry.writeUInt8(w, 0);
    entry.writeUInt8(h, 1);
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // size of image data
    entry.writeUInt32LE(currentOffset, 12); // offset of image data

    dirEntries.push(entry);
    imageBuffers.push(item.buffer);
    currentOffset += item.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

const publicDir = path.resolve(__dirname, '..', 'public');
console.log('Generating high-resolution icons in', publicDir);

const sizes = [256, 128, 64, 48, 32, 16];
const pngList = [];

for (const s of sizes) {
  console.log(`Rendering ${s}x${s} PNG...`);
  const buf = createFaviconPNG(s);
  pngList.push({ size: s, buffer: buf });
}

// 512 for high-DPI displays
const png512 = createFaviconPNG(512);
fs.writeFileSync(path.join(publicDir, 'favicon.png'), png512);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png512);

// Multi-resolution ICO (including 256x256 for Windows NSIS/electron-builder)
const multiIco = createMultiResolutionICO(pngList);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), multiIco);

console.log('Successfully generated multi-resolution favicon.ico (up to 256x256) and favicon.png (512x512)!');

