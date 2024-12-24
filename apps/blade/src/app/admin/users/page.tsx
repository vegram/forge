"use client";

import { useState } from "react";
import { Button } from "@forge/ui/button";

import { api } from "~/trpc/react";
import { DataTable } from "../_components/data-table";

export default function Users() {
    return (
        <main className="container h-screen py-16">
            <div className="flex flex=col items-center justify-center gap-4">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                    Users
                </h1>
            </div>
        </main>
    )
}
