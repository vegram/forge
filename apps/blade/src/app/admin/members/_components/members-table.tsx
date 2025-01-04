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

import { api } from "~/trpc/react";
import { Search } from "lucide-react";
import { InsertMember } from "@forge/db/schemas/knight-hacks";

type Member = InsertMember;
type SortField = keyof Member;
type SortOrder = "asc" | "desc" | null;

export default function MemberTable() {
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: members } = api.member.getMembers.useQuery();

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
            <div className="flex items-center justify-between gap-10 border-b pb-4">
                <div className="relative w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <SortButton 
                                field="firstName"
                                label="First Name"
                                sortField={sortField}
                                sortOrder={sortOrder}
                                setSortField={setSortField}
                                setSortOrder={setSortOrder}
                            />
                        </TableHead>
                        <TableHead>
                            <SortButton 
                                    field="lastName"
                                    label="Last Name"
                                    sortField={sortField}
                                    sortOrder={sortOrder}
                                    setSortField={setSortField}
                                    setSortOrder={setSortOrder}
                            />
                        </TableHead>
                        <TableHead>
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
                        <TableHead>
                            <Label>Dues Paying?</Label>
                        </TableHead>
                        <TableHead className="text-right">
                            <Label>Update</Label>
                        </TableHead>
                        <TableHead className="text-right">
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}