import React, { useEffect } from "react";
import StationHeader from "../StationHeader";
import Spacer from "../utility/Spacer";
import client from "~/utils/supabaseClient";
import {
  getDrillStationMedia,
  getUserId,
  uploadDrillStationMedia,
} from "~/services/supabaseFunctions";
import { FaCirclePlus } from "react-icons/fa6";
import useUpdateDrillStation from "~/hooks/useUpdateDrillStation";
import { drillStationType } from "~/utils/types";
import useDeleteDrillStation from "~/hooks/useDeleteDrillStation";
import { set } from "zod";
import DrillStationHeader from "./DrillStationHeader";
import { convertDurationToString } from "~/services/DurationFunctions";
import Image from "next/image";

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
  const descriptionRef = React.useRef<HTMLInputElement>(null);
  const commentsRef = React.useRef<HTMLInputElement>(null);

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
          <div className="flex w-full rounded-[10px] bg-white py-4 pl-4">
            <input
              ref={descriptionRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 text-xl outline-none active:outline-none print:text-sm"
              placeholder="Description"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-md ml-4 text-gray">Comments</p>
          <div className="flex w-full rounded-[10px] bg-white py-4 pl-4">
            <input
              ref={commentsRef}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="flex-1 text-xl outline-none active:outline-none print:text-sm"
              placeholder="Comments"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className=" flex flex-1 flex-row items-center gap-2">
            <p className="text-md ml-4 text-gray">Media</p>
            <button
              className="transition-all duration-150 active:scale-95"
              onClick={() => inputRef.current?.click()}
            >
              <FaCirclePlus color={"var(--color-blue)"} size={20} />
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
                  <div className="overflow-hidden rounded-xl">
                    <Image
                      className="h-40 min-w-20 max-w-60 overflow-hidden rounded-3xl border-2 border-black object-contain"
                      src={media.url}
                      width={4000}
                      height={4000}
                      alt="this is a random thing"
                    />
                  </div>
                );
              } else {
                return (
                  <video
                    className="max-h-40 min-w-20 max-w-60  overflow-hidden rounded-[10px] border-2 object-contain"
                    src={media.url}
                    controls
                    muted
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
