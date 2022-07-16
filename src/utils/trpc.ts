import { createReactQueryHooks } from "@trpc/react";

import { AppRouter } from "../server/route/app.router";

// using router (from server) export react-query hooks to the client
export const trpc = createReactQueryHooks<AppRouter>();
