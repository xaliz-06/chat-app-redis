import { User } from "@/lib/utils";
import { fetchRedis } from "./redis";

export const getUserById = async (userId: string) => {
  const friendData = await fetchRedis("hgetall", `user:${userId}`);
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
};
