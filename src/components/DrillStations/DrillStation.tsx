import Image from "next/image";
import React, { use, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { IoMdRemoveCircle } from "react-icons/io";
import useDeleteDrillStation from "~/hooks/useDeleteDrillStation";
import useUpdateDrillStation from "~/hooks/useUpdateDrillStation";
import useUploadMedia from "~/hooks/useUploadMedia";
import { convertDurationToString } from "~/services/DurationFunctions";
import { drillStationType } from "~/utils/types";
import Spacer from "../utility/Spacer";
import DrillStationHeader from "./DrillStationHeader";
import useDeleteMedia from "~/hooks/useDeleteMedia";
import StationBottomBorder from "../SkillStation/StationBottomBorder";

interface Props {
  station: drillStationType;
  isLast: boolean;
}

const DrillStation = ({ station, isLast }: Props) => {
  const stationNameRef = React.useRef<HTMLInputElement>(null);
  const [stationName, setStationName] = React.useState<string>("");
  const [showSettingsModal, setShowSettingsModal] =
    React.useState<boolean>(false);
  const [duration, setDuration] = React.useState<string>("00:00:00");
  const [durationString, setDurationString] = React.useState<
    string | undefined
  >();
  const [showDuration, setShowDuration] = React.useState<boolean>(false);
  const [comments, setComments] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [hideDurationPicker, setHideDurationPicker] = React.useState(true);
  const [showMedia, setShowMedia] = React.useState<boolean>(false);
  const [showComments, setShowComments] = React.useState<boolean>(false);
  const [editMedia, setEditMedia] = React.useState<boolean>(false);
  const [showBigImage, setShowBigImage] = React.useState<boolean>(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const commentsRef = React.useRef<HTMLTextAreaElement>(null);

  const { mutate: updateDrillStation } = useUpdateDrillStation();
  const { mutate: deleteDrillStation } = useDeleteDrillStation();
  const { mutate: uploadMedia } = useUploadMedia();
  const { mutate: deleteMedia } = useDeleteMedia();

  const handleToggleDuration = (show: boolean) => {
    setShowDuration(show);
    updateDrillStation({
      duration: duration,
      comments: comments,
      despcription: description,
      name: stationName,
      station_id: station.id,
      show_duration: show,
      show_comments: showComments,
      show_media: showMedia,
      show_edit_media: editMedia,
    });
  };

  const handleDeleteStation = () => {
    deleteDrillStation(station.id);
  };

  const handleDeleteMedia = (name: string) => {
    deleteMedia({ name, station_id: station.id });
  };

  const handleDurationChange = (newDuration: string) => {
    setDuration(newDuration);
    updateDrillStation({
      duration: newDuration,
      comments: comments,
      despcription: description,
      name: stationName,
      station_id: station.id,
      show_duration: showDuration,
      show_comments: showComments,
      show_media: showMedia,
      show_edit_media: editMedia,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        uploadMedia({ station_id: station.id, file: file });
      } else {
        alert("no file found");
      }
    }
  };

  useEffect(() => {
    setDuration(station.duration);
  }, [station.duration]);

  useEffect(() => {
    setShowDuration(station.show_duration);
  }, [station.show_duration]);

  useEffect(() => {
    setStationName(station.name);
  }, [station.name]);

  useEffect(() => {
    setComments(station.comments);
  }, [station.comments]);

  useEffect(() => {
    setDescription(station.description);
  }, [station.description]);

  useEffect(() => {
    setShowMedia(station.show_media);
  }, [station.show_media]);

  useEffect(() => {
    setShowComments(station.show_comments);
  }, [station.show_comments]);

  useEffect(() => {
    setEditMedia(station.show_edit_media);
  }, [station.show_edit_media]);

  useEffect(() => {
    const newDurationString = convertDurationToString(duration);
    if (newDurationString) {
      if (newDurationString[0] == "0") {
        setDurationString("");
        setDuration("00:00:00");
      } else {
        setDurationString(newDurationString);
      }
    } else {
      setDurationString("");
    }
  }, [duration]);

  useEffect(() => {
    const handleBlur = () => {
      if (
        stationName !== station.name ||
        duration !== station.duration ||
        comments !== station.comments ||
        description !== station.description ||
        showDuration !== station.show_duration ||
        showComments !== station.show_comments ||
        showMedia !== station.show_media
      ) {
        updateDrillStation({
          duration: duration,
          comments: comments,
          despcription: description,
          name: stationName,
          station_id: station.id,
          show_duration: showDuration,
          show_comments: showComments,
          show_media: showMedia,
          show_edit_media: editMedia,
        });
      }
    };

    const nameElement = stationNameRef.current;
    if (nameElement) {
      nameElement.addEventListener("blur", handleBlur);
    }

    const descriptionElement = descriptionRef.current;
    if (descriptionElement) {
      descriptionElement.addEventListener("blur", handleBlur);
    }

    const commentsElement = commentsRef.current;
    if (commentsElement) {
      commentsElement.addEventListener("blur", handleBlur);
    }

    return () => {
      if (nameElement) {
        nameElement.removeEventListener("blur", handleBlur);
      }
      if (descriptionElement) {
        descriptionElement.removeEventListener("blur", handleBlur);
      }
      if (commentsElement) {
        commentsElement.removeEventListener("blur", handleBlur);
      }
    };
  }, [
    stationName,
    station,
    duration,
    comments,
    description,
    showDuration,
    showComments,
    showMedia,
  ]);

  const handleToggleComments = (show: boolean) => {
    setShowComments(show);
    updateDrillStation({
      duration: duration,
      comments: comments,
      despcription: description,
      name: stationName,
      station_id: station.id,
      show_duration: showDuration,
      show_comments: show,
      show_media: showMedia,
      show_edit_media: editMedia,
    });
  };

  const handleToggleShowMedia = (show: boolean) => {
    setShowMedia(show);
    updateDrillStation({
      duration: duration,
      comments: comments,
      despcription: description,
      name: stationName,
      station_id: station.id,
      show_duration: showDuration,
      show_comments: showComments,
      show_media: show,
      show_edit_media: editMedia,
    });
  };

  const handleToggleEditMedia = (show: boolean) => {
    setEditMedia(show);
    updateDrillStation({
      duration: duration,
      comments: comments,
      despcription: description,
      name: stationName,
      station_id: station.id,
      show_duration: showDuration,
      show_comments: showComments,
      show_media: showMedia,
      show_edit_media: show,
    });
  };

  //---------------------------------------------
  //---------------------------------------------
  //---------------------------------------------

  return (
    <div className="relative flex w-full flex-row px-10 py-2 print:px-0">
      <div className="flex flex-1 px-2">
        <DrillStationHeader
          editMedia={editMedia}
          onToggleShowComments={handleToggleComments}
          onToggleShowMedia={handleToggleShowMedia}
          onToggleEditMedia={handleToggleEditMedia}
          showComments={showComments}
          showMedia={showMedia}
          duration={duration}
          durationString={durationString}
          stationName={stationName}
          stationNameRef={stationNameRef}
          setStationName={setStationName}
          showSettingsModal={showSettingsModal}
          setShowSettingsModal={setShowSettingsModal}
          showDuration={showDuration}
          onToggleDuration={handleToggleDuration}
          hideDurationPicker={hideDurationPicker}
          handleDeleteStation={handleDeleteStation}
          handleDurationChange={handleDurationChange}
          setHideDurationPicker={setHideDurationPicker}
        />
      </div>
      <div className="flex w-1/2 flex-col gap-4 print:w-3/5">
        <div className="flex flex-col gap-1">
          <p className="text-md ml-4 text-gray print:text-xs">Description</p>
          <div className="flex w-full rounded-[10px] bg-white p-4">
            <textarea
              ref={descriptionRef}
              value={description ? description : ""}
              onChange={(e) => setDescription(e.target.value)}
              className="h-[120px] w-full resize-none text-wrap text-xl outline-none active:outline-none print:h-[80px]  print:text-sm"
              placeholder="Description"
              rows={5}
            />
          </div>
        </div>
        {/*  */}
        {showComments && (
          <div className="flex flex-col gap-1">
            <p className="text-md ml-4 text-gray print:text-xs">Comments</p>
            <div className="flex w-full rounded-[10px] bg-white p-4">
              <textarea
                ref={commentsRef}
                value={comments ? comments : ""}
                onChange={(e) => setComments(e.target.value)}
                className="resize-noneprint:h-[80px] h-[120px] w-full text-wrap text-xl outline-none active:outline-none print:text-sm "
                placeholder="Comments"
              />
            </div>
          </div>
        )}
        {/*  */}
        {showMedia && (
          <div className="flex flex-col gap-1 print:hidden">
            <div className=" flex flex-1 flex-row items-center gap-2">
              <p className="text-md ml-4 text-gray">Media</p>
              <button
                disabled={station.mediaUrls.length > 2}
                className={
                  station.mediaUrls.length < 2
                    ? "transition-all duration-150 active:scale-95"
                    : ""
                }
                onClick={() => inputRef.current?.click()}
              >
                <FaCirclePlus
                  color={
                    station.mediaUrls.length < 2
                      ? "var(--color-blue)"
                      : "var(--color-gray)"
                  }
                  size={20}
                />
              </button>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="video/*, image/*"
              />
            </div>
            <div className="flex h-[200px] w-full items-center justify-start gap-10 rounded-[10px] bg-white px-4 py-4">
              {station.mediaUrls.map((media) => {
                if (media.type == "image") {
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
                          onClick={() => handleDeleteMedia(media.name)}
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
                } else {
                  return (
                    <div
                      key={media.url}
                      className="flex  flex-col items-center justify-center gap-4"
                    >
                      <video
                        className="h-32 w-60 overflow-hidden rounded-[10px] object-contain"
                        src={media.url}
                        width={media.dimensions.width}
                        height={media.dimensions.height}
                        controls
                        muted
                      />
                      {editMedia && (
                        <button
                          className="transition-all duration-150 active:scale-95"
                          onClick={() => handleDeleteMedia(media.name)}
                        >
                          <IoMdRemoveCircle color={"red"} size={24} />
                        </button>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
      <StationBottomBorder isLast={isLast} />
      <Spacer />
    </div>
  );
};

export default DrillStation;
