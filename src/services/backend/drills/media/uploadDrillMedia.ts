import client from "~/utils/supabaseClient";
import getUserId from "../../userManagement/getUserId";

const setName = (name: string) => {
  return name.replace(/[^a-zA-Z0-9.]/g, "_");
};

export const checkIsImage = (file: File) => {
  const imageTypes = ["png", "jpg", "jpeg", "gif", "webp"];
  const fileName = setName(file.name);
  const fileExtension = fileName.split(".").pop() || "";
  return imageTypes.includes(fileExtension);
};

export default async (station_id: number, file: File) => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return;
  }

  const fileName = setName(file.name);
  const isImage = checkIsImage(file);
  if (!isImage) {
    console.error("File type not supported");
    alert("File type not supported");
    return;
  }

  try {
    const { error } = await client.storage
      .from("user-media")
      .upload(`${user_id}/drills/${station_id}/${fileName}`, file);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
