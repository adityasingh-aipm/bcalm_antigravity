#!/usr/bin/env node
// This ensures build files are always in the right place for production
const fs = require('fs');
const path = require('path');

// When running in production and dist/public exists, copy to server/public
if (process.env.NODE_ENV === 'production' || process.argv.includes('--production')) {
  const distPath = path.join(__dirname, 'dist', 'public');
  const serverPath = path.join(__dirname, 'server', 'public');
  
  if (fs.existsSync(distPath)) {
    if (!fs.existsSync(serverPath)) {
      fs.mkdirSync(serverPath, { recursive: true });
    }
    // Copy files
    const files = fs.readdirSync(distPath);
    files.forEach(file => {
      const src = path.join(distPath, file);
      const dest = path.join(serverPath, file);
      if (fs.statSync(src).isDirectory()) {
        if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true });
        fs.cpSync(src, dest, { recursive: true });
      } else {
        fs.copyFileSync(src, dest);
      }
    });
  }
}
