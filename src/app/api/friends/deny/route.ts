import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

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

    await db.srem(`user:${session.id}:incoming_friend_requests`, idToDeny);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid request payload" }),
        { status: 422 }
      );
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
