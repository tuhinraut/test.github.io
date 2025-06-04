# JWT Secret - Use a strong, random string (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# JWT Token Expiration
JWT_EXPIRES_IN=24h

# Admin Credentials
ADMIN_USERNAME=admin
# This should be a bcrypt hash of your password (see setup instructions)
ADMIN_PASSWORD_HASH=$2b$10$example.hash.here

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Optional: Database URL (if you decide to use a database later)
# DATABASE_URL=your-database-connection-string