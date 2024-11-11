"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import { FC, useState } from "react";

import { toast } from "sonner";
import { Check, UserPlus, X } from "lucide-react";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  userId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  userId,
}) => {
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  const router = useRouter();

  const acceptFriend = async (senderId: string) => {
    try {
      await axios.post("/api/friends/accept", { id: senderId });

      setFriendRequests((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      );

      router.refresh();
      toast.success("Friend request accepted!");
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err);
        toast.error("Please try again");
        return;
      }

      toast.error("An error occurred");
    }
  };

  const denyFriend = async (senderId: string) => {
    await axios.post("/api/friends/deny", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-base text-zinc-500">
          No friend requests. You should try adding some friends!
        </p>
      ) : (
        friendRequests.map((request) => (
          <div
            key={request.senderId}
            className="flex justify-between gap-4 items-center p-5 bg-slate-100 rounded-md hover:bg-teal-300/20 transition"
          >
            <div className="flex flex-row gap-x-4">
              <UserPlus className="w-6 h-6 text-teal-600" />
              <p className="font-medium text-lg text-emerald-500">
                {request.senderUsername}
              </p>
            </div>
            <div className="flex items-center justify-center gap-x-6">
              <button
                aria-label="accept friend"
                className="w-8 h-8 bg-emerald-600 hover:bg-emerald-700 grid place-items-center rounded-full transition hover:shadow-md"
                onClick={() => acceptFriend(request.senderId)}
              >
                <Check className="font-semibold text-white w-3/4 h-3/4" />
              </button>
              <button
                aria-label="deny friend"
                className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
                onClick={() => denyFriend(request.senderId)}
              >
                <X className="font-semibold text-white w-3/4 h-3/4" />
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
