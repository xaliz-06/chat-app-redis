import { ReactNode } from "react";

import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Icon, Icons } from "@/components/Icons";

import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import CustomSignOutButton from "@/components/ui/CustomSignOutButton";
import FriendRequestsOption from "@/components/friend-request-options";
import { fetchRedis } from "@/helpers/redis";
import { UserId } from "@/lib/utils";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import SidebarChatList from "@/components/sidebar-chat-list";

interface LayoutProps {
  children: ReactNode;
}

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

const Layout = async ({ children }: LayoutProps) => {
  const user = await currentUser();

  if (!user) notFound();

  const unseenRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${user.id}:incoming_friend_requests`
    )) as UserId[]
  ).length;

  const friends = await getFriendsByUserId(user.id);

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
        <div className="flex flex-col">
          <div className="font-semibold leading-3 text-gray-400">Overview</div>
          <ul
            role="list"
            className="mt-4 space-x-1 flex justify-start items-center"
          >
            {sidebarOptions.map((option) => {
              const Icon = Icons[option.Icon];
              return (
                <li key={option.id}>
                  <Link
                    href={option.href}
                    className="text-emerald-700 transition-all hover:text-white bg-emerald-500/20 hover:bg-emerald-500/80 group flex flex-col justify-center items-center gap-3 rounded-lg text-xs shrink-0 p-4"
                  >
                    <div className="flex w-12 h-12 items-center justify-center flex-col gap-y-1">
                      <span className="text-xs">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="truncate text-xs font-semibold">
                        {option.name}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
            <li>
              <FriendRequestsOption
                sessionId={user.id}
                initialUnseenRequestCount={unseenRequestCount}
              />
            </li>
          </ul>
        </div>
        <Separator className="my-1 mx-auto w-[90%]" />
        {friends.length > 0 ? (
          <>
            <div className="text-xl font-semibold leading-6 text-gray-400">
              Your Chats
            </div>

            <SidebarChatList friends={friends} userId={user.id} />
          </>
        ) : null}

        <div className="-mx-6 mt-auto flex items-center">
          <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-3 text-gray-900">
            <div className="relative h-8 w-8 bg-gray-50">
              <Image
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
                src={user.imageUrl || ""}
                alt="Your profile picture"
              />
            </div>
            <span className="sr-only">Your Profile</span>
            <div className="flex flex-col gap-y-1">
              <span aria-hidden="true" className="text-xl text-emerald-600">
                {user.username}
              </span>
              <span className="text-xs text-zinc-400" aria-hidden="true">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
          <CustomSignOutButton className="h-full aspect-square" />
        </div>
      </div>
      <aside className="max-h-screen container py-6 md:py-4 w-full">
        {children}
      </aside>
    </div>
  );
};

export default Layout;
