"use client";

import { FC, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { chatHrefConstructor, User } from "@/lib/utils";
import Image from "next/image";

interface SidebarChatListProps {
  friends: User[];
  userId: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, userId }) => {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id;
        }).length;

        return (
          <li
            key={friend.id}
            className="flex justify-between items-center py-3 px-5 bg-slate-100 rounded-md hover:bg-teal-300/20 transition"
          >
            <a
              href={`/dashboard/chat/${chatHrefConstructor(userId, friend.id)}`}
              className="flex flex-row items-center w-full justify-between"
            >
              <div className="flex flex-row gap-x-3 items-center">
                <div className="relative h-8 w-8">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={friend.image || ""}
                    alt="Your profile picture"
                  />
                </div>
                <p className="text-emerald-500 text-xl font-semibold">
                  {friend.username}
                </p>
              </div>
              <div>
                {unseenMessagesCount > 0 ? (
                  <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-md">
                    {unseenMessagesCount}
                  </div>
                ) : null}
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
