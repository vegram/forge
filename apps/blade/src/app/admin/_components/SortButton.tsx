"use client";

import { useState } from "react";
import { Button } from "@forge/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export default function SortButton(
    { column, children, className }: 
    { column: unknown, children?: string, className?: string }) {
    const [asc, setAsc] = useState<boolean>(false);
    const [desc, setDesc] = useState<boolean>(false);

    return (
        <Button
            variant="ghost"
            onClick={() => {
                if (!asc && !desc) {
                    setAsc(true);
                } else {
                    setAsc(!asc);
                    setDesc(!desc);
                }
                column.toggleSorting(column.getIsSorted() === "asc");
            }}
        >
            {children}
            {(!asc && !desc) && <ArrowUpDown className={className} />}
            {asc && <ArrowUp className={className} />}
            {desc && <ArrowDown className={className} />}
        </Button>
    );
}