import { UseQueryResult } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import client from "~/utils/supabaseClient";
import { SkillStationType } from "~/utils/types";
import React from "react";
import SkillStation from "./SkillStation/SkillStation";

interface Props {
  stationResponse: UseQueryResult<SkillStationType[], Error>;
}

const StationResponseHandler = ({ stationResponse }: Props) => {
  const router = useRouter();
  const { data, error, isLoading } = stationResponse;

  if (isLoading) {
    return null;
  }
  if (error) {
    if (stationResponse.error.message === "No user id found") {
      console.log("redirecting");
      client.auth.signOut();
      router.push("/login");
    }
    return <div>Error: {error.message}</div>;
  }
  if (data && data.length > 0) {
    return (
      <div className="w-full  pt-4">
        {data.map((station, index) => {
          const isLast = data.length - 1 === index;
          return (
            <SkillStation key={station.id} isLast={isLast} station={station} />
          );
        })}
      </div>
    );
  }
  return null;
};

export default React.memo(StationResponseHandler);
