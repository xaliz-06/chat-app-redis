import React from "react";
import { notFound } from "next/navigation";

import { User } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

import { fetchRedis } from "@/helpers/redis";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Page = async () => {
  const user = await currentUser();

  if (!user) notFound();

  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${user.id}:incoming_friend_requests`
  )) as string[];
  console.log(incomingSenderIds);

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const senderUsername = (await fetchRedis(
        "hget",
        `user:${senderId}`,
        "username"
      )) as string;

      return {
        senderId,
        senderUsername,
      };
    })
  );

  return (
    <main className="mt-4 pt-8 px-8 flex flex-col justify-center">
      <Card className="w-[60vw] p-8 h-auto">
        <CardHeader>
          <h1 className="font-bold text-5xl mb-8 text-emerald-500">
            Friend Requests
          </h1>
        </CardHeader>
        <CardContent>
          {incomingFriendRequests.length > 0 ? (
            <ul>
              {incomingFriendRequests.map((request) => (
                <li
                  key={request.senderId}
                  className="flex justify-between items-center gap-4"
                >
                  <span className="text-black">{request.senderUsername}</span>
                  <div>
                    <button>Accept</button>
                    <button>Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            "NO FRIEND REQUESTS"
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default Page;
