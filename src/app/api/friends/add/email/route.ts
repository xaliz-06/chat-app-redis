import { fetchRedis } from "@/helpers/redis";
import { db } from "@/lib/db";
import { addFriendEmailValidation } from "@/lib/validations/add-friend-validation";
import { currentUser } from "@clerk/nextjs/server";

// get user by email
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendEmailValidation.parse({
      email: body.email,
    });

    const idToAdd = (await fetchRedis("get", `email:${emailToAdd}`)) as string;

    if (!idToAdd) {
      return new Response(JSON.stringify({ error: "Does not exist" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const session = await currentUser();

    // if user is not authenticated
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // if user is trying to add self
    if (idToAdd === session.id) {
      return new Response(JSON.stringify({ error: "Cannot add self" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // if user already added
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.id
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new Response(JSON.stringify({ error: "Already added" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // if user is already friends
    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${session.id}:friends`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyFriends) {
      return new Response(JSON.stringify({ error: "Already friends" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // valid request
    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.id);

    return new Response(JSON.stringify({ error: "Friend request sent" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      return new Response("Invalid request payload", { status: 422 });
    }
    // Return an error response
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
