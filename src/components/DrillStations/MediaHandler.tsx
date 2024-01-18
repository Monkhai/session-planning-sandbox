import React from "react";
import { SignedUrls } from "~/utils/types";
import Loader from "../Loader";
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
      {mediaUrls.map((media: SignedUrls, index) => {
        if (media.type == "loader") {
          return (
            <div className="flex h-32 w-60 items-center justify-center">
              <Loader size="small" key={media.name + " " + index} />
            </div>
          );
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
