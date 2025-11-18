const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Konfiguration: mappe med logfiler og backend-URL
const LOG_DIR = "/path/to/logfiles";
const BACKEND_URL = "http://<SERVER_IP>:3000/api/logs";
let lastReadTimestamps = {};

// Poll interval i millisekunder
const POLL_INTERVAL = 60000;

function readNewEntries() {
  fs.readdir(LOG_DIR, (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
      const filePath = path.join(LOG_DIR, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        const lastRead = lastReadTimestamps[file] || 0;
        if (stats.mtimeMs > lastRead) {
          // Læser hele filen
          fs.readFile(filePath, "utf8", async (err, content) => {
            if (err) return;
            try {
              const entries = JSON.parse(content); // forudsætter JSON-array
              for (const entry of entries) {
                await axios.post(BACKEND_URL, entry);
              }
              lastReadTimestamps[file] = stats.mtimeMs;
            } catch (e) {
              console.error("Fejl ved parsing eller upload:", e.message);
            }
          });
        }
      });
    });
  });
}

// Start polling
setInterval(readNewEntries, POLL_INTERVAL);
console.log("Ingestion service startet, poller hver", POLL_INTERVAL, "ms");
