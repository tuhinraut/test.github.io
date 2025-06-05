# Login System with CSV Storage

A simple and secure login system using Node.js, Express, and CSV file storage. Perfect for testing and development purposes.

## 🚀 Features

- **Secure Authentication**: Uses bcrypt for password hashing and JWT for session management
- **CSV Storage**: Credentials stored in a CSV file (kept private via .gitignore)
- **Responsive UI**: Clean, mobile-friendly login interface
- **Token-based Sessions**: JWT authentication with automatic token validation
- **Protected Routes**: Dashboard accessible only after authentication
- **User Management**: Add new users via API endpoints
- **GitHub Ready**: Configured for easy deployment while keeping credentials secure

## 📁 Project Structure

```
login-backend/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules (keeps credentials private)
├── README.md             # This file
├── public/
│   └── index.html        # Frontend login page
└── data/
    └── credentials.csv   # User credentials (auto-generated, git-ignored)
```

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd login-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your preferred settings
# At minimum, change the JWT_SECRET to something secure
```

### 4. Start the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on `http://localhost:3000` (or your specified PORT).

## 🔐 Default Credentials

- **Username**: `admin`
- **Password**: `admin2911`

*Note: The credentials file is automatically created on first run with the admin user.*

## 📊 API Endpoints

### Authentication

#### `POST /api/login`
Login with username and password.

**Request:**
```json
{
  "username": "admin",
  "password": "admin2911"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": { "username": "admin" }
}
```

#### `GET /api/dashboard`
Access protected dashboard (requires JWT token).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

### User Management

#### `POST /api/users`
Create a new user (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```json
{
  "username": "newuser",
  "password": "newpassword"
}
```

### Health Check

#### `GET /api/health`
Check server status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Tokens**: Secure token-based authentication with 1-hour expiration
- **CORS Protection**: Configured to handle cross-origin requests safely
- **Input Validation**: Server-side validation for all inputs
- **Private Credentials**: CSV file is git-ignored to prevent credential exposure

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment

1. **Set Environment Variables**:
   ```bash
   export NODE_ENV=production
   export JWT_SECRET=your-super-secure-secret-key
   export PORT=80
   ```

2. **Install Dependencies**:
   ```bash
   npm install --production
   ```

3. **Start Server**:
   ```bash
   npm start
   ```

### GitHub Pages + Backend Hosting

For GitHub Pages frontend with separate backend:

1. **Frontend**: Deploy the `public/` folder to GitHub Pages
2. **Backend**: Deploy to Heroku, Railway, or similar service
3. **Update API Base**: Modify the `API_BASE` variable in `index.html`

### Heroku Deployment

```bash
# Install Heroku CLI, then:
heroku create your-app-name
heroku config:set JWT_SECRET=your-secure-secret
heroku config:set NODE_ENV=production
git push heroku main
```

## 📝 CSV File Format

The credentials are stored in `data/credentials.csv`:

```csv
username,password
admin,"$2b$10$hashedPasswordHere"
newuser,"$2b$10$anotherHashedPassword"
```

*Passwords are automatically hashed before storage.*

## 🔧 Customization

### Adding New Users Programmatically

```javascript
// Using the API
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <admin-token>'
  },
  body: JSON.stringify({
    username: 'newuser',
    password: 'newpassword'
  })
});
```

### Changing Token Expiration

In `server.js`, modify the JWT sign options:

```javascript
const token = jwt.sign(
  { username: user.username },
  JWT_SECRET,
  { expiresIn: '24h' } // Change from '1h' to desired duration
);
```

### Custom Frontend Styling

Edit the `<style>` section in `public/index.html` to customize the appearance.

## 🛡️ Security Considerations

### For Production Use:

1. **Change Default Credentials**: Update admin password immediately
2. **Secure JWT Secret**: Use a long, random string for JWT_SECRET
3. **HTTPS Only**: Deploy with SSL/TLS encryption
4. **Rate Limiting**: Consider adding login attempt limits
5. **Database Migration**: Move from CSV to proper database for better security
6. **Environment Variables**: Never commit .env files to version control

### Current Security Level:
- ✅ Password hashing (bcrypt)
- ✅ JWT token authentication  
- ✅ CORS protection
- ✅ Input validation
- ✅ Credential file privacy
- ⚠️ File-based storage (suitable for testing)
- ⚠️ No rate limiting (add for production)

## 🐛 Troubleshooting

### Common Issues:

1. **"Cannot find module" errors**: Run `npm install`
2. **Port already in use**: Change PORT in .env file
3. **Login fails**: Check console for errors, verify credentials
4. **Token expired**: Tokens expire after 1 hour, login again
5. **CORS errors**: Ensure frontend and backend origins are configured

### Debug Mode:

Set `NODE_ENV=development` in .env for detailed error messages.

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure the .env file is properly configured
4. Check that the credentials.csv file was created automatically

## 📄 License

MIT License - feel free to use this project for your testing and development needs!

---

**⚠️ Important**: This system is designed for testing and development. For production applications, consider using a proper database and additional security measures.