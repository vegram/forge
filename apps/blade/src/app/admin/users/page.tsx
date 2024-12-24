import Link from "next/link";

import { HydrateClient } from "~/trpc/server";

export default function Users() {
    return (
        <HydrateClient>
            <main className="container h-screen py-16">
                <div className="flex flex=col items-center justify-center gap-4">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                        Users
                    </h1>
                </div>
            </main>
        </HydrateClient>
    )
}
