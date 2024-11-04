"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import ShortUniqueId from "short-unique-id";

export async function checkAuthStatus() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return { success: false, message: "User not authenticated" };
  }

  // const user = await currentUser();

  // namespaces in redis
  const userMeta = `user:${userId}`;

  const existingUser = await db.hgetall(userMeta);

  if (!existingUser || Object.keys(existingUser).length === 0) {
    const uid = new ShortUniqueId({ length: 6 });
    const userTag = uid.rnd();

    await db.hset(userMeta, {
      id: user.id,
      userTag: userTag,
      email: user.emailAddresses[0].emailAddress,
      fullName: user.fullName,
      username: user.username,
      image: user.imageUrl,
    });

    // mappings
    await db.set(`email:${user.emailAddresses[0].emailAddress}`, userId);
    await db.set(`userTag:${userTag}`, userId);
  }

  return { success: true, message: "User authenticated" };
}
