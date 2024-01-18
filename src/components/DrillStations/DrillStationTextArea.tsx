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
      <p className="text-md dark:text-darkTextInput ml-4 text-gray print:text-xs">
        {title}
      </p>
      <div className="dark:bg-darkTextInputBackground flex h-auto w-full rounded-[10px] bg-white p-4 print:p-1 print:pt-0">
        <textarea
          ref={textAreaRef}
          value={value ? value : ""}
          onChange={(e) => setValue(e.target.value)}
          className="w-full resize-none text-wrap text-xl outline-none active:outline-none print:text-sm dark:bg-transparent"
          placeholder={placeholder}
          rows={5}
        />
      </div>
    </div>
  );
};

export default DrillStationTextArea;
