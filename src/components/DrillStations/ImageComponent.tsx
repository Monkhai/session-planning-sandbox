import Image from "next/image";
import React, { useState } from "react";
import { IoMdRemoveCircle } from "react-icons/io";
import { SignedUrls } from "~/utils/types";

interface Props {
  media: SignedUrls;
  editMedia: boolean;
  onDeleteMedia: (name: string) => void;
}

const ImageComponent = ({ editMedia, media, onDeleteMedia }: Props) => {
  const [showBigImage, setShowBigImage] = useState<boolean>(false);
  return (
    <div
      key={media.url}
      className="flex flex-col items-center justify-center gap-4"
    >
      <Image
        onClick={() => setShowBigImage(true)}
        className="h-32 w-60 cursor-pointer rounded-[10px] border-black object-cover"
        src={media.url}
        alt="Image describing a drill"
        width={media.dimensions.width}
        height={media.dimensions.height}
      />
      {editMedia && (
        <button
          className="transition-all duration-150 active:scale-95"
          onClick={() => onDeleteMedia(media.name)}
        >
          <IoMdRemoveCircle color={"red"} size={24} />
        </button>
      )}
      {showBigImage && (
        <div
          onClick={() => setShowBigImage(false)}
          className="fixed inset-0 bottom-0 left-0 z-10 flex items-center justify-center bg-seperatorSecondary"
        >
          <Image
            className="h-4/5 w-4/5 rounded-[10px] object-contain"
            src={media.url}
            alt="Image describing a drill"
            width={media.dimensions.width}
            height={media.dimensions.height}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(ImageComponent);
