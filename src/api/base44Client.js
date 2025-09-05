import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client without forcing auth at startup to avoid null login-info calls
export const base44 = createClient({
  appId: "68a5443499673f8245d72d50",
  requiresAuth: false
});
