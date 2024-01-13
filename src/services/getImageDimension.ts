import { ImageDimensions } from "~/utils/types";

export const getIamgeDimensions = (url: string) => {
  return new Promise<ImageDimensions>((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve({ height: img.height, width: img.width });
    };
    img.onerror = () => {
      reject("Error loading image");
    };
  });
};
