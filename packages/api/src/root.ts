import { authRouter } from "./routers/auth";
import { duesPaymentRouter } from "./routers/dues-payment";
import { memberRouter } from "./routers/member";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  duesPayment: duesPaymentRouter,
  member: memberRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
