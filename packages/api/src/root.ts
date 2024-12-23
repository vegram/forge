import { authRouter } from "./routers/auth";
import { memberRouter } from "./routers/member";
import { paymentRouter } from "./routers/payment";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  payment: paymentRouter,
  member: memberRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
