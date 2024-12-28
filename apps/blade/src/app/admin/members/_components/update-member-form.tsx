"use client";

import { z } from "zod";

import {
    GENDERS,
    SCHOOLS,
    SHIRT_SIZES,
  } from "@forge/consts/knight-hacks";
  import { InsertMemberSchema, shirtSizeEnum } from "@forge/db/schemas/knight-hacks";
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
  import { ResponsiveComboBox } from "@forge/ui/responsive-combo-box";
  import { toast } from "@forge/ui/toast";
  import type { InsertMember } from "@forge/db/schemas/knight-hacks";
  import { Pencil, Check } from "lucide-react";
  import { useState } from "react";
  import { cn } from "@forge/ui";
  import ToggleEditInput from "../../_components/ToggleEditInput";
  
  import { api } from "~/trpc/react";

  export function UpdateMemberForm({ member, className }: 
    { member: InsertMember, className?: string }) {
    const [schoolToggle, setSchoolToggle] = useState<boolean>(true);

    const utils = api.useUtils();
    const updateMember = api.member.adminUpdateMember.useMutation({
        onSuccess() {
            toast.success("Member updated successfully!");
        },
        onError() {
            toast.error("Oops! Something went wrong. Please try again later.");
        },
        async onSettled() {
            await utils.member.invalidate();
        }
    });
    const form = useForm({
        schema: InsertMemberSchema.extend({
            // userId will be derived from the user's session on the server
            id: z.string().uuid().nonempty(),
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
            id: member.id,
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            phoneNumber: member.phoneNumber,
            dob: member.dob,
            gender: member.gender,
            school: member.school,
            shirtSize: member.shirtSize,
        }
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => {
                    updateMember.mutate({
                        ...data
                    });
                })}
                className={cn("flex flex-col justify-center space-y-6 pb-40", className)}
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
                                    <ToggleEditInput 
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
                                    <ToggleEditInput
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
                                <ToggleEditInput
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
                                <ToggleEditInput
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
                                <ToggleEditInput
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
                            <ToggleEditInput
                                placeholder="Select gender"
                                type="select"
                                items={GENDERS}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            />
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
                            <div className={cn("flex flex-row relative",
                                "w-full items-center justify-end"
                            )}>
                                <ResponsiveComboBox
                                    items={SCHOOLS}
                                    renderItem={(school) => <div>{school}</div>}
                                    getItemValue={(school) => school}
                                    getItemLabel={(school) => school}
                                    onItemSelect={(school) => field.onChange(school)}
                                    buttonPlaceholder="Select school"
                                    inputPlaceholder="Search for school"
                                    isDisabled={schoolToggle}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-4"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSchoolToggle(!schoolToggle);
                                    }}
                                >
                                    {schoolToggle && <Pencil size={16} />}
                                    {!schoolToggle && <Check size={18} />}
                                </button>
                            </div>
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
                            <ToggleEditInput
                                placeholder="Select shirt size"
                                type="select"
                                items={SHIRT_SIZES}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
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