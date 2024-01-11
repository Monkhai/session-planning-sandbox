"use client";
import React, { useCallback, useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import useCreateSkill from "~/hooks/useCreateSkill";
import useDeleteSkill from "~/hooks/useDeleteSkill";
import useDeleteStation from "~/hooks/useDeleteStation";
import useEditStationDuration from "~/hooks/useEditStationDuration";
import useEditStationName from "~/hooks/useEditStationName";
import { Station } from "~/utils/types";
import DurationPicker from "./DurationPicker";
import SkillRow from "./SkillRow";
import StationSettings from "./StationSettings";

interface Props {
  station: Station;
}

const StationComponent = ({ station }: Props) => {
  const [hideDurationPicker, setHideDurationPicker] = useState(true);
  const [duration, setDuration] = useState<string>("00:00:00");
  const [durationString, setDurationString] = useState<string | undefined>();
  const [stationName, setStationName] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDurationPicker, setShowDurationPicker] = useState<boolean>(false);
  const [editSkills, setEditSkills] = useState<boolean>(false);

  const stationNameRef = React.useRef<HTMLInputElement>(null);

  const { mutate: updateStationName } = useEditStationName();
  const { mutate: updateStationDuration } = useEditStationDuration();
  const { mutate: createSkill } = useCreateSkill();
  const { mutate: deleteStation } = useDeleteStation();

  const convertDurationToString = (
    duration: string | null,
  ): string | undefined => {
    if (duration !== null && duration !== undefined) {
      if (duration == "00:00:00") return undefined;

      const [hours, minutes, seconds] = duration.split(":");

      if (hours) {
        const hoursInt = parseInt(hours);
        const hoursToMinutes = hoursInt * 60;

        const minutesInt = parseInt(minutes!);
        const totalMinutes = hoursToMinutes + minutesInt;
        if (totalMinutes == 1) {
          return `${totalMinutes} minute`;
        } else {
          return `${totalMinutes} minutes`;
        }
      }
    }
  };

  useEffect(() => {
    setDuration(station.duration);
  }, [station.duration]);

  useEffect(() => {
    setStationName(station.name);
  }, [station.name]);

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
      if (stationName !== station.name) {
        updateStationName({
          station_id: station.id,
          stationName,
        });
      }
    };

    const element = stationNameRef.current;
    if (element) {
      element.addEventListener("blur", handleBlur);
    }

    return () => {
      if (element) {
        element.removeEventListener("blur", handleBlur);
      }
    };
  }, [stationName, station]);

  const handledurationChange = useCallback((duration: string) => {
    setDuration(duration);
    if (duration) {
      updateStationDuration({
        station_id: station.id,
        stationDuration: duration,
      });
    } else {
      updateStationDuration({
        station_id: station.id,
        stationDuration: null,
      });
    }
  }, []);

  const onHideDurationPicker = useCallback(() => {
    setHideDurationPicker(true);
  }, []);

  const handleCreateSkill = async () => {
    createSkill({
      station_id: station.id,
    });
  };

  const handleDeleteStation = () => {
    deleteStation(station.id);
  };

  return (
    <div className="w-full py-2 print:py-1">
      <div className=" flex w-full flex-row items-center gap-2 py-2 pl-4">
        <div className="w-full">
          <input
            value={stationName}
            onChange={(event) => setStationName(event.target.value)}
            ref={stationNameRef}
            className="flex min-w-10 max-w-full bg-transparent text-lg font-bold outline-none active:outline-none"
            placeholder="Station Name"
          />
          {showDurationPicker && (
            <button onClick={() => setHideDurationPicker(!hideDurationPicker)}>
              <p
                style={{
                  color: hideDurationPicker
                    ? durationString
                      ? "var(--color-text)"
                      : "var(--color-gray)"
                    : "var(--color-blue)",
                  fontWeight: hideDurationPicker ? "" : "bold",
                }}
                className="pl-2 text-sm font-semibold"
              >
                {durationString ? durationString : "Duration"}
              </p>
            </button>
          )}

          <div
            className="absolute mt-2 w-80"
            style={{
              transition: "all 0.150s ease-in-out",
              scale: hideDurationPicker ? 0 : 1,
              opacity: hideDurationPicker ? 0 : 1,
              transformOrigin: "top left",
            }}
          >
            <DurationPicker
              hideDurationPicker={onHideDurationPicker}
              duration={duration}
              onDurationSubmit={handledurationChange}
            />
          </div>
        </div>

        <div className="relative left-4 flex flex-row print:hidden">
          <button
            onClick={handleCreateSkill}
            className="transition-all duration-150 active:scale-95"
          >
            <FaCirclePlus color={"var(--color-blue)"} size={30} />
          </button>

          <button
            className="ml-4 transition-all duration-150 active:scale-95"
            onClick={() => setShowEditModal(!showEditModal)}
          >
            <PiDotsThreeCircleFill size={36} color={"gray"} />
          </button>

          <StationSettings
            setShowDurationPicker={setShowDurationPicker}
            showEditModal={showEditModal}
            setEditSkills={setEditSkills}
            setShowEditModal={setShowEditModal}
            handleDeleteStation={handleDeleteStation}
          />
        </div>
      </div>

      <div>
        {station.skills.map((skill, index) => (
          <SkillRow
            index={index}
            skill={skill}
            editSkills={editSkills}
            key={skill.id}
            isLast={station.skills.length - 1 == index}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(StationComponent);
