const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

// Generate a random JWT secret key
const generateJWTSecretKey = () => {
    return crypto.randomBytes(32).toString('hex'); // 32 bytes = 256 bits
};

// SQLite3 database connection
const db = new sqlite3.Database(':memory:');

// Express setup and middleware
const app = express();
app.use(bodyParser.json());

// Create users table
db.serialize(() => {
    db.run(`CREATE TABLE Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password_hash TEXT
    )`);

    // Insert sample users
    const insertUserStmt = db.prepare('INSERT INTO Users (username, password_hash) VALUES (?, ?)');
    const passwordHash1 = bcrypt.hashSync('password1', 10); // Hash the password
    const passwordHash2 = bcrypt.hashSync('password2', 10); // Hash the password
    insertUserStmt.run('john_doe', passwordHash1);
    console.log("hshrf",passwordHash1);
    insertUserStmt.run('jane_smith', passwordHash2);
    insertUserStmt.finalize();

    // Create tasks table
    db.run(`CREATE TABLE Tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        status TEXT,
        assignee_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(assignee_id) REFERENCES Users(id)
    )`);

    // Insert sample tasks
    const insertTaskStmt = db.prepare('INSERT INTO Tasks (title, description, status, assignee_id) VALUES (?, ?, ?, ?)');
    insertTaskStmt.run('Task 1', 'Description of Task 1', 'pending', 1); // Assigned to user with ID 1
    insertTaskStmt.run('Task 2', 'Description of Task 2', 'completed', 2); // Assigned to user with ID 2
    insertTaskStmt.finalize();
});

// Generate JWT secret key
const JWT_SECRET = generateJWTSecretKey();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

// Routes for user authentication
// Routes for user authentication
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if username or password is missing
    console.log(username);
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if password meets the required criteria (e.g., minimum length)
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Check if the username already exists in the database
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (row) {
            // If a user with the same username exists, return an error
            return res.status(400).json({ error: 'Username already exists' });
        }

        // If the username is available, proceed with registration
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword], (err) => {
            if (err) {
                return res.status(400).json({ error: 'Failed to register user' });
            }

            // Log the user data after successful registration
            console.log('User registered successfully:');
            console.log('Username:', username);
            console.log('Password Hash:', hashedPassword);

            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
        if (!row) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const validPassword = await bcrypt.compare(password, row.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ username: row.username }, JWT_SECRET);
        res.json({ token });
        console.log(token);
    });
});

// CRUD operations for tasks

// Create a new task
app.post('/tasks', verifyToken, (req, res) => {
    const { title, description, status, assignee_id } = req.body;
    db.run('INSERT INTO tasks (title, description, status, assignee_id) VALUES (?, ?, ?, ?)', [title, description, status, assignee_id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ id: this.lastID, title, description, status, assignee_id });
    });
});

// Retrieve all tasks
app.get('/tasks', verifyToken, (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(rows);
    });
});

// Retrieve a specific task by ID
app.get('/tasks/:id', verifyToken, (req, res) => {
    const taskId = req.params.id;
    db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(row);
    });
});

// Update a specific task by ID
app.put('/tasks/:id', verifyToken, (req, res) => {
    const taskId = req.params.id;
    const { title, description, status, assignee_id } = req.body;
    db.run('UPDATE tasks SET title = ?, description = ?, status = ?, assignee_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [title, description, status, assignee_id, taskId], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task updated successfully' });
    });
});

// Delete a specific task by ID
app.delete('/tasks/:id', verifyToken, (req, res) => {
    const taskId = req.params.id;
    db.run('DELETE FROM tasks WHERE id = ?', [taskId], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
