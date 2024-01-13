import { ImageDimensions } from "~/utils/types";

export const getImageDimensions = (url: string) => {
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

export const getVideoDimensions = (url: string) => {
  return new Promise<ImageDimensions>((resolve, reject) => {
    const video = document.createElement("video");
    video.src = url;
    video.onloadedmetadata = () => {
      resolve({ height: video.videoHeight, width: video.videoWidth });
    };
    video.onerror = () => {
      reject("Error loading video");
    };
  });
};
