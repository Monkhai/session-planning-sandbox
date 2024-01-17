import React from "react";

type LoaderSize = "small" | "medium" | "large";

interface Props {
  size?: LoaderSize;
}

const Loader = ({ size = "large" }: Props) => {
  if (size === "small") {
    return (
      <div className="flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (size === "medium") {
    return (
      <div className="flex items-center justify-center">
        <div className="h-24 w-24 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (size === "large") {
    return (
      <div className="flex items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }
};

export default Loader;
