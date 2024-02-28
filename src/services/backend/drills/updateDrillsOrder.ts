import updateDrill from "~/services/backend/drills/updateDrill";
import { DrillType } from "~/utils/types";

export default async (drills: DrillType[], session_id: string) => {
  try {
    const updatedDrills = Promise.all(
      drills.map(async (drill, index) => {
        const newDrill = await updateDrill({
          description: drill.description,
          name: drill.name,
          order: index + 1,
          comments: drill.comments,
          drill_id: drill.id,
          drillOfStationId: drill.drillOfStationId,
          duration: drill.duration,
          show_duration: drill.show_duration,
          show_comments: drill.show_comments,
          show_media: drill.show_media,
          show_edit_media: drill.show_edit_media,
          station_id: drill.station_id,
          session_id,
        });
        if (!newDrill) {
          throw new Error("No data returned from drills");
        }

        return newDrill;
      }),
    );

    return updatedDrills;
  } catch (error) {
    throw error;
  }
};
