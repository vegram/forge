"use client";

import type { InsertMember } from "@forge/db/schemas/knight-hacks";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { DotsHorizontalIcon } from "@forge/ui";
import { Sheet, SheetContent } from "@forge/ui/sheet";
import { Button } from "@forge/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@forge/ui/dropdown-menu";
import { toast } from "@forge/ui/toast";
import { Pencil, Copy, Trash2, User } from "lucide-react";
import SortButton from "../../_components/SortButton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@forge/ui/dialog";

import { api } from "~/trpc/react";
import { UpdateMemberForm } from "./update-member-form";

export const memberColumns: ColumnDef<
    InsertMember
>[] = [
    {
        accessorKey: "firstName",
        header: ({ column }) => {
            return (
                <SortButton
                    column={column}
                    className="ml-2 h-4 w-4"
                >
                    First Name
                </SortButton>
            );
        },
        cell: ({ row }) => <div className="text-center">{row.original.firstName}</div>
    },
    {
        accessorKey: "lastName",
        header: ({ column }) => {
            return (
                <SortButton
                    column={column}
                    className="ml-2 h-4 w-4"
                >
                    Last Name
                </SortButton>
            );
        },
        cell: ({ row }) => <div className="text-center">{row.original.lastName}</div>
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <SortButton 
                    column={column}
                    className="ml-2 h-4 w-4"    
                >
                    Email
                </SortButton>
            );
        },
        cell: ({ row }) => <div className="text-center">{row.original.email}</div>
    },
    {
        accessorKey: "Copy ID",
        header: () => {
            return <div>Copy ID</div>
        },
        cell: CopyMemberID
    },
    {
        accessorKey: "Update",
        header: () => {
            return <div>Update</div>
        },
        cell: UpdateMember
    }
]

function CopyMemberID({ row }: { row: Row<InsertMember> }) {
    const member = row.original;
    
    return (
        <Button
            variant="ghost"
            onClick={async () => {
                await navigator.clipboard.writeText(member.id.toString());
                toast("Success!", {
                    description: "Member ID copied.",
                })
            }}
        >
            <span className="sr-only">Copy Member ID</span>
            <Copy size={16} />
        </Button>
    );
}

function UpdateMember({ row }: { row: Row<InsertMember> }) {
    const member = row.original;
    const [memberSheetOpen, setMemberSheetOpen] = useState<boolean>(false);

    return (
        <>
            <Button variant="ghost" onClick={() => setMemberSheetOpen(true)}>
                <span className="sr-only">Update Member</span>
                <Pencil size={16} />
            </Button>
            <Dialog
                open={memberSheetOpen}
                onOpenChange={(setMemberSheetOpen)}
            >
                <DialogContent>
                    <UpdateMemberForm member={member} />
                </DialogContent>
            </Dialog>
        </>
    )
}

// function DeleteMember({ row }: { row: Row<InsertMember> }) {

// }

function Actions({ row, }: { row: Row<InsertMember> }) {
    const member = row.original;

    const [memberSheetOpen, setMemberSheetOpen] = useState<boolean>(false);
    const [profileSheetOpen, setProfileSheetOpen] = useState<boolean>(false);

    const utils = api.useUtils();
    const deleteMember = api.member.deleteMember.useMutation({
        onSuccess: async () => {
            await utils.member.getAll.invalidate();
            toast("Member deletion success!", {
                description: "Member deleted",
            });
        },
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={async () => {
                            await navigator.clipboard.writeText(member.id.toString());
                            toast("Success!", {
                                description: "Member ID copied.",
                            })
                        }}
                    >
                        Copy Member ID
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setProfileSheetOpen(true);
                        }}
                    >
                        View Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={() => setMemberSheetOpen(true)}
                    >
                        Update Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            deleteMember.mutate(member.id);
                        }}
                    >
                        Delete Member
                    </DropdownMenuItem>
                    <Sheet
                        open={memberSheetOpen}
                        onOpenChange={setMemberSheetOpen}
                    >
                        <SheetContent>
                            <UpdateMemberForm member={member} />
                        </SheetContent>
                    </Sheet>
                    <Sheet
                        open={profileSheetOpen}
                        onOpenChange={setProfileSheetOpen}
                    >
                        <SheetContent>
                            Hi
                        </SheetContent>
                    </Sheet>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}