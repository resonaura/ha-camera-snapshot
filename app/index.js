import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 1985;

// Load cameras list from ENV (user defines them in config.yaml)
// Example: CAMERAS='[{"name":"main","url":"http://..."}, {"name":"side","url":"http://..."}]'
const CAMERAS = JSON.parse(process.env.CAMERAS || '[]');

// Directory where snapshots will be stored
const SNAPSHOT_DIR = path.join(process.cwd(), 'snapshots');
if (!fs.existsSync(SNAPSHOT_DIR)) {
  fs.mkdirSync(SNAPSHOT_DIR);
}

// Download a single image for a given camera
async function downloadImage(name, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.buffer();
    const filePath = path.join(SNAPSHOT_DIR, `${name}.png`);
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Snapshot updated: ${name}`);
  } catch (err) {
    console.error(`❌ Error fetching ${name}:`, err.message);
  }
}

// Schedule periodic downloads for all cameras
function scheduleSnapshots() {
  setInterval(() => {
    for (const cam of CAMERAS) {
      downloadImage(cam.name, cam.url);
    }
  }, (process.env.INTERVAL || 10) * 1000); // interval in seconds, default = 10s

  // Run immediately on start
  for (const cam of CAMERAS) {
    downloadImage(cam.name, cam.url);
  }
}
scheduleSnapshots();

// Expose HTTP endpoints for each camera snapshot
for (const cam of CAMERAS) {
  app.get(`/${cam.name}`, (req, res) => {
    const filePath = path.join(SNAPSHOT_DIR, `${cam.name}.png`);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('Snapshot not found');
    }
  });
}

// Start HTTP server
app.listen(PORT, () => {
  console.log(`🚀 camera-snapshot server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  for (const cam of CAMERAS) {
    console.log(` → http://localhost:${PORT}/${cam.name}`);
  }
});
