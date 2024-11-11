import { User } from "@/lib/utils";
import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  const friendIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];

  const friends: User[] = await Promise.all(
    friendIds.map(async (friendId) => {
      const friendData = await fetchRedis("hgetall", `user:${friendId}`);
      const friendEntries = [];
      for (let i = 0; i < friendData.length; i += 2) {
        friendEntries.push([friendData[i], friendData[i + 1]]);
      }

      const friendObject = Object.fromEntries(friendEntries) as Record<
        string,
        string
      >;

      // Map to the `User` type
      return {
        fullName: friendObject.fullName || "",
        id: friendObject.id || "",
        image: friendObject.image || "",
        userTag: friendObject.userTag || "",
        username: friendObject.username || "",
        email: friendObject.email || "",
      } as User;
    })
  );

  return friends;
};
