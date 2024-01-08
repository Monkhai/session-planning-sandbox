import { UseQueryResult } from "@tanstack/react-query";
import useDeleteStation from "~/hooks/useDeleteStation";
import { Station } from "~/utils/types";
import StationComponent from "./Station";

interface Props {
  stationResponse: UseQueryResult<Station[], Error>;
}

const StationResponseHandler = ({ stationResponse }: Props) => {
  const { data, error, isLoading } = stationResponse;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (data) {
    return (
      <div className="w-3/6">
        {data.map((station) => {
          return <StationComponent key={station.id} station={station} />;
        })}
      </div>
    );
  }
  return null;
};

export default StationResponseHandler;
