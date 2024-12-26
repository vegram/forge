import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@forge/db";
import { db } from "@forge/db/client";
import { InsertMemberSchema, Member } from "@forge/db/schemas/knight-hacks";

import { protectedProcedure } from "../trpc";

export const memberRouter = {
  createMember: protectedProcedure
    .input(InsertMemberSchema.omit({ userId: true, age: true }))
    .mutation(async ({ input, ctx }) => {
      await db.insert(Member).values({
        ...input,
        userId: ctx.session.user.id,
        age: new Date().getFullYear() - new Date(input.dob).getFullYear(),
      });
    }),

  updateMember: protectedProcedure
    .input(InsertMemberSchema)
    .mutation(async ({ input }) => {
      if (!input.id) {
        throw new Error("Member ID is required to update a member!");
      }
      await db.update(Member).set(input).where(eq(Member.id, input.id));
    }),

  deleteMember: protectedProcedure
    .input(InsertMemberSchema.pick({ id: true }))
    .mutation(async ({ input }) => {
      if (!input.id) {
        throw new Error("Member ID is required to delete a member!");
      }
      await db.delete(Member).where(eq(Member.id, input.id));
    }),

  getMember: protectedProcedure.query(async ({ ctx }) => {
    const member = await db
      .select()
      .from(Member)
      .where(eq(Member.userId, ctx.session.user.id));

    return member[member.length - 1];
  }),
} satisfies TRPCRouterRecord;
