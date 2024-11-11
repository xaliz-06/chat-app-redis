import { getUserById } from "@/helpers/get-user-by-id";
import { fetchRedis } from "@/helpers/redis";
import { User } from "@/lib/utils";
import { messageArraySchema } from "@/lib/validations/message";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FC } from "react";

interface PageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = result.map((message) => JSON.parse(message) as Message);

    const reverseDbMessages = dbMessages.reverse();

    const messages = messageArraySchema.parse(reverseDbMessages);

    return messages;
  } catch (error) {
    console.log(error);
    notFound();
  }
}

const Page: FC<PageProps> = async ({ params }: PageProps) => {
  const { chatId } = params;

  const user = await currentUser();

  if (!user) notFound();

  const [userId_1, userId_2] = chatId.split("--");

  if (userId_1 !== user.id && userId_2 !== user.id) notFound();

  const chatPartnerId = userId_1 === user.id ? userId_2 : userId_1;
  const chatPartner = await getUserById(chatPartnerId);

  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh - 6rem)]">
      <div className="flex sm:items-center justify-between p-5 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner.image}
                alt={`${chatPartner.username}_profile_picture`}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-3xl flex items-center">
              <span className="text-emerald-600 mr-3 font-semibold">
                {chatPartner.username}
              </span>
            </div>

            <span className="text-sm text-teal-500">
              {chatPartner.fullName}
            </span>
          </div>
        </div>
      </div>

      {/* <Messages /> */}
    </div>
  );
};

export default Page;
