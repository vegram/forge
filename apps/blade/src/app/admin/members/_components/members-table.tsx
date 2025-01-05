"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@forge/ui/table";
import { Input } from "@forge/ui/input";
import SortButton from "../../_components/SortButton";
import { Label } from "@forge/ui/label";

import { Button } from "@forge/ui/button";

import UpdateMemberButton from "./update-member";
import DeleteMemberButton from "./delete-member";
import DuesToggleButton from "./dues-toggle";
import ClearDuesButton from "./clear-dues";

import { api } from "~/trpc/react";
import { Search } from "lucide-react";
import type { InsertMember } from "@forge/db/schemas/knight-hacks";

type Member = InsertMember;
type SortField = keyof Member;
type SortOrder = "asc" | "desc" | null;

export default function MemberTable() {
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: members } = api.member.getMembers.useQuery();
    const { data: duesPayingStatus } = api.member.getDuesPayingMembers.useQuery();
    const duesMap = new Map();

    for (const status of duesPayingStatus ?? []) {
        duesMap.set(status.id);
    }

    const filteredMembers = (members ?? []).filter((member) => 
        Object.values(member).some((value) => {
            if (value === null) return false;
            return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        }),
    );

    const sortedMembers = [...filteredMembers].sort((a, b) => {
        if (!sortField || sortOrder === null) return 0;
        if (a[sortField] == null || b[sortField] == null) return 0;
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });


    return (
        <div>
            <div className="flex items-center justify-between gap-2 border-b pb-4">
                <div className="relative w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <div>
                    <ClearDuesButton />
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">
                            <SortButton 
                                field="firstName"
                                label="First Name"
                                sortField={sortField}
                                sortOrder={sortOrder}
                                setSortField={setSortField}
                                setSortOrder={setSortOrder}
                            />
                        </TableHead>
                        <TableHead className="text-center">
                            <SortButton 
                                    field="lastName"
                                    label="Last Name"
                                    sortField={sortField}
                                    sortOrder={sortOrder}
                                    setSortField={setSortField}
                                    setSortOrder={setSortOrder}
                            />
                        </TableHead>
                        <TableHead className="text-center">
                            <Label>Phone Number</Label>
                        </TableHead>
                        <TableHead>
                            <SortButton 
                                    field="email"
                                    label="Email"
                                    sortField={sortField}
                                    sortOrder={sortOrder}
                                    setSortField={setSortField}
                                    setSortOrder={setSortOrder}
                            />
                        </TableHead>
                        <TableHead className="text-center">
                            <Label>Dues Paying?</Label>
                        </TableHead>
                        <TableHead className="text-center">
                            <Label>Dues Toggle</Label>
                        </TableHead>
                        <TableHead className="text-center">
                            <Label>Update</Label>
                        </TableHead>
                        <TableHead className="text-center">
                            <Label>Delete</Label>
                        </TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedMembers.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell className="font-medium text-center">
                                {member.firstName}
                            </TableCell>
                            <TableCell className="font-medium text-center">
                                {member.lastName}
                            </TableCell>
                            <TableCell className="font-medium text-center">
                                {member.phoneNumber}
                            </TableCell>
                            <TableCell className="font-medium">
                                {member.email}
                            </TableCell>
                            <TableCell className="font-medium text-center">
                                {duesMap.has(member.id) ? "Yes" : "No"}
                            </TableCell>
                            <TableCell className="text-center">
                                {/* <Button onClick={() => console.log(duesMap)}>
                                    yo
                                </Button> */}
                                <DuesToggleButton 
                                    member={member} 
                                    status={duesMap.has(member.id)} 
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <UpdateMemberButton member={member} />
                            </TableCell>
                            <TableCell className="text-center">
                                <DeleteMemberButton member={member} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}