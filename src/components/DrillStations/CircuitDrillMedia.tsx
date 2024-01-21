import React from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { SignedUrls } from "~/utils/types";
import Loader from "../Loader";
import MediaHandler from "./MediaHandler";

interface Props {
  mediaUrls: SignedUrls[] | undefined;
  editMedia: boolean;
  showMedia: boolean;
  onDeleteMedia: (name: string) => void;
  isMediaLoading: boolean;
}

const CircuitDrillMedia = ({
  mediaUrls,
  editMedia,
  showMedia,
  onDeleteMedia,
  isMediaLoading,
}: Props) => {
  if (!showMedia) return null;

  if (isMediaLoading) {
    return (
      <div className="flex flex-1 flex-col gap-1 print:hidden">
        <div className=" flex flex-1 flex-row items-center gap-2">
          <p className="text-md ml-4 text-gray">Media</p>
        </div>
        <div className="flex h-[200px] w-full items-center justify-center gap-10 rounded-[10px] bg-white px-4 py-4 dark:bg-darkSecondaryBackground">
          <Loader />
        </div>
      </div>
    );
  }

  if (!mediaUrls) return null;

  return (
    <div className="flex flex-1 flex-col gap-1 print:hidden">
      <div className="flex max-h-[200px] min-h-[60px] w-full items-center justify-start gap-10 rounded-[10px] bg-white px-4 py-4 dark:bg-darkSecondaryBackground">
        {mediaUrls.length > 0 ? (
          <MediaHandler
            editMedia={editMedia}
            mediaUrls={mediaUrls}
            onDeleteMedia={onDeleteMedia}
          />
        ) : (
          <p className="text-xl text-gray dark:text-darkTextInput">Media</p>
        )}
      </div>
    </div>
  );
};

export default React.memo(CircuitDrillMedia);
