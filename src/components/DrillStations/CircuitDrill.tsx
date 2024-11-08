import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import useDeleteMedia from "~/hooks/drillStationHooks/useDeleteMedia";
import useGetDrillMedia from "~/hooks/drillStationHooks/useGetDrillStationMedia";
import useUpdateDrill from "~/hooks/drillStationHooks/useUpdateDrill";
import useUploadMedia from "~/hooks/drillStationHooks/useUploadMedia";
import { DrillType } from "~/utils/types";
import CircuitDrillHeader from "./CircuitDrillHeader";
import CircuitDrillMedia from "./CircuitDrillMedia";
import CircuitDrillTextArea from "./CircuitDrillTextArea";
import { Reorder, useDragControls } from "framer-motion";
import { SessionContext } from "~/context/SessionIdContext";

interface Props {
  drill: DrillType;
  onReorderEnd: () => void;
}

export const CircuitDrill = ({ drill, onReorderEnd }: Props) => {
  const { session_id } = useContext(SessionContext);

  const { mutate: updateDrill } = useUpdateDrill();
  const { data: drillMedia, isLoading: isMediaLoading } = useGetDrillMedia({
    drill_id: drill.id,
    session_id,
  });

  const { mutate: deleteMedia } = useDeleteMedia();
  const { mutate: uploadMedia } = useUploadMedia();

  const [description, setDescription] = useState<string>(
    drill.description ? drill.description : "",
  );
  const [comments, setComments] = useState<string>(
    drill.comments ? drill.comments : "",
  );
  const [showComments, setShowComments] = useState<boolean>(
    drill.show_comments,
  );
  const [drillName, setDrillname] = useState<string>(
    drill.name ? drill.name : "",
  );
  const [duration, setDuration] = useState<string>(drill.duration);
  const [showDuration, setShowDuration] = useState<boolean>(
    drill.show_duration,
  );

  const [editMedia, setEditMedia] = useState<boolean>(drill.show_edit_media);
  const [showMedia, setShowMedia] = useState<boolean>(drill.show_media);

  const stationNameRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const commentsRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleBlur = () => {
      if (description !== drill.description || comments !== drill.comments) {
        updateDrill({
          //
          name: drillName,
          //
          comments: comments,
          description: description,
          drill_id: drill.id,
          duration: duration,
          show_comments: showComments,
          show_duration: showDuration,
          show_edit_media: editMedia,
          show_media: showMedia,
          station_id: drill.station_id,
          session_id: session_id,
          drillOfStationId: drill.drillOfStationId,
          order: drill.order,
        });
      }
    };

    descriptionRef.current?.addEventListener("blur", handleBlur);
    commentsRef.current?.addEventListener("blur", handleBlur);

    return () => {
      descriptionRef.current?.removeEventListener("blur", handleBlur);
      commentsRef.current?.removeEventListener("blur", handleBlur);
    };
  }, [
    drillName,
    drill.id,
    description,
    comments,
    showComments,
    showDuration,
    editMedia,
    showMedia,
    drill.station_id,
    updateDrill,
    stationNameRef,
    descriptionRef,
    commentsRef,
  ]);

  const handleDeleteMedia = (name: string) => {
    deleteMedia({ name, station_id: drill.id, session_id });
  };

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        if (file) {
          uploadMedia({
            station_id: drill.id,
            file: file,
            session_id: session_id,
          });
        } else {
          alert("no file found");
        }
      }
      e.target.value = "";
    },
    [uploadMedia, drill.id],
  );

  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={drill}
      dragControls={dragControls}
      dragListener={false}
      key={drill.id}
      onDragEnd={onReorderEnd}
      className="relative flex flex-col gap-2"
    >
      <CircuitDrillHeader
        dragControls={dragControls}
        editMedia={editMedia}
        setEditMedia={setEditMedia}
        showMedia={showMedia}
        setShowMedia={setShowMedia}
        drill={drill}
        comments={comments}
        description={description}
        drillName={drillName}
        setDrillname={setDrillname}
        duration={duration}
        setDuration={setDuration}
        showDuration={showDuration}
        setShowDuration={setShowDuration}
        showComments={showComments}
        setShowComments={setShowComments}
      />
      <div className="flex flex-1 flex-col gap-8 md:flex-row md:gap-4">
        <div className="flex flex-[2] flex-row gap-4">
          <CircuitDrillTextArea
            placeholder="Description"
            setValue={setDescription}
            value={description}
            textAreaRef={descriptionRef}
          />

          {showComments ? (
            <CircuitDrillTextArea
              placeholder="Comments"
              setValue={setComments}
              value={comments}
              textAreaRef={commentsRef}
            />
          ) : null}
        </div>
        <CircuitDrillMedia
          onFileUpload={handleFileUpload}
          editMedia={editMedia}
          isMediaLoading={isMediaLoading}
          mediaUrls={drillMedia}
          showMedia={showMedia}
          onDeleteMedia={handleDeleteMedia}
        />
      </div>
    </Reorder.Item>
  );
};
