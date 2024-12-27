import { redirect } from "next/navigation";

import { auth } from "@forge/auth";

import { SIGN_IN_PATH } from "~/consts";
import { api, HydrateClient } from "~/trpc/server";
import { CreateMemberForm } from "./_components/create-member-form";
import { DataTable } from "../_components/data-table";
import { memberColumns } from "./_components/member-columns";

export default async function Members() {
  // authentication
  const session = await auth();
  if (!session) {
    redirect(SIGN_IN_PATH);
  }

  const isAdmin = await api.auth.getAdminStatus();
  if (!isAdmin) {
    redirect("/");
  }

  // if (isPending) return <div>Loading...</div>;
  // if (error) return <div>Error: {error?.message}</div>
  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Member Dashboard
          </h1>
        <div>
        </div>
            <CreateMemberForm />
          <DataTable columns={memberColumns} />
        </div>
      </main>
    </HydrateClient>
  );
}
