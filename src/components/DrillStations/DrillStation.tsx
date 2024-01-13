import Image from "next/image";
import React, { useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import useDeleteDrillStation from "~/hooks/useDeleteDrillStation";
import useUpdateDrillStation from "~/hooks/useUpdateDrillStation";
import { convertDurationToString } from "~/services/DurationFunctions";
import { drillStationType } from "~/utils/types";
import Spacer from "../utility/Spacer";
import DrillStationHeader from "./DrillStationHeader";
import { getIamgeDimensions } from "~/services/getImageDimension";
import { d } from "node_modules/@tanstack/react-query-devtools/build/modern/devtools-0Hr18ibL";

interface Props {
  station: drillStationType;
}

const DrillStation = ({ station }: Props) => {
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

  const inputRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const commentsRef = React.useRef<HTMLTextAreaElement>(null);

  const { mutate: updateDrillStation } = useUpdateDrillStation();
  const { mutate: deleteDrillStation } = useDeleteDrillStation();

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
    });
  };

  const handleDeleteStation = () => {
    deleteDrillStation(station.id);
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
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
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

  //---------------------------------------------
  //---------------------------------------------
  //---------------------------------------------

  return (
    <div className="print:py- relative flex w-full flex-row px-20 py-2">
      <div className="flex flex-1 px-2">
        <DrillStationHeader
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
      <div className="flex w-1/2 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-md ml-4 text-gray">Description</p>
          <div className="flex w-full rounded-[10px] bg-white p-4">
            <textarea
              ref={descriptionRef}
              value={description ? description : ""}
              onChange={(e) => setDescription(e.target.value)}
              className="h-[120px] w-full resize-none text-wrap text-xl outline-none active:outline-none print:text-sm"
              placeholder="Description"
              rows={5}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-md ml-4 text-gray">Comments</p>
          <div className="flex w-full rounded-[10px] bg-white p-4">
            <textarea
              ref={commentsRef}
              value={comments ? comments : ""}
              onChange={(e) => setComments(e.target.value)}
              className="h-[120px] w-full resize-none text-wrap text-xl outline-none active:outline-none print:text-sm"
              placeholder="Comments"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className=" flex flex-1 flex-row items-center gap-2">
            <p className="text-md ml-4 text-gray">Media</p>
            <button
              disabled={station.mediaUrls.length > 3}
              className={
                station.mediaUrls.length < 3
                  ? "transition-all duration-150 active:scale-95"
                  : ""
              }
              onClick={() => inputRef.current?.click()}
            >
              <FaCirclePlus
                color={
                  station.mediaUrls.length < 3
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
              onChange={() => alert("upload media")}
              accept="video/*, image/*"
            />
          </div>
          <div className="flex max-h-80 min-h-[60px] w-full gap-10 rounded-[10px] bg-white px-4 py-4">
            {station.mediaUrls.map((media) => {
              if (media.type == "image") {
                return (
                  <Image
                    className="max-h-32 min-w-10 max-w-60 overflow-hidden rounded-3xl border-2 border-black object-cover object-center"
                    src={media.url}
                    alt="this is a random thing"
                    width={media.dimensions.width}
                    height={media.dimensions.height}
                    key={media.url}
                    priority={true}
                  />
                );
              } else {
                return (
                  <video
                    className="max-h-32 min-w-20 max-w-60  overflow-hidden rounded-[10px] object-contain"
                    src={media.url}
                    controls
                    muted
                    key={media.url}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
      <Spacer />
    </div>
  );
};

export default DrillStation;
