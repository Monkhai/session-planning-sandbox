import React, { useContext, useEffect, useState } from "react";
import { set } from "zod";
import { FetchContext } from "~/context/FetchContext";

interface Props {
  stationName: string;
  setStationName: React.Dispatch<React.SetStateAction<string>>;
  stationNameRef: React.RefObject<HTMLTextAreaElement>;
}

const StationTitle = ({
  stationName,
  setStationName,
  stationNameRef,
}: Props) => {
  const { fetchStatus } = useContext(FetchContext);

  useEffect(() => {
    if (stationNameRef.current) {
      stationNameRef.current.style.height = "0"; // Reset height to shrink if text is deleted
      stationNameRef.current.style.height =
        stationNameRef.current.scrollHeight + "px";
    }
  }, [stationName]);

  return (
    <textarea
      disabled={fetchStatus === "fetching"}
      inputMode="text"
      value={stationName}
      onChange={(event) => setStationName(event.target.value)}
      ref={stationNameRef}
      className="box-border w-full resize-none bg-transparent text-xl font-semibold outline-none active:outline-none  print:w-full print:text-base print:font-medium"
      placeholder="Station Name"
    />
  );
};

export default StationTitle;
