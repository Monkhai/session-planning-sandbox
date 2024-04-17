import {
  getImageDimensions,
  getVideoDimensions,
} from "~/services/getImageDimension";
import client from "~/utils/supabaseClient";
import { SignedUrls } from "~/utils/types";
import getUserId from "../../userManagement/getUserId";

const getAllMediaFromStation = async (station_id: number) => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return [];
  }

  try {
    const { data, error } = await client.storage
      .from("user-media")
      .list(`${user_id}/drills/${station_id}`);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export default async (station_id: number): Promise<SignedUrls[]> => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return [];
  }

  try {
    const media = await getAllMediaFromStation(station_id);

    const signedUrls: (SignedUrls | undefined)[] = await Promise.all(
      media.map(async (file) => {
        if (file.name === ".emptyFolderPlaceholder") return undefined;
        const { data: signedUrl, error } = await client.storage
          .from("user-media")
          .createSignedUrl(`${user_id}/drills/${station_id}/${file.name}`, 120);

        if (error) {
          console.error(error, "error getting signed url");
          return {} as SignedUrls;
        }

        if (file.metadata.mimetype.split("/")[0] === "image") {
          try {
            const dimensions = await getImageDimensions(signedUrl.signedUrl);
            const fileType: string = file.metadata.mimetype.split("/")[0];
            return {
              url: signedUrl.signedUrl,
              type: fileType,
              dimensions: dimensions,
              name: file.name,
            };
          } catch (error) {
            return undefined;
          }
        } else {
          const dimenstions = await getVideoDimensions(signedUrl.signedUrl);

          const fileType: string = file.metadata.mimetype.split("/")[0];
          return {
            url: signedUrl.signedUrl,
            type: fileType,
            dimensions: dimenstions,
            name: file.name,
          };
        }
      }),
    );

    return signedUrls.filter((url) => url !== undefined) as SignedUrls[];
  } catch (error) {
    throw error;
  }
};
