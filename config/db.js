const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail after 5 seconds instead of hanging
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error.message.includes('IP address') || error.message.includes('whitelist')) {
      console.error('❌ MONGODB ERROR: Your current IP is not whitelisted on Atlas.');
    } else if (error.message.includes('Authentication failed')) {
      console.error('❌ MONGODB ERROR: Invalid database credentials (check .env).');
    } else {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
    }
    
    console.log('💡 TIP: Check the "mongodb_atlas_setup.md" tutorial for step-by-step connection fixes.');
    process.exit(1);
  }
};

module.exports = connectDB;
