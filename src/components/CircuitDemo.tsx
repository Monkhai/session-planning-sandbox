import React from "react";
import StationTitle from "./StationTitle";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import Spacer from "./utility/Spacer";
import { IoAddCircle, IoCloseCircleSharp } from "react-icons/io5";
import GenericModal from "./utility/GenericModal";

const CircuitDemo = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="relative flex w-full flex-row items-start border-t-2 px-10 py-2">
      <div className="flex flex-1 items-center justify-center">
        <button
          className="transition-all duration-150 active:scale-95"
          onClick={() => console.log("first")}
        >
          <PiDotsThreeCircleFill size={36} color={"gray"} />
        </button>
        <StationTitle
          setStationName={() => console.log("setStationName")}
          stationName="Station Name"
          stationNameRef={React.createRef()}
        />
      </div>

      {/* <DrillStation /> */}
      <Test />
    </div>
  );
};

export default CircuitDemo;

const DrillStation = () => {
  return (
    <div className="flex flex-[3] flex-col gap-4">
      {/*  */}
      <div className="flex flex-1 flex-col gap-2">
        <h4 className="text-darkTextInput">Drill 1</h4>
        <div className="flex flex-1 flex-row ">
          <div className="bg-darkSecondaryBackground flex flex-[2] items-center justify-start rounded-[10px] p-4">
            <p className="h-[24px]">Description</p>
          </div>
          <div className="bg-darkSecondaryBackground flex flex-1 items-center justify-start rounded-[10px] p-4">
            <p className="h-[24px]">Media</p>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="flex flex-1 flex-col gap-2">
        <h4 className="text-darkTextInput">Drill2</h4>
        <div className="flex flex-1 flex-row ">
          <div className="bg-darkSecondaryBackground flex flex-1 items-center justify-start rounded-[10px] p-4">
            <p className="h-[24px]">Description</p>
          </div>
          <div className="bg-darkSecondaryBackground flex flex-1 items-center justify-start rounded-[10px] p-4">
            <p className="h-[24px]">Comments</p>
          </div>
          <div className="bg-darkSecondaryBackground flex flex-1 items-center justify-start rounded-[10px] p-4">
            <p className="h-[24px]">Media</p>
          </div>
        </div>
      </div>
      {/*  */}
    </div>
  );
};

const Test = () => {
  return (
    <div className="flex flex-[3] flex-col gap-4">
      {/*  */}
      <div className="flex flex-col gap-2">
        <h4 className="text-darkTextInput">Drill 1</h4>
        <div className="flex flex-1 flex-row  gap-4">
          <div className="bg-darkSecondaryBackground flex flex-[2] items-center justify-start rounded-[10px]">
            <p className="p-4">Description</p>
          </div>
          <div className="bg-darkSecondaryBackground flex flex-1 items-center justify-start rounded-[10px]">
            <p className="p-4">Media</p>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="flex flex-col gap-2">
        <h4 className="text-darkTextInput">Drill2</h4>
        <div className="flex flex-1 flex-row gap-4">
          <div className="flex flex-[2] flex-row gap-4">
            <div className="flex flex-1 flex-col rounded-[10px]">
              <div className="bg-darkSecondaryBackground flex items-start justify-start rounded-[10px]">
                <a className="p-4">Description</a>
              </div>
              <Spacer />
            </div>
            <div className="flex flex-1 flex-col rounded-[10px]">
              <div className="bg-darkSecondaryBackground flex items-start justify-start rounded-[10px]">
                <p className="p-4">Comments</p>
              </div>
              <Spacer />
            </div>
          </div>
          <div className="bg-darkSecondaryBackground flex flex-1 items-center justify-start rounded-[10px]">
            <div className="p-4">
              <video
                src="/video.mov"
                controls
                className="h-40 rounded-[10px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      {/*  */}
    </div>
  );
};
