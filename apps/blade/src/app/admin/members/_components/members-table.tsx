"use client";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@forge/ui/table";
import { InsertMember } from "@forge/db/schemas/knight-hacks";

type Member = InsertMember;
type SortField = keyof Member;
type SortOrder = "asc" | "desc" | null;

export default function MemberTable() {
    return (
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            </TableBody>
        </Table>
    );
}