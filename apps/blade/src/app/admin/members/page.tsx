"use client";

import { useState } from "react";
import { Button } from "@forge/ui/button";

import { api } from "~/trpc/react";
import { DataTable } from "../_components/data-table";

export default function Members() {
    return (
        <main className="container h-screen py-16">
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-5xl text-center font-extrabold tracking-tight sm:text-[5rem]">
                    Member Dashboard
                </h1>
            </div>
        </main>
    )
}
