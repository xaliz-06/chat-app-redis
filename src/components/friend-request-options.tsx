"use client";

import { UserIcon } from "lucide-react";
import Link from "next/link";
import { FC, useState } from "react";

interface FriendRequestsOptionProps {
  initialUnseenRequestCount: number;
  sessionId: string;
}

const FriendRequestsOption: FC<FriendRequestsOptionProps> = ({
  sessionId,
  initialUnseenRequestCount,
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  );

  return (
    <Link
      href="/dashboard/requests"
      className="text-emerald-700 transition-all hover:text-white bg-emerald-500/20 hover:bg-emerald-500/80 group flex flex-col justify-center items-center gap-3 rounded-lg text-xs shrink-0 p-4"
    >
      <div className="flex w-12 h-12 items-center justify-center flex-col gap-y-1">
        <span className="text-xs">
          <UserIcon className="w-5 h-5" />
        </span>

        {unseenRequestCount > 0 ? (
          <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-emerald-800">
            {unseenRequestCount > 99 ? "99+" : unseenRequestCount}
          </div>
        ) : (
          <span className="truncate text-xs font-semibold">Requests</span>
        )}
      </div>
    </Link>
  );
};

export default FriendRequestsOption;
