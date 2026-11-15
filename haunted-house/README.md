# The Haunted House

A real-time cooperative, first-person 3D browser horror game for **1–8 players**. No accounts, databases, or paid APIs required. The supplied ghost artwork is bundled locally.

## Play locally

1. Install Node.js 20 or newer.
2. Open a terminal in this folder and run `npm ci` and `npm start`.
3. Open `http://localhost:3000` in your browser. Create a lobby and start immediately to test solo. To test multiplayer, use separate browser tabs or devices and join the five-letter code before starting.

## Deploy on GitHub and Render

**Updating the existing `dandan1022/horror-game` repository:** replace the files inside its existing `haunted-house` folder (do not create a second nested folder). Render Root Directory: `haunted-house`; Build Command: `npm ci`; Start Command: `npm start`. If Root Directory is blank, use `cd haunted-house && npm ci` and `cd haunted-house && npm start` instead.

1. Extract the ZIP. Create a new GitHub repository and upload **the contents of the `haunted-house` folder**, including `package.json`, `package-lock.json`, `server.js`, `game.js`, `render.yaml`, and `public/` at the repository root. Do not upload the ZIP as the only file.
2. In Render, choose **New → Web Service**, connect GitHub and select the repository.
3. Use Node as the runtime, leave Root Directory blank, set Build Command to `npm ci`, and Start Command to `npm start`. Choose the Free instance if available. The server automatically reads Render's `PORT` environment variable and listens on `0.0.0.0`. (Alternatively, create a Blueprint from `render.yaml`.)
4. Deploy, then open the public HTTPS URL. Share that URL with your friends. Create a lobby, send the five-letter code, and start with one to eight connected players. Solo play uses the same ten keys, ghost, and escape objective.

## Rules and controls

- **WASD:** move. **Mouse:** click game to lock pointer and look; alternatively drag the view or use arrow keys to look. **E:** collect a key, hide or leave a wardrobe, or use the main door. **F:** toggle flashlight. **Esc:** settings. Mobile has on-screen movement and interaction buttons; drag the view to look.
- Explore seven areas of the mansion, including the library, bedroom, nursery, kitchen and dining room. The ten key locations are randomized each round, and the entire team shares progress.
- The ghost patrols and pursues visible players; hiding in wardrobes prevents it from catching you. If caught, you respawn after five seconds and keep team progress.
- Once all ten keys are found, each player must interact with the main door in the entrance hall. The team wins when everyone remaining in the lobby has escaped.
- Only the host starts or restarts a game. New players may join only before a round starts. Disconnected players can reconnect within 45 seconds using the same browser tab; after that they are removed. Host can transfer to a connected player.

## Architecture and limits

Node.js HTTP server, vanilla HTML/CSS/JavaScript, native WebGL 3D and Web Audio, Server-Sent Events for 10 Hz authoritative state updates and HTTP POST for player actions. All movement, keys, ghost AI, player count and victory conditions are validated on the server. No external dependencies. Rooms are in memory and are lost on server restarts/redeploys; this version is intended for one Render instance, not a load-balanced deployment. Render free instances can sleep and take time to wake; game sessions are not persisted. No accounts, chat, or voice chat in this version. The ghost is computer-controlled, not player-controlled.

## 3D and audio

The mansion is real-time first-person WebGL geometry, with floor, ceilings, walls, furnishings, 3D player avatars and collectible keys. The supplied ghost is a camera-facing textured sprite in the 3D world. Original procedural sound effects use Web Audio: atmospheric drone, footsteps, heartbeat, creaks, key chime and a capture sting. Audio unlocks after a click or tap; volume is adjustable in Settings. WebGL must be enabled in the browser. Desktop mouse lock may not be available on all browsers; drag and arrow-key look are alternatives.

## Tests

Run `npm test` to verify core gameplay and the live HTTP/SSE multiplayer flow. 
