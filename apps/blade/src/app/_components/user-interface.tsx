import { redirect } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@forge/ui/tabs";

import { api } from "~/trpc/server";
import MemberDashboard from "./member-dashboard/member-dashboard";

export async function UserInterface() {
  const member = await api.member.getMember();

  // This is temporary in-place until hackathon dashboard is made
  if (!member) {
    redirect("/member/application");
  }

  return (
    <div className="flex justify-center">
      <Tabs defaultValue="Member" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="Member"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Member
          </TabsTrigger>
          <TabsTrigger
            value="Hacker"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
            disabled
          >
            Hacker (soon)
          </TabsTrigger>
        </TabsList>
        <TabsContent className="absolute left-0 w-full" value="Member">
          <MemberDashboard member={member} />
        </TabsContent>
        <TabsContent value="Hacker"></TabsContent>
      </Tabs>
    </div>
  );
}
