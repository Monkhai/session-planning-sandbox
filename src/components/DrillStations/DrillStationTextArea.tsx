import React, { useContext, useEffect } from "react";

interface Props {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  isPendingDeleteStation: boolean;
  title: string;
  placeholder: string;
  showComments?: boolean;
}

const DrillStationTextArea = ({
  value,
  textAreaRef,
  isPendingDeleteStation,
  setValue,
  title,
  placeholder,
  showComments = true,
}: Props) => {
  if (!showComments) return null;

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "0"; // Reset height to shrink if text is deleted
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-1">
      <p className="text-md ml-4 text-gray print:text-xs">{title}</p>
      <div className="flex h-auto w-full rounded-[10px] bg-white p-4">
        <textarea
          ref={textAreaRef}
          value={value ? value : ""}
          onChange={(e) => setValue(e.target.value)}
          className="w-full resize-none text-wrap text-xl outline-none active:outline-none print:h-[80px]  print:text-sm"
          placeholder={placeholder}
          rows={5}
        />
      </div>
    </div>
  );
};

export default DrillStationTextArea;
