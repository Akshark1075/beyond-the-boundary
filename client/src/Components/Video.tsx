import "../styles/ShowPage.css";
import { DraggableEvent } from "react-draggable";
import WithTitleBar from "./WithTitleBar";
import React, { Suspense, useCallback, useState } from "react";
import { Rnd, RndResizeCallback } from "react-rnd";
import { SelectedOption } from "../views/ShowPage";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import {
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { GetInfo } from "../types/getInfo";
import { VideoResource } from "../types/getVideo";
import { Plane, useTexture } from "@react-three/drei";
import { VideoTexture } from "three";
import getUpdatedZIndex from "../utilities/getUpdatedZIndex";
const Video = ({
  selections,
  setSelection,
  isARMode,
  matchData,
  texture,
}: {
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
  isARMode: boolean;
  matchData: GetInfo | undefined;
  texture: VideoTexture | null;
}) => {
  const componentRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const storedVideo = selections.find((s) => s.name === `Video`);

  const API_KEY = "AIzaSyDxhrWwxckMwaHOj1ma7hje53GjV_aY1FM";

  const fetchTopYouTubeResult = async (query: string) => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=1&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response;
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
      throw error;
    }
  };

  const { data: videoUrl } = useQuery<VideoResource>({
    queryKey: ["videoData"],
    enabled: !!matchData && !isARMode,
    queryFn: useCallback(
      () =>
        fetchTopYouTubeResult(
          `${matchData?.matchInfo.team1.name} vs ${matchData?.matchInfo.team2.name} Cricket Highlights`
        ).then(async (res) => {
          const data = await res.json();
          if (data.items.length > 0) {
            return data.items[0];
          } else {
            throw new Error("No results found");
          }
        }),
      [matchData?.matchInfo.matchId]
    ),
  });
  const {
    x = (window.innerWidth - 853) / 2,
    y = (window.innerHeight - 480) / 2,
    width = 853,
    height = 480,
    zIndex = 1,
  } = storedVideo ?? {};

  if (!storedVideo && !isMobile && !isARMode) {
    const newItems = [
      ...selections,
      {
        name: `Video`,
        x: x,
        y: y,
        width: width,
        height: height,
        zIndex: 1,
      },
    ];
    setSelection(newItems);
    saveArrayToLocalStorage("selectedOptions", newItems);
  }

  const setPosition = (x: number, y: number) => {
    const newSelections = [...selections];
    const option = newSelections.find((s) => s.name === `Video`);
    if (option && !isMobile) {
      option.x = x;
      option.y = y;
      option.zIndex = getUpdatedZIndex(selections, option.name);
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };

  const setSize = (w: number, h: number) => {
    const newSelections = [...selections];
    const option = newSelections.find((s) => s.name === `Video`);
    if (option && !isMobile) {
      option.width = w;
      option.height = h;
      option.zIndex = getUpdatedZIndex(selections, option.name);
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };
  //Functions for handling resizing
  const handleResize: RndResizeCallback = (
    e,
    direction,
    ref,
    delta,
    position
  ) => {
    if (ref && ref.style && !isMobile) {
      const newWidth = parseInt(ref.style.width, 10);
      const newHeight = parseInt(ref.style.height, 10);
      setSize(newWidth, newHeight);
    }
  };
  //Functions for controlling the drag state
  const handleDragStart = (e: DraggableEvent) => {
    setIsDragging(true);
  };
  const handleDragStop = (e: DraggableEvent, d: { x: number; y: number }) => {
    setPosition(d.x, d.y);
    setIsDragging(false);
  };
  const handleResizeStart = (e: DraggableEvent) => {
    setIsDragging(true);
  };
  const handleResizeStop = (e: DraggableEvent) => {
    setIsDragging(false);
  };
  // eslint-disable-next-line react/prop-types
  const VideoPlane = () => {
    function FallbackMaterial({ url }: { url: string }) {
      const imgTexture = useTexture(url);
      return <meshBasicMaterial map={imgTexture} toneMapped={false} />;
    }
    return (
      <Plane args={[3, 2]}>
        <Suspense
          fallback={<FallbackMaterial url="/icons/icon-1024x1024.png" />}
        >
          <meshBasicMaterial map={texture} toneMapped={false} />;
        </Suspense>
      </Plane>
    );
  };
  //Video place for AR Mode
  return isARMode ? (
    <VideoPlane />
  ) : isMobile ? (
    <div
      style={{
        width: "100%",
        marginBottom: "1rem",
        overflowY: "scroll",
      }}
    >
      <AppBar
        position="static"
        style={{ background: "#303036" }}
        className="grow"
      >
        <Toolbar variant="dense" className="px-2 min-h-8">
          <Typography
            component="h6"
            className="grow cursor-pointer select-none"
            style={{ color: "white" }}
          >
            {"Live"}
          </Typography>
        </Toolbar>
      </AppBar>
      <div
        className="video-responsive"
        ref={componentRef}
        style={{
          width: window.screen.width,
          height: window.screen.width,
          overflow: "auto",
        }}
      >
        <iframe
          width={window.screen.width}
          height={window.screen.width}
          src={`https://www.youtube.com/embed/${videoUrl?.id.videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded YouTube Video"
        />
      </div>
    </div>
  ) : (
    //Customizable Desktop interface
    <Rnd
      size={{ width: width, height: height }}
      position={{ x: x, y: y }}
      onDragStart={handleDragStart}
      onResize={handleResize}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
      onDragStop={(e, data) => {
        const minY = 0; // You can set this to any value to add padding from the top.
        if (data.y < minY) {
          handleDragStop(e, { ...data, y: minY });
        } else {
          handleDragStop(e, data);
        }
      }}
      minWidth={500}
      minHeight={300}
      style={{ zIndex: isDragging ? 999999 : zIndex }}
    >
      <div>
        <WithTitleBar
          title="Live"
          width={componentRef.current?.getBoundingClientRect().width ?? width}
          height={
            componentRef.current?.getBoundingClientRect().height ?? height
          }
          storedKey="Video"
          selections={selections}
          setSelection={setSelection}
        >
          <div
            className="video-responsive"
            ref={componentRef}
            style={{ width: width, height: height, overflow: "auto" }}
          >
            <iframe
              width={width}
              height={height}
              src={`https://www.youtube.com/embed/${videoUrl?.id.videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded YouTube Video"
            />
          </div>
        </WithTitleBar>
      </div>
    </Rnd>
  );
};
export default Video;
