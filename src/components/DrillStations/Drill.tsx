import React from "react";
import DrillStationTextArea from "./DrillStationTextArea";
import DrillStationMedia from "./DrillStationMedia";
import { SignedUrls } from "~/utils/types";

interface Props {
  description: string;
  comments: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setComments: React.Dispatch<React.SetStateAction<string>>;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
  showComments: boolean;
  showMedia: boolean;
  stationMedia: SignedUrls[];
  isMediaLoading: boolean;
  editMedia: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;
  commentsRef: React.RefObject<HTMLTextAreaElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteMedia: (url: string) => void;
}

const SingleDrill = ({
  comments,
  commentsRef,
  description,
  descriptionRef,
  editMedia,
  handleDeleteMedia,
  handleFileUpload,
  inputRef,
  isMediaLoading,
  setComments,
  setDescription,
  showComments,
  showMedia,
  stationMedia,
}: Props) => {
  return (
    <div className="flex w-1/2 flex-col gap-4 print:w-3/5">
      <DrillStationTextArea
        value={description}
        setValue={setDescription}
        textAreaRef={descriptionRef}
        title="Description"
        placeholder="Enter station description"
      />

      <DrillStationTextArea
        value={comments}
        setValue={setComments}
        textAreaRef={commentsRef}
        title="Comments"
        placeholder="Enter station comments"
        showComments={showComments}
      />

      <DrillStationMedia
        mediaInputRef={inputRef}
        mediaUrls={stationMedia}
        isMediaLoading={isMediaLoading}
        editMedia={editMedia}
        onDeleteMedia={handleDeleteMedia}
        onFileUpload={handleFileUpload}
        showMedia={showMedia}
      />
    </div>
  );
};

export default SingleDrill;
