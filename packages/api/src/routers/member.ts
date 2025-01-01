import type { TRPCRouterRecord } from "@trpc/server";

import { and, eq, isNull } from "@forge/db";
import { db } from "@forge/db/client";
import {
  Event,
  EventAttendee,
  InsertMemberSchema,
  Member,
} from "@forge/db/schemas/knight-hacks";

import { adminProcedure, protectedProcedure } from "../trpc";

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

  adminCreateMember: adminProcedure
    .input(InsertMemberSchema.omit(
      { 
        userId: true,
        age: true,
        levelOfStudy: true, 
        raceOrEthnicity: true, 
        githubProfileUrl: true,
        linkedinProfileUrl: true,
        websiteUrl: true,
      }))
    .mutation(async ({ input, ctx }) => {
      await db.insert(Member).values({
        ...input,
        userId: ctx.session.user.id,
        age: new Date().getFullYear() - new Date(input.dob).getFullYear()
      });
    }),

    adminUpdateMember: adminProcedure
    .input(InsertMemberSchema)
    .mutation(async ({ input }) => {
      if (!input.id) {
        throw new Error("Member ID is required to update a member!");
      }
      const { id, dob, ...updateData } = input;

      await db.update(Member).set({
        ...updateData,
        age: new Date().getFullYear() - new Date(dob).getFullYear(),
      }).where(eq(Member.id, id));
    }),


  deleteMember: protectedProcedure
    .input(InsertMemberSchema.pick({ id: true }))
    .mutation(async ({ input }) => {
      if (!input.id) {
        throw new Error("Member ID is required to delete a member!");
      }
      await db.delete(Member).where(eq(Member.id, input.id));
    }),

  deleteMember: protectedProcedure
    .input(InsertMemberSchema.pick({ id: true }))
    .mutation(async ({ input }) => {
      if (!input.id) throw new Error("ID is required to delete a member");
      await db.delete(Member).where(eq(Member.id, input.id));
    }),

  getMember: protectedProcedure.query(async ({ ctx }) => {
    const member = await db
      .select()
      .from(Member)
      .where(eq(Member.userId, ctx.session.user.id));

    if (member.length === 0) return null; // Can't return undefined in trpc

    return member[member.length - 1];
  }),

  // Not deleting this, but we may need to save it for hackathons router
  /*getHackathons: protectedProcedure.query(async ({ ctx }) => {
    const hackathonsToMember = await db
      .select()
      .from(Hackathon)
      .innerJoin(
        HackathonApplication,
        eq(HackathonApplication.hackathonId, Hackathon.id),
      )
      .innerJoin(Member, eq(Member.id, HackathonApplication.memberId))
      .where(
        and(
          eq(Member.userId, ctx.session.user.id),
          eq(HackathonApplication.state, "checkedin"),
        ),
      );
    const hackathonObjects = hackathonsToMember.map((item) => item.hackathon);
    return hackathonObjects;
  }), */

  getEvents: protectedProcedure.query(async ({ ctx }) => {
    const eventsToMember = await db
      .select()
      .from(Event)
      .innerJoin(EventAttendee, eq(EventAttendee.eventId, Event.id))
      .innerJoin(Member, eq(Member.id, EventAttendee.memberId))
      .where(
        and(eq(Member.userId, ctx.session.user.id), isNull(Event.hackathonId)),
      );

    const eventObjects = eventsToMember.map((item) => item.event);
    return eventObjects;
  }),

  getMembers: protectedProcedure.query(async () => {
    return db.query.Member.findMany();
  })
} satisfies TRPCRouterRecord;
