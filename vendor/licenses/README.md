# Sutro bundle provenance

- `@player.style/sutro` 0.2.1: https://github.com/muxinc/player.style — MIT (`player-style-MIT.txt`).
- `media-chrome` 4.19.3: https://github.com/muxinc/media-chrome — MIT (`media-chrome-MIT.txt`).
- Entry point: `scripts/sutro-entry.js`; locked dependencies: `package-lock.json`.
- Rebuild: `npm ci --ignore-scripts && npm run build:player` (esbuild 0.25.12).
- Output: `vendor/sutro.js`, local IIFE bundle including Chinese localization. No CDN runtime imports.
