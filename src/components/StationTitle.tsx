import React from "react";

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
      value={stationName}
      onChange={(event) => setStationName(event.target.value)}
      ref={stationNameRef}
      className="flex min-w-10 max-w-full bg-transparent text-xl font-bold outline-none active:outline-none"
      placeholder="Station Name"
    />
  );
};

export default StationTitle;
