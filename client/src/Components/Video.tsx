import "../styles/ShowPage.css";
import { DraggableEvent } from "react-draggable";
import WithTitleBar from "./WithTitleBar";
import React from "react";
import { Rnd, RndResizeCallback } from "react-rnd";
import { SelectedOption } from "../views/ShowPage";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import {
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
const Video = ({
  matchId,
  selections,
  setSelection,
}: {
  matchId: string;
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
}) => {
  const videoUrl = "https://www.youtube.com/embed/4TLHORImdL4";
  const componentRef = React.useRef<HTMLDivElement>(null);
  const { x: randomX, y: randomY } = getRandomCoordinates();
  const storedVideo = selections.find((s) => s.name === `Video`);
  // const [width, setWidth] = useState(853);
  // const [height, setHeight] = useState(480);
  // const [position, setPosition] = useState({ x: 0, y: 0 });
  const {
    x = randomX,
    y = randomY,
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
    if (option) {
      option.x = x;
      option.y = y;
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };

  const setSize = (w: number, h: number) => {
    const newSelections = [...selections];
    const option = newSelections.find((s) => s.name === `Video`);
    if (option) {
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
    if (ref && ref.style) {
      const newWidth = parseInt(ref.style.width, 10);
      const newHeight = parseInt(ref.style.height, 10);
      setSize(newWidth, newHeight);
    }
  };

  const handleDragStop = (e: DraggableEvent, d: { x: number; y: number }) => {
    setPosition(d.x, d.y);
  };
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
        style={{ width: width, height: height, overflow: "auto" }}
      >
        <iframe
          width={width}
          height={height}
          src={videoUrl}
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
      position={{ x: x ?? randomX, y: y ?? randomY }}
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
              src={videoUrl}
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
