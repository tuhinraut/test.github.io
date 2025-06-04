const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Function to generate a secure password hash
async function generatePasswordHash(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

// Function to generate a secure JWT secret
function generateJWTSecret() {
  return crypto.randomBytes(32).toString('base64');
}

// Setup function
async function setup() {
  console.log('🔐 Secure Login Setup\n');
  
  // Get password from command line argument or prompt
  const password = process.argv[2];
  
  if (!password) {
    console.log('Usage: node setup.js <your-password>');
    console.log('Example: node setup.js mySecurePassword123');
    console.log('\nThis will generate:');
    console.log('1. A bcrypt hash of your password');
    console.log('2. A secure JWT secret');
    console.log('\nAdd these to your .env file\n');
    return;
  }

  try {
    // Generate password hash
    console.log('Generating password hash...');
    const passwordHash = await generatePasswordHash(password);
    
    // Generate JWT secret
    console.log('Generating JWT secret...');
    const jwtSecret = generateJWTSecret();
    
    console.log('\n✅ Setup Complete!\n');
    console.log('Add these values to your .env file:\n');
    console.log(`JWT_SECRET=${jwtSecret}`);
    console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
    console.log('\nDon\'t forget to set your ADMIN_USERNAME as well!');
    console.log('\n⚠️  Important: Never commit your .env file to version control!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

// Verification function
async function verifyPassword(password, hash) {
  try {
    const isValid = await bcrypt.compare(password, hash);
    console.log(`Password verification: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    return isValid;
  } catch (error) {
    console.error('Verification error:', error.message);
    return false;
  }
}

// Check if this is a verification call
if (process.argv.includes('--verify')) {
  const password = process.argv[3];
  const hash = process.argv[4];
  
  if (!password || !hash) {
    console.log('Usage: node setup.js --verify <password> <hash>');
    process.exit(1);
  }
  
  verifyPassword(password, hash);
} else {
  setup();
}