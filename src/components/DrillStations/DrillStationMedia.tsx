import React, { useContext } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { FetchContext } from "~/context/FetchContext";
import { SignedUrls } from "~/utils/types";
import MediaHandler from "./MediaHandler";

interface Props {
  mediaUrls: SignedUrls[];
  mediaInputRef: React.RefObject<HTMLInputElement>;
  editMedia: boolean;
  showMedia: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteMedia: (name: string) => void;
}

const DrillStationMedia = ({
  mediaInputRef,
  mediaUrls,
  editMedia,
  showMedia,
  onFileUpload,
  onDeleteMedia,
}: Props) => {
  const { fetchStatus } = useContext(FetchContext);

  if (!showMedia) return null;

  return (
    <div className="flex flex-col gap-1 print:hidden">
      <div className=" flex flex-1 flex-row items-center gap-2">
        <p className="text-md ml-4 text-gray">Media</p>
        <button
          disabled={mediaUrls.length > 2 || fetchStatus === "fetching"}
          className={
            mediaUrls.length < 2
              ? "transition-all duration-150 active:scale-95"
              : ""
          }
          onClick={() => mediaInputRef.current?.click()}
        >
          <FaCirclePlus
            color={
              mediaUrls.length < 2 ? "var(--color-blue)" : "var(--color-gray)"
            }
            size={20}
          />
        </button>
        <input
          ref={mediaInputRef}
          type="file"
          className="hidden"
          onChange={onFileUpload}
          accept="video/*, image/*"
        />
      </div>
      <div className="flex h-[200px] w-full items-center justify-start gap-10 rounded-[10px] bg-white px-4 py-4">
        <MediaHandler
          editMedia={editMedia}
          mediaUrls={mediaUrls}
          onDeleteMedia={onDeleteMedia}
        />
      </div>
    </div>
  );
};

export default React.memo(DrillStationMedia);
