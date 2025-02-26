import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MentorList } from "@/components/users/MentorList";
import { MenteeList } from "@/components/users/MenteeList";

const Users = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <h1 className="text-3xl font-bold text-[#1a365d]">User Management</h1>
        </div>

        <div className="relative">
          <Tabs defaultValue="mentors" className="w-full">
            <TabsList>
              <TabsTrigger value="mentors">Mentors</TabsTrigger>
              <TabsTrigger value="mentees">Mentees</TabsTrigger>
            </TabsList>
            <TabsContent value="mentors">
              <MentorList />
            </TabsContent>
            <TabsContent value="mentees">
              <MenteeList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Users;
