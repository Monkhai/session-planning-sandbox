import Image from "next/image";
import React, { Suspense } from "react";
import { SignedUrls } from "~/utils/types";
import ImageComponent from "./ImageComponent";
import VideoComponent from "./VideoComponent";
import Loader from "../Loader";

interface Props {
  editMedia: boolean;
  mediaUrls: SignedUrls[];
  onDeleteMedia: (name: string) => void;
}

const MediaHandler = ({ editMedia, mediaUrls, onDeleteMedia }: Props) => {
  return (
    <>
      {mediaUrls.map((media: SignedUrls) => {
        if (media.type == "loader") {
          return <Loader key={media.name} />;
        } else if (media.type == "image") {
          return (
            <ImageComponent
              key={media.name}
              editMedia={editMedia}
              media={media}
              onDeleteMedia={onDeleteMedia}
            />
          );
        } else {
          return (
            <VideoComponent
              key={media.name}
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
