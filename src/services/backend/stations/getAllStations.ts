import getDrillStations from "./drillStations/getDrillStations";
import getSkillStations from "./skillStations/getSkillStations";

export default async () => {
  const skillStations = await getSkillStations();
  const drillStations = await getDrillStations();

  console.log(drillStations);
  const stations = [...skillStations, ...drillStations];

  stations.sort((a, b) => a.order - b.order);

  return stations;
};
