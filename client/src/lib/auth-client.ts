import { createAuthClient } from "better-auth/react";

/**
 * With the Vite dev proxy (`/api` → Express), same-origin requests hit Better Auth at `/api/auth/*`.
 * Set `VITE_BETTER_AUTH_URL` if the auth API lives on another origin (e.g. production API URL).
 */
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL ?? "",
});
