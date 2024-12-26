"use client";

import { z } from "zod";

import {
    GENDERS,
    LEVELS_OF_STUDY,
    RACES_OR_ETHNICITIES,
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
  import type { InsertMember } from "@forge/db/schemas/knight-hacks";
  import { Pencil, Check } from "lucide-react";
  import { useState } from "react";
  import { cn } from "@forge/ui";
  import EditableInput from "../../_components/EditableInput";
  
  import { api } from "~/trpc/react";

//   export function UpdateMemberForm({ member }: { member: InsertMember }) {
export function UpdateMemberForm() {
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
            // firstName: member.firstName,
            // lastName: member.lastName,
            // email: member.email,
            // phoneNumber: member.phoneNumber,
            // dob: member.dob,
            // githubProfileUrl: member.githubProfileUrl ? member.githubProfileUrl : "",
            // linkedinProfileUrl: member.linkedinProfileUrl? member.linkedinProfileUrl : "",
            // websiteUrl: member.websiteUrl ? member.websiteUrl : "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            dob: "",
            githubProfileUrl: "",
            linkedinProfileUrl: "",
            websiteUrl: "",
        }
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => {
                    updateMember.mutate(data);
                })}
                className="flex flex-col justify-center space-y-6 pb-40"
            >
                <h1 className="text-center text-2xl font-bold">Update User</h1>
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
                                    <EditableInput 
                                        placeholder="John"
                                        {...field}
                                    />
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
                                    <EditableInput
                                        placeholder="Doe"
                                        {...field}
                                    />
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
                                <EditableInput
                                    placeholder="johndoe@gmail.com"
                                    {...field}
                                />
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
                                <EditableInput
                                    placeholder="123-456-7890"
                                    {...field}
                                />
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
                                <EditableInput
                                    type="date"
                                    {...field}
                                />
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
                                    <SelectValue placeholder="Select member's gender" />
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
                    name="raceOrEthnicity"
                    render={({ field }) => (
                        <FormItem>
                        <div className="flex flex-row gap-4">
                            <FormLabel className="whitespace-nowrap pt-3">
                            Race or Ethnicity
                            </FormLabel>
                            <FormControl>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select member's level of study" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {RACES_OR_ETHNICITIES.map((levelOfStudy) => (
                                    <SelectItem key={levelOfStudy} value={levelOfStudy}>
                                    {levelOfStudy}
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
                    name="levelOfStudy"
                    render={({ field }) => (
                        <FormItem>
                        <div className="flex flex-row gap-4">
                            <FormLabel className="whitespace-nowrap pt-3">
                            Level of Study
                            </FormLabel>
                            <FormControl>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your level of study" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {LEVELS_OF_STUDY.map((levelOfStudy) => (
                                    <SelectItem key={levelOfStudy} value={levelOfStudy}>
                                    {levelOfStudy}
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
                                buttonPlaceholder="Select your school"
                                inputPlaceholder="Search for your school"
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
                                    <SelectValue placeholder="Select your shirt size" />
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
                    <FormField
                    control={form.control}
                    name="githubProfileUrl"
                    render={({ field }) => (
                        <FormItem>
                        <div className="flex flex-row gap-4">
                            <FormLabel className="whitespace-nowrap pt-3">
                            GitHub Profile
                            </FormLabel>
                            <FormControl>
                            <Input
                                placeholder="https://github.com/knighthacks"
                                {...field}
                            />
                            </FormControl>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="linkedinProfileUrl"
                    render={({ field }) => (
                        <FormItem>
                        <div className="flex flex-row gap-4">
                            <FormLabel className="whitespace-nowrap pt-3">
                            Linkedin Profile
                            </FormLabel>
                            <FormControl>
                            <Input
                                placeholder="https://www.linkedin.com/company/knight-hacks"
                                {...field}
                            />
                            </FormControl>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                        <FormItem>
                        <div className="flex flex-row gap-4">
                            <FormLabel className="whitespace-nowrap pt-3">
                            Personal Website
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://knighthacks.org" 
                                    {...field} 
                                />
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