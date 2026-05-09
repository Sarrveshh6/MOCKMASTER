import "dotenv/config";
import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

function buildSocialProviders() {
  const socialProviders: Record<
    string,
    { clientId: string; clientSecret: string }
  > = {};

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    socialProviders.github = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    };
  }
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    socialProviders.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
  }
  if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
    socialProviders.discord = {
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    };
  }

  return Object.keys(socialProviders).length > 0 ? socialProviders : undefined;
}

const port = process.env.PORT || "5000";

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is required for Better Auth");
}

/** Same cluster/database as Mongoose; connection is established on first use. */
const mongoClient = new MongoClient(uri);
const db = mongoClient.db();

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret || secret.length < 32) {
  throw new Error(
    "BETTER_AUTH_SECRET is required and must be at least 32 characters"
  );
}

const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.CLIENT_URL ||
  `http://localhost:${port}`;

const socialProviders = buildSocialProviders();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: mongoClient,
  }),
  secret,
  baseURL,
  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:5173",
    `http://localhost:${port}`,
  ],
  emailAndPassword: {
    enabled: true,
  },
  ...(socialProviders ? { socialProviders } : {}),
});
