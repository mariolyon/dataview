import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { appRouter } from "./router.ts";

const t = initTRPC.create({
	transformer: superjson,
});

export const createCallerFactory = t.createCallerFactory;

export const createCaller = createCallerFactory(appRouter);
