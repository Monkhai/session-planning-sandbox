"use client";
import Link from "next/link";
import CreateNewSessionButton from "~/components/CreateNewSessionButton";
import Loader from "~/components/Loader";
import Spacer from "~/components/utility/Spacer";
import useCreateSession from "~/hooks/sessionsHooks/useCreateSession";
import useGetSessions from "~/hooks/sessionsHooks/useGetSessions";

const page = () => {
  const { data: sessions, isLoading } = useGetSessions();
  const { mutate: createNewSession } = useCreateSession();

  const handleCreateNewSessions = (name: string) => {
    createNewSession({ name: name, lastOrder: sessions?.length || 0 });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <main className="relative flex flex-col items-center justify-start bg-background dark:bg-darkBackground">
      <div className="flex h-svh">
        {sessions &&
          sessions.map((session) => (
            <Link key={session.id} href={`/sessions/${session.id}`}>
              {session.name}
            </Link>
          ))}
      </div>

      <Spacer />

      <div className="dark:bg-opacNavbarBackground sticky bottom-0 flex w-full flex-row items-center justify-center gap-4 bg-[rgba(215,215,215,0.5)] px-4 py-2 backdrop-blur-md print:hidden md:bottom-0 md:px-10 md:py-5">
        <CreateNewSessionButton onCreateNewSession={() => {}} />
      </div>
    </main>
  );
};

export default page;
