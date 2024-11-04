import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 align-middle">
      <div className="h-full flex flex-col items-center justify-center px-4 py-2">
        <div className="text-center space-y-4 pt-12 lg:pt-8">
          <h1 className="font-bold text-3xl lg:text-5xl text-[#2e2a47]">
            Start chatting!
          </h1>
          <p className="text-base text-[#7e8ca0]">
            Create a new account to continue to your dashboard!
          </p>
        </div>
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignUp />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2
              size={32}
              className="animate-spin text-muted from-foreground"
            />
          </ClerkLoading>
        </div>
      </div>
    </div>
  );
};

export default Page;
