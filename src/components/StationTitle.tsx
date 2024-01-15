import { FetchStatus } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import React, { useEffect } from "react";

interface Props {
  stationName: string;
  setStationName: React.Dispatch<React.SetStateAction<string>>;
  stationNameRef: React.RefObject<HTMLInputElement>;
}

const StationTitle = ({
  stationName,
  setStationName,
  stationNameRef,
}: Props) => {
  return (
    <input
      inputMode="text"
      value={stationName}
      onChange={(event) => setStationName(event.target.value)}
      ref={stationNameRef}
      className="w-full min-w-16 bg-transparent pr-2 text-xl font-semibold outline-none active:outline-none print:text-base print:font-medium"
      placeholder="Station Name"
    />
  );
};

export default StationTitle;
