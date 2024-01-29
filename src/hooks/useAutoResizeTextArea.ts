import { useEffect, useRef } from "react";

const useAutoResizeTextarea = (value: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "0"; // Reset height to allow shrink
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
    }
  }, [value]);

  return textareaRef;
};

export default useAutoResizeTextarea;
