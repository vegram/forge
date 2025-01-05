"use client";

import { z } from "zod";

import type { InsertMember } from "@forge/db/schemas/knight-hacks";
import { InsertMemberSchema } from "@forge/db/schemas/knight-hacks";
import { Form, useForm } from "@forge/ui/form";
import { toast } from "@forge/ui/toast";

import { api } from "~/trpc/react";

export function UpdateMemberForm({ member }: { member: InsertMember }) {
  const updateMember = api.member.updateMember.useMutation({
    onSuccess() {
      toast.success("Member updated successfully!");
    },
    onError() {
      toast.error("Oops! Something went wrong. Please try again later.");
    },
  });
  const form = useForm({
    schema: InsertMemberSchema.extend({
      // userId will be derived from the user's session on the server
      userId: z.undefined(),
      firstName: z.string().min(1, "Required"),
      lastName: z.string().min(1, "Required"),
      // Age will be derived from dob on the server
      age: z.undefined(),
      email: z.string().email("Invalid email").min(1, "Required"),
      phoneNumber: z
        .string()
        // validates phone number with/without dashes
        .regex(/^\d{10}|\d{3}-\d{3}-\d{4}$/, "Invalid phone number"),
      // Read from date input as string, convert and validate as date, then transform to ISO string
      dob: z
        .string()
        .pipe(z.coerce.date())
        .transform((date) => date.toISOString()),
      githubProfileUrl: z
        .string()
        .regex(/^https:\/\/.+/, "Invalid URL: Please try again with https://")
        .regex(
          /^https:\/\/github\.com\/.+/,
          "Invalid URL: Enter a valid GitHub link",
        )
        .url({ message: "Invalid URL" })
        .optional()
        .or(z.literal("")),
      linkedinProfileUrl: z
        .string()
        .regex(/^https:\/\/.+/, "Invalid URL: Please try again with https://")
        .regex(
          /^https:\/\/w?w?w?\.?linkedin\.com\/.+/,
          "Invalid URL: Enter a valid LinkedIn link",
        )
        .url({ message: "Invalid URL" })
        .optional()
        .or(z.literal("")),
      websiteUrl: z
        .string()
        .regex(
          /^https?:\/\/.+/,
          "Invalid URL: Please try again with https:// or http://",
        )
        .url({ message: "Invalid URL" })
        .optional()
        .or(z.literal("")),
    }),
    defaultValues: {
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phoneNumber: member.phoneNumber,
      dob: member.dob,
      githubProfileUrl: member.githubProfileUrl ? member.githubProfileUrl : "",
      linkedinProfileUrl: member.linkedinProfileUrl
        ? member.linkedinProfileUrl
        : "",
      websiteUrl: member.websiteUrl ? member.websiteUrl : "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          updateMember.mutate(data);
        })}
        className="flex flex-col justify-center space-y-6"
      ></form>
    </Form>
  );
}
