"use client";

import { FC, useState } from "react";
import axios, { AxiosError } from "axios";

import { CircleCheck, CircleX } from "lucide-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { addFriendTagValidation } from "@/lib/validations/add-friend-validation";

import Button from "./ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "sonner";

type FormSchema = z.infer<typeof addFriendTagValidation>;

const AddFriendByTag: FC = () => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(addFriendTagValidation),
    defaultValues: {
      tag: "",
    },
  });

  const {
    formState: { errors },
    setError,
  } = form;

  const addFriend = async (tag: string) => {
    try {
      const validatedTag = addFriendTagValidation.parse({ tag });

      await axios.post("/api/friends/add/tag", {
        tag: validatedTag.tag,
      });

      setShowSuccessState(true);
      toast.success("Friend request sent!");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError("tag", { message: err.message });
        toast.error("Invalid tag");
        return;
      }
      if (err instanceof AxiosError) {
        console.error(err);

        setError("tag", { message: err.response?.data.error });
        toast.error(err.response?.data.error);
        return;
      }

      setError("tag", { message: "An error occurred" });
      toast.error("An error occurred");
    }
  };

  const onSubmit = (data: FormSchema) => {
    addFriend(data.tag);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-6 max-w-sm flex flex-col gap-2"
      >
        <FormField
          name="tag"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="tag"
                className="block text-lg font-medium leading-5 text-teal-600"
              >
                Add friend by User Tag
              </FormLabel>

              <div className="flex flex-row gap-4 items-center mt-2">
                <FormControl className="flex items-center gap-4">
                  <Input
                    {...field}
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:leading-6"
                    placeholder="AZ8xq3"
                  />
                </FormControl>
                <Button variant="primary">Add</Button>
              </div>
              {errors.tag && (
                <div className="mt-1 flex flex-row gap-1 items-center">
                  <CircleX className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-600">{errors.tag?.message}</p>
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

export default AddFriendByTag;
