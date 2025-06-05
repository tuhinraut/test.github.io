const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Path to credentials file
const CREDENTIALS_FILE = path.join(__dirname, 'data', 'credentials.csv');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize credentials file if it doesn't exist
async function initializeCredentials() {
    if (!fs.existsSync(CREDENTIALS_FILE)) {
        const hashedPassword = await bcrypt.hash('admin2911', 10);
        const csvContent = `username,password\nadmin,"${hashedPassword}"\n`;
        fs.writeFileSync(CREDENTIALS_FILE, csvContent);
        console.log('Credentials file created with default admin user');
    }
}

// Read credentials from CSV
function readCredentials() {
    return new Promise((resolve, reject) => {
        const credentials = [];
        if (!fs.existsSync(CREDENTIALS_FILE)) {
            resolve(credentials);
            return;
        }
        
        fs.createReadStream(CREDENTIALS_FILE)
            .pipe(csv())
            .on('data', (row) => {
                credentials.push(row);
            })
            .on('end', () => {
                resolve(credentials);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Verify JWT token middleware
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

// Routes

// Serve login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }
        
        const credentials = await readCredentials();
        const user = credentials.find(cred => cred.username === username);
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        const token = jwt.sign(
            { username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: { username: user.username }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Protected dashboard endpoint
app.get('/api/dashboard', verifyToken, (req, res) => {
    res.json({
        success: true,
        message: `Welcome to the dashboard, ${req.user.username}!`,
        user: req.user
    });
});

// Add new user endpoint (protected)
app.post('/api/users', verifyToken, async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }
        
        const credentials = await readCredentials();
        const existingUser = credentials.find(cred => cred.username === username);
        
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: 'User already exists' 
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserRow = `${username},"${hashedPassword}"\n`;
        
        fs.appendFileSync(CREDENTIALS_FILE, newUserRow);
        
        res.json({
            success: true,
            message: 'User created successfully',
            user: { username }
        });
        
    } catch (error) {
        console.error('User creation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Endpoint not found' 
    });
});

// Initialize and start server
async function startServer() {
    try {
        await initializeCredentials();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();