"use client";

import { FC, useState } from "react";
import axios, { AxiosError } from "axios";

import { CircleCheck, CircleX } from "lucide-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { addFriendEmailValidation } from "@/lib/validations/add-friend-validation";

import Button from "./ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "sonner";

type FormSchema = z.infer<typeof addFriendEmailValidation>;

const AddFriendByEmail: FC = () => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(addFriendEmailValidation),
    defaultValues: {
      email: "",
    },
  });

  const {
    formState: { errors },
    setError,
  } = form;

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendEmailValidation.parse({ email });

      await axios.post("/api/friends/add/email/", {
        email: validatedEmail.email,
      });

      setShowSuccessState(true);
      toast.success("Friend request sent!");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError("email", { message: err.message });
        toast.error("Invalid email");
        return;
      }
      if (err instanceof AxiosError) {
        console.error(err);

        setError("email", { message: err.response?.data.error });
        toast.error(err.response?.data.error);
        return;
      }

      setError("email", { message: "An error occurred" });
      toast.error("An error occurred");
    }
  };

  const onSubmit = (data: FormSchema) => {
    addFriend(data.email);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-6 max-w-sm flex flex-col gap-2"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="email"
                className="block text-lg font-medium leading-5 text-teal-600"
              >
                Add friend by E-Mail ID
              </FormLabel>

              <div className="flex flex-row gap-4 items-center mt-2">
                <FormControl className="flex items-center gap-4">
                  <Input
                    {...field}
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:leading-6"
                    placeholder="you@example.com"
                  />
                </FormControl>
                <Button variant="primary" size="default">
                  Add
                </Button>
              </div>
              {errors.email && (
                <div className="mt-1 flex flex-row gap-1 items-center">
                  <CircleX className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-600">
                    {errors.email?.message}
                  </p>
                </div>
              )}
              {showSuccessState && (
                <div className="mt-1 flex flex-row gap-1 items-center">
                  <CircleCheck className="h-4 w-4 text-green-600" />
                  <p className="text-base text-green-600">
                    Friend request sent!
                  </p>
                </div>
              )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default AddFriendByEmail;
