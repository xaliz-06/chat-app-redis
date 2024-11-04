"use client";

import { ButtonHTMLAttributes, FC, useState } from "react";
import Button from "./Button";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";

interface CustomSignOutButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

const CustomSignOutButton: FC<CustomSignOutButtonProps> = ({ ...props }) => {
  const { signOut } = useClerk();

  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  return (
    <Button
      {...props}
      variant="ghost"
      onClick={async () => {
        setIsSigningOut(true);
        try {
          signOut({ redirectUrl: "/" });
        } catch (err) {
          toast.error("There was a problem signing out");
        } finally {
          setIsSigningOut(false);
        }
      }}
    >
      {isSigningOut ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
    </Button>
  );
};

export default CustomSignOutButton;
