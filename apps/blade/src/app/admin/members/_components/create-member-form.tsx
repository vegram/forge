"use client";

import { z } from "zod";

import {
  GENDERS,
  SCHOOLS,
  SHIRT_SIZES,
} from "@forge/consts/knight-hacks";
import { InsertMemberSchema } from "@forge/db/schemas/knight-hacks";
import { Button } from "@forge/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@forge/ui/form";
import { Input } from "@forge/ui/input";
import { ResponsiveComboBox } from "@forge/ui/responsive-combo-box";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@forge/ui/select";
import { toast } from "@forge/ui/toast";

import { api } from "~/trpc/react";

export function CreateMemberForm() {
  const createMember = api.member.adminCreateMember.useMutation({
    onSuccess() {
      toast.success("Member created successfully!");
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
    }),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dob: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col pb-40 space-y-4"
        noValidate
        onSubmit={form.handleSubmit((values) => {
          createMember.mutate(values);
        })}
      >
        <h1 className="text-center text-2xl font-bold">Create User</h1>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row gap-4">
                <FormLabel className="whitespace-nowrap pt-3">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row gap-4">
                <FormLabel className="whitespace-nowrap pt-3">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row gap-4">
                <FormLabel className="whitespace-nowrap pt-3">Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@gmail.com" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row gap-4">
                <FormLabel className="whitespace-nowrap pt-3">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="123-456-7890" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row gap-4">
                <FormLabel className="whitespace-nowrap pt-3">
                  Date Of Birth
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row gap-4">
                <FormLabel className="whitespace-nowrap pt-3">Gender</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDERS.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row gap-4">
                <FormLabel className="whitespace-nowrap pt-3">School</FormLabel>
                <FormControl>
                  <ResponsiveComboBox
                    items={SCHOOLS}
                    renderItem={(school) => <div>{school}</div>}
                    getItemValue={(school) => school}
                    getItemLabel={(school) => school}
                    onItemSelect={(school) => field.onChange(school)}
                    buttonPlaceholder="Select school"
                    inputPlaceholder="Search for school"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shirtSize"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row gap-4">
                <FormLabel className="whitespace-nowrap pt-3">
                  Shirt Size
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shirt size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SHIRT_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-18 mx-auto" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
