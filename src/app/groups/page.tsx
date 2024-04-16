"use client";
import { useRouter } from "next/navigation";
import React from "react";
import HelpButton from "~/components/HelpButton";
import NavBar from "~/components/NavBar";
import CreateNewGroupButton from "~/components/groups/CreateNewGroupButton";
import GroupList from "~/components/groups/GroupList";
import Spacer from "~/components/utility/Spacer";
import useCreateGroup from "~/hooks/groupsHooks/useCreateGroup";
import useGetGroups from "~/hooks/groupsHooks/useGetGroups";
import { useAuth } from "~/hooks/useAuth";
import client from "~/utils/supabaseClient";

const page = () => {
  useAuth();
  const [showContact, setShowContact] = React.useState(false);

  const router = useRouter();

  const { data: groups, isLoading: areGroupsLoading } = useGetGroups();
  const { mutate: createNewGroup } = useCreateGroup();

  const handleCreateNewGroup = (name: string) => {
    createNewGroup({ name, lastOrder: groups?.length || 0 });
  };

  const handleLogout = () => {
    void client.auth.signOut();
    router.replace("/login");
  };

  return (
    <main className="dark:bg-dark-background-gradient bg-background-gradient relative flex h-[100dvh] flex-col items-center justify-start">
      <NavBar />

      <GroupList groups={groups} areGroupsLoading={areGroupsLoading} />

      <Spacer />

      <div className="sticky bottom-0 flex w-full flex-row items-center justify-center gap-4 bg-[rgba(215,215,215,0.5)] px-4 py-2 backdrop-blur-md print:hidden md:bottom-0 md:px-10 md:py-5 dark:bg-opacNavbarBackground">
        <Spacer />
        <CreateNewGroupButton onCreateNewGroup={handleCreateNewGroup} />
        <HelpButton
          onLogout={handleLogout}
          setShowContact={setShowContact}
          showContact={showContact}
        />
      </div>
    </main>
  );
};

export default page;
