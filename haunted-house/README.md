# The Haunted House

A real-time cooperative, top-down browser horror game for **3–8 players**. No accounts, databases, or paid APIs required. The supplied ghost artwork is bundled locally.

## Play locally

1. Install Node.js 20 or newer.
2. Open a terminal in this folder and run `npm ci` and `npm start`.
3. Open `http://localhost:3000` in your browser. For local testing, use three separate browser tabs (or devices on your network, using your computer's LAN IP instead of localhost). Create a lobby in one tab and join its five-letter code in the other two.

## Deploy on GitHub and Render

1. Extract the ZIP. Create a new GitHub repository and upload **the contents of the `haunted-house` folder**, including `package.json`, `package-lock.json`, `server.js`, `game.js`, `render.yaml`, and `public/` at the repository root. Do not upload the ZIP as the only file.
2. In Render, choose **New → Web Service**, connect GitHub and select the repository.
3. Use Node as the runtime, leave Root Directory blank, set Build Command to `npm ci`, and Start Command to `npm start`. Choose the Free instance if available. The server automatically reads Render's `PORT` environment variable and listens on `0.0.0.0`. (Alternatively, create a Blueprint from `render.yaml`.)
4. Deploy, then open the public HTTPS URL. Share that URL with your friends. Create a lobby, send the five-letter code, and start when at least three players are connected.

## Rules and controls

- **WASD / arrow keys:** move. **E:** collect a key, hide or leave a wardrobe, or use the main door. **F:** toggle flashlight. **Esc:** settings. Mobile has on-screen direction and interaction buttons.
- Explore seven areas of the mansion, including the library, bedroom, nursery, kitchen and dining room. The ten key locations are randomized each round, and the entire team shares progress.
- The ghost patrols and pursues visible players; hiding in wardrobes prevents it from catching you. If caught, you respawn after five seconds and keep team progress.
- Once all ten keys are found, each player must interact with the main door in the entrance hall. The team wins when everyone remaining in the lobby has escaped.
- Only the host starts or restarts a game. New players may join only before a round starts. Disconnected players can reconnect within 45 seconds using the same browser tab; after that they are removed. Host can transfer to a connected player.

## Architecture and limits

Node.js HTTP server, vanilla HTML/CSS/JavaScript, Canvas 2D, Server-Sent Events for 10 Hz authoritative state updates and HTTP POST for player actions. All movement, keys, ghost AI, player count and victory conditions are validated on the server. No external dependencies. Rooms are in memory and are lost on server restarts/redeploys; this version is intended for one Render instance, not a load-balanced deployment. Render free instances can sleep and take time to wake; game sessions are not persisted. No accounts, chat, or voice chat in this first version. The ghost is computer-controlled, not player-controlled.

## Tests

Run `npm test` to verify core gameplay and the live HTTP/SSE multiplayer flow. 
