import { FC } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AddFriendByEmail from "@/components/add-friend-by-email";
import AddFriendByTag from "@/components/add-friend-by-tag";

const page: FC = () => {
  return (
    <main className="mt-4 pt-8 px-8 flex flex-col justify-center">
      <Card className="w-[60vw] p-8 h-auto">
        <CardHeader>
          <h1 className="font-bold text-5xl mb-8 text-emerald-500">
            Add a friend
          </h1>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="flex flex-col justify-center">
            <TabsList className="grid w-[30%] grid-cols-2 bg-teal-300/30 text-emerald-800">
              <TabsTrigger value="email">By Email</TabsTrigger>
              <TabsTrigger value="tag">By Tag</TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="pt-8 px-2">
              <AddFriendByEmail />
            </TabsContent>
            <TabsContent value="tag" className="pt-8 px-2">
              <AddFriendByTag />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
};

export default page;
