"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import HelpButton from "~/components/HelpButton";
import NavBar from "~/components/NavBar";
import AthleteList from "~/components/groups/AthleteList";
import CreateNewGroupSessionButton from "~/components/groups/CreateNewGroupSessionButton";
import CreateNewSessionButton from "~/components/groups/CreateNewGroupSessionButton";
import GroupList from "~/components/groups/GroupList";
import GroupSessionsList from "~/components/groups/GroupSessionsList";
import CreateNewAthleteButton from "~/components/groups/createNewAthleteButton";
import Spacer from "~/components/utility/Spacer";
import useCreateAthlete from "~/hooks/athletesHooks/useCreateAthlete";
import useCreateGroupSession from "~/hooks/groupSessionHooks/useCreateGroupSession";
import useGetGroupAthletes from "~/hooks/groupsHooks/useGetGroupAthletes";
import useGetGroupSessions from "~/hooks/groupsHooks/useGetGroupSessions";
import { useAuth } from "~/hooks/useAuth";
import client from "~/utils/supabaseClient";

interface Props {
  params: {
    groupId: string;
  };
}

const Session = ({ params }: Props) => {
  useAuth();
  const router = useRouter();

  const { data: athletes, isLoading: areAthletesLoading } = useGetGroupAthletes(
    Number(params.groupId),
  );

  const { data: generalSessions, isLoading: areSessionsLoading } =
    useGetGroupSessions(Number(params.groupId));

  const { mutate: createNewAthlete } = useCreateAthlete();
  const { mutate: createNewGroupSession } = useCreateGroupSession();
  const [showContact, setShowContact] = useState(false);

  const handleLogout = () => {
    void client.auth.signOut();
    router.replace("/login");
  };

  const handleCreateNewAthlete = (name: string) => {
    createNewAthlete({
      name,
      group_id: Number(params.groupId),
      lastOrder: athletes?.length || 0,
    });
  };

  const handleCreateNewGroupSession = (name: string) => {
    createNewGroupSession({
      name,
      group_id: Number(params.groupId),
      lastOrder: athletes?.length || 0,
    });
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-start bg-background dark:bg-darkBackground">
      <NavBar />
      <div className="flex w-full flex-col items-center gap-2 md:w-3/4 md:flex-row md:gap-4">
        <GroupSessionsList
          sessions={generalSessions}
          areSessionsLoading={areSessionsLoading}
        />
        <AthleteList
          athletes={athletes}
          areAthletesLoading={areAthletesLoading}
        />
      </div>
      <Spacer />

      <div className="sticky bottom-0 flex w-full flex-row items-center justify-center gap-4 bg-[rgba(215,215,215,0.5)] px-4 py-2 backdrop-blur-md print:hidden md:bottom-0 md:px-10 md:py-5 dark:bg-opacNavbarBackground">
        <Spacer />

        <div className="flex flex-row gap-4 md:gap-24">
          <CreateNewAthleteButton onCreateNewAthlete={handleCreateNewAthlete} />
          <CreateNewGroupSessionButton
            onCreateNewSession={handleCreateNewGroupSession}
          />
        </div>

        <HelpButton
          onLogout={handleLogout}
          setShowContact={setShowContact}
          showContact={showContact}
        />
      </div>
    </main>
  );
};

export default Session;
