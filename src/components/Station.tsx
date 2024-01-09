"use client";

import React, { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { IoMdRemoveCircle } from "react-icons/io";
import useEditStationDuration from "~/hooks/useEditStationDuration";
import useEditStationName from "~/hooks/useEditStationName";
import { Station } from "~/utils/types";
import DurationPicker from "./DurationPicker";
import useCreateSkill from "~/hooks/useCreateSkill";
import { env } from "~/env";
import SkillRow from "./SkillRow";
import useDeleteStation from "~/hooks/useDeleteStation";
import useDeleteSkill from "~/hooks/useDeleteSkill";
import { getUserId } from "~/services/supabaseFunctions";

interface Props {
  station: Station;
}

const StationComponent = ({ station }: Props) => {
  const [hideDurationPicker, setHideDurationPicker] = useState(true);
  const [duration, setDuration] = useState<string>("00:00:00");
  const [durationString, setDurationString] = useState<string | undefined>();
  const [stationName, setStationName] = useState<string>("");
  const stationNameRef = React.useRef<HTMLInputElement>(null);

  const { mutate: updateStationName, isPending: isPendingNameEdit } =
    useEditStationName();
  const { mutate: updateStationDuration, isPending: isPendindDurationEdit } =
    useEditStationDuration();
  const { mutate: createSkill, isPending: isPendingCreateSkill } =
    useCreateSkill();

  const { mutate: deleteStation, isPending: isPendingDeleteStation } =
    useDeleteStation();

  const { isPending: isPendningDeleteSkill } = useDeleteSkill();

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

  const handledurationChange = (duration: string) => {
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
  };

  const onHideDurationPicker = () => {
    setHideDurationPicker(true);
  };

  const handleCreateSkill = async () => {
    createSkill({
      station_id: station.id,
    });
  };

  const handleDeleteStation = () => {
    deleteStation(station.id);
  };

  return (
    <div className="w-full">
      <div className="flex w-full flex-row items-center gap-2 px-4 py-2">
        <div className="w-full">
          <input
            value={stationName}
            onChange={(event) => setStationName(event.target.value)}
            ref={stationNameRef}
            className="flex min-w-10 max-w-full bg-transparent text-lg font-bold outline-none active:outline-none"
            placeholder="Station Name"
          />
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
          <div
            className="absolute w-60"
            style={{
              transition: "all 0.150s ease-in-out",
              scale: hideDurationPicker ? 0 : 1,
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

        <button
          disabled={isPendingCreateSkill}
          onClick={handleCreateSkill}
          className="transition-all duration-150 active:scale-95"
        >
          <FaCirclePlus color={"var(--color-blue)"} size={30} />
        </button>

        <button
          className="ml-4 transition-all duration-150 active:scale-95"
          onClick={handleDeleteStation}
          disabled={isPendingDeleteStation}
        >
          <IoMdRemoveCircle color={"red"} size={34} />
        </button>
      </div>

      <div className="overflow-hidden rounded-[10px]">
        {station.skills.map((skill, index) => (
          <SkillRow
            isPendingDelete={isPendningDeleteSkill}
            skill={skill}
            key={skill.id}
            isLast={station.skills.length - 1 == index}
          />
        ))}
      </div>
    </div>
  );
};

export default StationComponent;
