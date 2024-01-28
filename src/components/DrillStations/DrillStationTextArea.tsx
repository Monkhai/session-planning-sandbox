import React, { useEffect } from "react";

interface Props {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  title: string;
  placeholder: string;
  showComments?: boolean;
}

const DrillStationTextArea = ({
  value,
  textAreaRef,
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
      <p className="text-md ml-4 text-gray print:text-xs dark:text-darkTextInput">
        {title}
      </p>
      <div className="flex h-[36px] w-full items-center rounded-[10px] bg-white p-4 print:p-1 print:pt-0 md:h-auto dark:bg-darkTextInputBackground">
        <textarea
          ref={textAreaRef}
          value={value ? value : ""}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-[24px] w-full resize-none text-wrap text-base outline-none placeholder:text-base active:outline-none print:text-sm md:text-xl placeholder:md:text-xl dark:bg-transparent"
          placeholder={placeholder}
          rows={5}
        />
      </div>
    </div>
  );
};

export default DrillStationTextArea;
