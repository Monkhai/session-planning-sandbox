import React, { useEffect } from "react";

interface Props {
  value: string | undefined;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  placeholder: string;
  showComments?: boolean;
}

const CircuitDrillTextArea = ({
  value,
  textAreaRef,
  setValue,
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
    <div className="flex flex-1 flex-col">
      <div className="flex h-[36px] w-full items-center rounded-[10px] bg-white p-2 print:p-1 print:pt-0 md:h-auto md:p-4 dark:bg-darkTextInputBackground">
        <textarea
          ref={textAreaRef}
          value={value ? value : ""}
          onChange={(e) => setValue(e.target.value)}
          className="placeholder:basem min-h-[24px] w-full resize-none text-wrap text-base outline-none active:outline-none print:text-sm md:text-xl md:placeholder:text-xl dark:bg-transparent"
          placeholder={placeholder}
          rows={5}
        />
      </div>
    </div>
  );
};

export default CircuitDrillTextArea;
