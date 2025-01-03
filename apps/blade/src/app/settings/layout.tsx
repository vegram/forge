import Link from "next/link";

import { ArrowLeftIcon, cn } from "@forge/ui";
import { buttonVariants } from "@forge/ui/button";
import { Separator } from "@forge/ui/separator";

import { SIDEBAR_NAV_ITEMS, SIGN_IN_PATH } from "~/consts";
import { SidebarNav } from "./_components/sidebar-nav";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="space-y-6 p-10 pb-16 md:block">
        <Link
          href={SIGN_IN_PATH}
          className={cn(buttonVariants({ variant: "link" }), "!px-0")}
        >
          <ArrowLeftIcon className="mr-1" />
          back to home
        </Link>
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={SIDEBAR_NAV_ITEMS} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
