import { router } from "@trpc/server";
import superjson from "superjson";
import { Context } from "./createContext";

// pass context and transformer to lib router function
export function createRouter() {
  return router<Context>().transformer(superjson);
}
