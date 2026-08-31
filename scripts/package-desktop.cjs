const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const electronDist = path.join(rootDir, 'node_modules', 'electron', 'dist');
const outDir = path.join(rootDir, 'dist-electron', 'RentReceipt Pro-win32-x64');
const appResourcesDir = path.join(outDir, 'resources', 'app');

console.log('Packaging RentReceipt Pro desktop application...');

// Ensure output directories exist
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(appResourcesDir, { recursive: true });

// 1. Copy Electron runtime binaries
console.log('1. Copying Electron runtime binaries...');
fs.cpSync(electronDist, outDir, { recursive: true });

// 2. Rename electron.exe to RentReceipt Pro.exe
const defaultExe = path.join(outDir, 'electron.exe');
const targetExe = path.join(outDir, 'RentReceipt Pro.exe');
if (fs.existsSync(defaultExe)) {
  fs.renameSync(defaultExe, targetExe);
}

// 3. Copy application bundle into resources/app
console.log('2. Bundling application files...');

// Copy minimal package.json
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const minimalPkg = {
  name: pkg.name,
  version: pkg.version,
  main: "electron/main.cjs",
  author: pkg.author || "RentReceipt Pro",
  description: pkg.description || "RentReceipt Pro Desktop Application"
};
fs.writeFileSync(path.join(appResourcesDir, 'package.json'), JSON.stringify(minimalPkg, null, 2));

// Copy electron directory
fs.cpSync(path.join(rootDir, 'electron'), path.join(appResourcesDir, 'electron'), { recursive: true });

// Copy public directory
fs.cpSync(path.join(rootDir, 'public'), path.join(appResourcesDir, 'public'), { recursive: true });

// Copy .output if available
if (fs.existsSync(path.join(rootDir, '.output'))) {
  fs.cpSync(path.join(rootDir, '.output'), path.join(appResourcesDir, '.output'), { recursive: true });
}

// 4. Create convenient desktop launcher batch scripts
const launcherBat = `@echo off
start "" "%~dp0\\RentReceipt Pro.exe"
`;
fs.writeFileSync(path.join(outDir, 'Launch RentReceipt Pro.bat'), launcherBat);

// Top-level launcher in dist-electron
const topLauncherBat = `@echo off
start "" "%~dp0\\RentReceipt Pro-win32-x64\\RentReceipt Pro.exe"
`;
fs.writeFileSync(path.join(rootDir, 'dist-electron', 'Open RentReceipt Pro.bat'), topLauncherBat);

console.log('Packaging complete!');
console.log(`Application folder: ${outDir}`);
console.log(`Executable: ${targetExe}`);

