# Secure Login System

A secure login system with a modern frontend and Node.js backend featuring JWT authentication, rate limiting, and bcrypt password hashing.

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **Rate Limiting**: Prevents brute force attacks (5 attempts per 15 minutes)
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Additional security headers
- **Environment Variables**: Sensitive data kept out of source code

## 📁 Project Structure

```
project/
├── frontend/
│   └── index.html          # Login frontend
├── backend/
│   ├── server.js           # Express server
│   ├── package.json        # Dependencies
│   ├── setup.js            # Password hash generator
│   ├── .env.example        # Environment variables template
│   └── .env                # Your actual environment variables (don't commit!)
└── README.md
```

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Generate Secure Credentials

```bash
# Generate password hash and JWT secret
node setup.js yourSecurePassword123
```

This will output something like:
```
JWT_SECRET=randomBase64StringHere==
ADMIN_PASSWORD_HASH=$2b$10$randomHashHere
```

### 3. Create Environment File

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your generated values:
```env
JWT_SECRET=your-generated-jwt-secret-here
JWT_EXPIRES_IN=24h
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your-generated-hash-here
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

### 4. Start the Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Serve the Frontend

Open `frontend/index.html` in your browser or serve it with a simple HTTP server:

```bash
# Using Python (if installed)
cd frontend
python -m http.server 3000

# Using Node.js http-server (install globally first: npm install -g http-server)
cd frontend
http-server -p 3000
```

## 🔐 Default Credentials

- **Username**: `admin` (or whatever you set in ADMIN_USERNAME)
- **Password**: Whatever you used when running `setup.js`

## 🛠 API Endpoints

### Authentication
- `POST /api/login` - Login with username/password
- `POST /api/logout` - Logout (requires auth token)

### Protected Routes
- `GET /api/protected` - Example protected endpoint

### Utility
- `GET /api/health` - Health check

## 📝 Usage Examples

### Login Request
```javascript
const response = await fetch('http://localhost:3001/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'yourPassword'
  }),
});
```

### Accessing Protected Routes
```javascript
const token = localStorage.getItem('authToken');
const response = await fetch('http://localhost:3001/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🔧 Customization

### Adding More Users
Currently supports one admin user. To add multiple users:

1. Modify the login logic in `server.js`
2. Consider using a database (MongoDB, PostgreSQL, etc.)
3. Update the user validation logic

### Database Integration
To add database support:

1. Install your preferred database driver (mongoose, pg, etc.)
2. Create user schema/model
3. Update authentication logic to query database
4. Add user registration endpoint

### Additional Security
- Add email verification
- Implement password reset functionality
- Add 2FA (Two-Factor Authentication)
- Add session management
- Implement refresh tokens

## 🚨 Security Best Practices

1. **Never commit `.env` files** - Add `.env` to your `.gitignore`
2. **Use strong passwords** - Minimum 12 characters with mixed case, numbers, symbols
3. **Regular token rotation** - Consider shorter JWT expiration times
4. **HTTPS in production** - Always use SSL/TLS in production
5. **Monitor failed login attempts** - Implement logging and alerting
6. **Keep dependencies updated** - Regularly update npm packages

## 📋 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `JWT_SECRET` | Secret key for JWT signing | Yes | - |
| `JWT_EXPIRES_IN` | Token expiration time | No | `24h` |
| `ADMIN_USERNAME` | Admin username | Yes | - |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password | Yes | - |
| `PORT` | Server port | No | `3001` |
| `NODE_ENV` | Environment mode | No | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:3000` |

## 🐛 Troubleshooting

### "Missing required environment variables"
- Make sure your `.env` file exists in the backend directory
- Verify all required variables are set
- Check for typos in variable names

### "Invalid credentials" on correct password
- Verify the password hash was generated correctly
- Run: `node setup.js --verify yourPassword yourHashFromEnv`

### CORS errors
- Check that `FRONTEND_URL` matches your frontend's URL
- Ensure the frontend is served from the correct port

### Rate limiting kicks in
- Wait 15 minutes or restart the server
- Adjust rate limiting settings in `server.js` if needed

## 📄 License

MIT License - feel free to use this in your projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**⚠️ Important**: This is a basic implementation. For production use, consider additional security measures like:
- Database integration
- Advanced logging
- Monitoring and alerting
- Load balancing
- Containerization
- Regular security audits