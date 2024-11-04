"use client";

import Button from "@/components/ui/Button";
import { SignedIn, SignOutButton, useUser } from "@clerk/nextjs";

export default function Home() {
  // await db.set("hello", "hello");

  // const data = await db.get("hello");
  // console.log(data);

  const { isSignedIn, user } = useUser();

  console.log(isSignedIn, user);

  return (
    <div className="text-red-500">
      <Button>Click me</Button>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
    </div>
  );
}
