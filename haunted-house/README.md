# The Haunted House — v3.0 True 3D

A browser-based first-person cooperative horror prototype, built with Three.js/WebGL 2, Node.js and real WebSockets. This is a complete source project, not a static image, top-down game or raycast fake-3D renderer.

## Deploy to your existing Render service

1. Extract the ZIP. In your existing GitHub repository `dandan1022/horror-game`, replace the contents of the `haunted-house` directory with the contents of this ZIP's `haunted-house` directory. Do not create `haunted-house/haunted-house`. Remove old `public` files that are no longer included (old renderers etc.). If you retain the old package-lock, npm install will reconcile it; preferably delete the old lock and commit the new one after running npm install locally.
2. Render > horror-game > Settings > Build & Deploy:
   - Branch: `main`
   - Root Directory: `haunted-house`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Runtime: Node; Node 22 is specified in package.json.
3. Save and select Manual Deploy > Deploy latest commit. Open the public service URL after the health check passes. Force refresh if you still see v2.

The server installs `three` and `ws` from npm and serves the engine locally; no browser CDN is required. The `public/assets` folder contains the texture files and user-supplied ghost art. No database, API key, Python runtime or external audio download is required. On Render, one instance is required for in-memory lobby sharing; restarts close all rooms. A free instance may sleep and take time to wake.

## Run locally (Mac or Windows with Node.js 22)

```sh
cd haunted-house
npm install
npm test
npm start
```
Open http://localhost:3000. Use two browser tabs with different names to test multiplayer. `npm test` runs nine game/geometry checks and one WebSocket integration test (the integration test requires installed npm dependencies). Do not double-click `public/index.html`; the Node server is necessary.

## Controls

WASD move, mouse look (click scene to capture pointer; drag or arrow keys also work), Shift sprint, C/Control crouch, E interact/collect/open or close a door/escape, H hide, F flashlight, Escape settings. On touchscreens use the on-screen movement/actions and drag to look. Audio begins after a click/tap.

Create a lobby with a five-letter code, share it with friends, and start alone or with up to seven friends. Keys are shared, ghost positions and room doors are authoritative server state, and caught players return to the entrance with collected keys preserved. Collect ten keys across the four levels and return to the double front doors at the west end of the central entrance hall. All active players must escape.

## House map / navigation

Four traversable levels: basement, ground floor, upper floor and attic. The stairwell is east of the main hall; enter it through the doors at the far ends of the eastern rooms if the middle doorway is blocked by stairs. Each stair flight climbs from its north end to its south end; alternate stair bays connect each level. Walk to a landing to turn around and descend. A room door opens with E; the main exit unlocks only once all ten keys are found.

Ground: living room, dining room, kitchen, study. Upper: master bedroom, guest bedroom, bathroom, children's room. Basement: storage, laundry, boiler room, workshop. Attic: storage, old nursery, archive, trunk room. Closets throughout, hide behind the living room sofa or under upper-floor beds. H toggles hiding when nearby; the camera moves to the hiding location. The ghost can traverse stairs and chase exposed players.

## Source and assets

- `server.js`: HTTP static server, WebSocket lobbies and snapshots.
- `game.js`: authoritative movement, ghost pathfinding, doors, hiding, keys, escaping.
- `public/world.js`: shared level geometry, prop placement, collision and stair motion.
- `public/house.js`: genuine Three.js scene, perspective camera, furniture meshes, material maps, dynamic lighting/shadows and model animation. Static geometry is batched by material/level.
- `public/app.js`: menu, game input, multiplayer client, HUD and settings.
- `public/audio.js`: generated ambience, spatial footsteps, creaks, whispers, heartbeat, pickup and encounter audio using Web Audio.
- `public/assets`: original 1024 px color/bump/roughness maps and supplied ghost image. `make-textures.py` is optional offline regeneration tooling (requires Pillow and numpy); not needed to play.

## Visual quality and limitations

This is a true-3D prototype with original procedural textures and modeled furniture, not an AAA photorealistic asset pack or a recreation of Phasmophobia/Resident Evil. The sole supplied reference is the ghost image; the house follows the written interior description. PBR materials, baked color/bump/roughness maps, environment-map reflections, PCF soft shadows on the local ceiling light and flashlight, and adjustable brightness are included. There is no screen-space ambient occlusion, ray-traced reflection or professionally scanned model library. The ghost incorporates the provided image as a translucent accent to a 3D mesh; audio is synthesized rather than recorded. The front exit ends the game rather than opening an outdoor map. There is no jumping, voice chat or persistent account system.

WebGL 2 and hardware acceleration are required. Use the Low graphics setting on older hardware. If the engine fails to load or the graphics context is lost, the game displays an error instead of silently showing a blank world. The previous 2D fallback has intentionally been removed. The new gameplay/geometry tests passed in the authoring environment; dependency downloads were blocked there, so real browser rendering and the WebSocket integration test were not executed there. Test those on your Mac after installation or deployment; do not assume a successful Render build proves the client works.
