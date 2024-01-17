import Image from "next/image";
import React, { Suspense } from "react";
import { SignedUrls } from "~/utils/types";
import ImageComponent from "./ImageComponent";
import VideoComponent from "./VideoComponent";

interface Props {
  editMedia: boolean;
  mediaUrls: SignedUrls[];
  onDeleteMedia: (name: string) => void;
}

const MediaHandler = ({ editMedia, mediaUrls, onDeleteMedia }: Props) => {
  return (
    <>
      {mediaUrls.map((media: SignedUrls) => {
        if (media.type == "image") {
          return (
            <ImageComponent
              key={media.url}
              editMedia={editMedia}
              media={media}
              onDeleteMedia={onDeleteMedia}
            />
          );
        } else {
          return (
            <VideoComponent
              key={media.url}
              editMedia={editMedia}
              media={media}
              onDeleteMedia={onDeleteMedia}
            />
          );
        }
      })}
    </>
  );
};

export default React.memo(MediaHandler);
