import "../styles/ShowPage.css";
import { DraggableEvent } from "react-draggable";
import WithTitleBar from "./WithTitleBar";
import React, { useCallback } from "react";
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
const Video = ({
  matchId,
  selections,
  setSelection,
}: {
  matchId: string;
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
}) => {
  const componentRef = React.useRef<HTMLDivElement>(null);
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

  const fetchInfo = async (matchId: string): Promise<Response> => {
    try {
      const res = await fetch(
        `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}`,
        {
          headers: {
            "x-rapidapi-host": "cricbuzz-cricket.p.rapidapi.com",
            "x-rapidapi-key":
              // "71c49e5ccfmsh4e7224d6d7fbb0ap11128bjsnd1bdf317c93e",
              "34bc3eb86dmsh62c3088fe607e6fp186023jsnf139d6bf65e7",
          },
        }
      );
      if (!res.ok) {
        throw new Error("First API call failed");
      }
      return res;
    } catch (error) {
      const fallbackRes = await fetch(
        `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}`,
        {
          headers: {
            "x-rapidapi-host": "cricbuzz-cricket.p.rapidapi.com",
            "x-rapidapi-key":
              "34bc3eb86dmsh62c3088fe607e6fp186023jsnf139d6bf65e7",
            // "7a2ed3513cmsh433f85b7a4ab9f8p1883cfjsn1b4c80608f1b",
          },
        }
      );
      if (!fallbackRes.ok) {
        throw new Error("Both API calls failed");
      }
      return fallbackRes;
    }
  };

  const {
    isLoading: isMatchDataLoading,
    isError: isMatchDataError,
    data: matchData,
  } = useQuery<GetInfo>({
    queryKey: ["infoData", matchId],
    queryFn: useCallback(
      () => fetchInfo(matchId).then((res) => res.json()),
      [matchId]
    ),
  });
  const {
    isLoading,
    isError,
    data: videoUrl,
  } = useQuery<VideoResource>({
    queryKey: ["videoData"],
    enabled: !!matchData,
    queryFn: useCallback(
      () =>
        fetchTopYouTubeResult(
          `${matchData?.matchInfo.team1.name} vs ${matchData?.matchInfo.team2.name} Cricket Highlights`
        ).then(async (res) => {
          const data = await res.json();
          if (data.items.length > 0) {
            console.log(
              `https://www.youtube.com/embed/${data.items[0]?.id.videoId}`
            );
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
  } = storedVideo ?? {};

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  if (!storedVideo && !isMobile) {
    const newItems = [
      ...selections,
      {
        name: `Video`,
        x: x,
        y: y,
        width: width,
        height: height,
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
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };
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

  const handleDragStop = (e: DraggableEvent, d: { x: number; y: number }) => {
    setPosition(d.x, d.y);
  };
  if (isLoading || isError) {
    return <></>;
  }
  return isMobile ? (
    <div style={{ width: "100%", marginBottom: "1rem", overflowY: "scroll" }}>
      <AppBar
        position="static"
        style={{ background: "#334155" }}
        className="grow"
      >
        <Toolbar variant="dense" className="px-2 min-h-8">
          <Typography
            component="h6"
            className="grow cursor-pointer select-none"
          >
            {"Live"}
          </Typography>
        </Toolbar>
      </AppBar>
      <div
        className="video-responsive"
        ref={componentRef}
        style={{ width: window.screen.width, height: height, overflow: "auto" }}
      >
        <iframe
          width={window.screen.width}
          height={height}
          src={`https://www.youtube.com/embed/${videoUrl?.id.videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded YouTube Video"
        />
      </div>
    </div>
  ) : (
    <Rnd
      size={{ width: width, height: height }}
      position={{ x: x, y: y }}
      onResize={handleResize}
      onDragStop={handleDragStop}
      minWidth={500}
      minHeight={300}
      bounds="window"
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
