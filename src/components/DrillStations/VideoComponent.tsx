import { SignedUrls } from "~/utils/types";
import RemoveIcon from "../icons/RemoveIcon";

interface Props {
  editMedia: boolean;
  onDeleteMedia: (name: string) => void;
  media: SignedUrls;
}

const VideoComponent = ({ editMedia, onDeleteMedia, media }: Props) => {
  return (
    <div
      key={media.url}
      className="flex  flex-col items-center justify-center gap-4"
    >
      <video
        className="h-32 w-60 overflow-hidden rounded-[10px] object-contain"
        src={media.url}
        width={media.dimensions.width}
        height={media.dimensions.height}
        controls
        muted
      />
      {editMedia && (
        <button
          className="transition-all duration-150 active:scale-95"
          onClick={() => onDeleteMedia(media.name)}
        >
          <RemoveIcon size={24} />
        </button>
      )}
    </div>
  );
};

export default VideoComponent;
