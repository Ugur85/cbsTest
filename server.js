const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Initialize SQLite database in the project directory
const db = new sqlite3.Database(path.join(__dirname, 'comments.db'));

db.serialize(() => {
    db.run(
        'CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, lat REAL, lng REAL, comment TEXT)'
    );
});

app.use(express.static(__dirname));

io.on('connection', socket => {
    // Send all existing comments to the newly connected client
    db.all('SELECT lat, lng, comment FROM comments', [], (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        socket.emit('existing-comments', rows);
    });

    // Save new comments to the database and broadcast to other clients
    socket.on('add-comment', data => {
        db.run(
            'INSERT INTO comments (lat, lng, comment) VALUES (?, ?, ?)',
            [data.lat, data.lng, data.comment],
            err => {
                if (err) {
                    console.error(err);
                    return;
                }
                socket.broadcast.emit('new-comment', data);
            }
        );
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
