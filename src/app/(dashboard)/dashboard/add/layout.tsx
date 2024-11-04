import { FC, ReactNode } from "react";
import { notFound } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface LayoutProps {
  children: ReactNode;
}

interface SidebarOptions {}

const Layout = async ({ children }: LayoutProps) => {
  const user = await currentUser();

  if (!user) notFound();

  return (
    <div className="w-full flex h-full">
      <div className="flex h-screen w-full max-w-md grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 py-4">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Image
            src="/images/logos/chatiz.svg"
            alt="Logo"
            width={32}
            height={32}
            className="h-20 w-auto"
          />
          <h2 className="text-5xl font-extrabold text-emerald-500 tracking-wide">
            CHATIZ
          </h2>
        </Link>
        <Separator className="my-1 mx-auto w-[90%]" />
        <div className="text-xl font-semibold leading-6 text-gray-400">
          Your Chats
        </div>
        <nav className="flex flex-1 col-1">
          <ul role="list" className="flex flex-1 flex-col gap-y-5">
            <li>Chat 1</li>
            <li>Chat 2</li>
            <li>Chat 3</li>
            <li>Chat 4</li>
          </ul>
        </nav>
      </div>
      <div className="h-full">{children}</div>
    </div>
  );
};

export default Layout;
