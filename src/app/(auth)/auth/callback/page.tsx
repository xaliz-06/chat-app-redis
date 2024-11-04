"use client";

import { checkAuthStatus } from "@/actions/auth.actions";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["authCheck"],
    queryFn: async () => await checkAuthStatus(),
  });

  if (!data?.success) router.push("/sign-in");

  if (data?.success) router.push("/");

  return (
    <div className="min-h-screen grid grid-cols-1 align-middle">
      <div className="h-full flex flex-col items-center justify-center px-4 py-2">
        <div className="text-center space-y-4 pt-12 lg:pt-8">
          <h1 className="font-bold text-3xl lg:text-5xl text-[#2e2a47]">
            Redirecting...
          </h1>
          <p className="text-base text-[#7e8ca0]">
            Please wait! We are taking you to the dashboard
          </p>
        </div>
        <div className="flex items-center justify-center mt-8">
          <Loader2
            size={48}
            className="animate-spin text-muted from-foreground"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
