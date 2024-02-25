import { AthleteWithOrder } from "~/utils/types";
import updateAthlete from "./updateAthlete";

export default async (athletes: AthleteWithOrder[]) => {
  try {
    const updatedAthletes = Promise.all(
      athletes.map(async (athlete, index) => {
        if (athlete.order !== index + 1) {
          const newAthlete = await updateAthlete(
            athlete.id,
            athlete.name,
            index + 1,
          );

          if (!newAthlete) {
            throw new Error("No data returned from athletes");
          }

          return newAthlete;
        } else {
          return athlete;
        }
      }),
    );

    return updatedAthletes;
  } catch (error) {
    throw error;
  }
};
