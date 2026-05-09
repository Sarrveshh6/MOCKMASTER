const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { createApp } = require('./app');

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    const authMod = await import('./lib/auth.ts');
    const { auth } = authMod.default || authMod;
    const { toNodeHandler } = await import('better-auth/node');
    const betterAuthHandler = toNodeHandler(auth);
    const app = createApp(betterAuthHandler);

    app.listen(PORT, () => {
      console.log(`✅ MOCKMASTER Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
