# Map Comments Application

This simple app allows users to select locations on a map and leave comments. Other users connected to the app will see new comments appear in real time.

## Setup

1. Install dependencies:
   ```bash
   npm install express socket.io sqlite3
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. Open `http://localhost:3000` in your browser.

Click anywhere on the map to add a comment. Comments from all users are stored in a local SQLite database (`comments.db`) so that they persist between server restarts.
