"use client";

import { useState } from "react";
import { z } from "zod";

import {
    SHIRT_SIZES,
    GENDERS,
    LEVELS_OF_STUDY,
    RACES_OR_ETHNICITIES,
    SCHOOLS
} from "@forge/consts/knight-hacks";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@forge/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useForm
} from "@forge/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@forge/ui/select";
import { Input } from "@forge/ui/input";
import { toast } from "@forge/ui/toast";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "@forge/ui/button";
import { genderEnum } from "@forge/db/schemas/knight-hacks";
import { shirtSizeEnum } from "@forge/db/schemas/knight-hacks";

import { api } from "~/trpc/react";
import type { InsertMember } from "@forge/db/schemas/knight-hacks";
import { InsertMemberSchema } from "@forge/db/schemas/knight-hacks";
import { ResponsiveComboBox } from "@forge/ui/responsive-combo-box";

const GenderEnum = z.enum(genderEnum.enumValues);
const ShirtSizeEnum = z.enum(shirtSizeEnum.enumValues);

export default function UpdateMemberButton({ member }: { member: InsertMember }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const utils = api.useUtils();
    const updateMember = api.member.updateMember.useMutation({
        onSuccess() {
            toast.success("Member updated successfully!");
            setIsOpen(false);
        },
        onError(opts) {
            toast.error(opts.message);
        },
        async onSettled() {
            await utils.event.invalidate();
            setIsLoading(false);
        }
    });

    const UpdateMemberSchema = InsertMemberSchema.omit({
        userId: true,
        age: true,
    }).extend({
        firstName: z.string().min(1, "Required"),
        lastName: z.string().min(1, "Required"),
        email: z.string().email("Invalid email").min(1, "Required"),
        phoneNumber: z.string().regex(/^\d{10}|\d{3}-\d{3}-\d{4}$/, "Invalid phone number"),
        dob: z.string().pipe(z.coerce.date()).transform((date) => date.toISOString()),
        githubProfileUrl: z.string()
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
        gender: GenderEnum,
        shirtSizeEnum: ShirtSizeEnum,
    });

    const form = useForm({
        schema: UpdateMemberSchema,
        defaultValues: {
            firstName: member.firstName || "",
            lastName: member.lastName || "",
            dob: member.dob || "",
            email: member.email || "",
            phoneNumber: member.phoneNumber || "",
            school: member.school,
            levelOfStudy: member.levelOfStudy,
            raceOrEthnicity: member.raceOrEthnicity,
            gender: member.gender,
            shirtSize: member.shirtSize,
            githubProfileUrl: member.githubProfileUrl ?? "",
            linkedinProfileUrl: member.linkedinProfileUrl ?? "",
            websiteUrl: member.websiteUrl ?? "",
        },
    });

    const onSubmit = form.handleSubmit((values) => {
        console.log("Form submitted ", values);
        setIsLoading(true);

        const age = new Date().getFullYear() - new Date(values.dob).getFullYear();

        updateMember.mutate({
            id: member.id,
            userId: member.userId,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            dob: values.dob,
            age,
            school: values.school,
            levelOfStudy: values.levelOfStudy,
            phoneNumber: values.phoneNumber,
            gender: values.gender,
            raceOrEthnicity: values.raceOrEthnicity,
            shirtSize: values.shirtSize,
            githubProfileUrl: values.githubProfileUrl,
            linkedinProfileUrl: values.linkedinProfileUrl,
            websiteUrl: values.websiteUrl,
        })
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <Form {...form}>
                    <form onSubmit={onSubmit}>
                        <DialogHeader className="pb-4">
                            <DialogTitle>
                                Update Member
                            </DialogTitle>
                            <DialogDescription>
                                Update member details. Confirm your changes when you're done.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-6 m-6">    
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row gap-4">
                                            <FormLabel 
                                                className="whitespace-nowrap my-auto"
                                            >
                                                First Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage className="whitespace-nowrap my-auto"/>

                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row gap-4">
                                            <FormLabel
                                                className="whitespace-nowrap my-auto"
                                            >
                                                Last Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage className="whitespace-nowrap my-auto"/>

                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row gap-4">
                                            <FormLabel
                                                className="whitespace-nowrap my-auto"
                                            >
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="johndoe@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage className="whitespace-nowrap my-auto"/>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row gap-4">
                                            <FormLabel
                                                className="whitespace-nowrap my-auto"
                                            >
                                                Phone Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="123-456-7890" {...field} />
                                            </FormControl>
                                            <FormMessage className="whitespace-nowrap my-auto"/>

                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dob"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row gap-4">
                                            <FormLabel
                                                className="whitespace-nowrap my-auto"
                                            >
                                                Date Of Birth
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage className="whitespace-nowrap my-auto"/>

                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row gap-4">
                                            <FormLabel
                                                className="whitespace-nowrap my-auto"
                                            >
                                                Gender
                                            </FormLabel>
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
                                            <FormMessage className="whitespace-nowrap my-auto"/>

                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="school"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row gap-4">
                                            <FormLabel
                                                className="whitespace-nowrap my-auto"
                                            >
                                                School
                                            </FormLabel>
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
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="levelOfStudy"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row gap-4">
                                            <FormLabel
                                                className="whitespace-nowrap my-auto"
                                            >
                                                Level Of Study
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="max-w-[300px] overflow-hidden truncate">
                                                            <SelectValue placeholder="Select level of study" /> 
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {LEVELS_OF_STUDY.map((level) => (
                                                            <SelectItem 
                                                                key={level} 
                                                                value={level} 
                                                            >
                                                                {level}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select> 
                                            </FormControl>
                                            <FormMessage className="whitespace-nowrap my-auto"/>

                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="raceOrEthnicity"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row gap-4">
                                            <FormLabel
                                                className="whitespace-nowrap my-auto"
                                            >
                                                Race/Ethnicity
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="max-w-[300px] overflow-hidden truncate">
                                                            <SelectValue placeholder="Select race/ethnicity" /> 
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {RACES_OR_ETHNICITIES.map((value) => (
                                                            <SelectItem 
                                                                key={value} 
                                                                value={value} 
                                                                className="max-w-[300px] overflow-hidden truncate"
                                                            >
                                                                {value}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select> 
                                            </FormControl>
                                            <FormMessage className="whitespace-nowrap my-auto"/>

                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="shirtSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row gap-4">
                                            <FormLabel
                                                className="whitespace-nowrap my-auto"
                                            >
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
                                                        {SHIRT_SIZES.map((shirt_size) => (
                                                            <SelectItem key={shirt_size} value={shirt_size}>
                                                                {shirt_size}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className="whitespace-nowrap"/>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">
                                {isLoading ? 
                                    <Loader2 className="animate-spin" /> : 
                                    "Update Member" 
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}