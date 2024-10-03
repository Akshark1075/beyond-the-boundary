import { GetScorecard, ScoreCard } from "../types/getScorecard";
import { Rnd, RndResizeCallback } from "react-rnd";
import WithTitleBar from "./WithTitleBar";
import { DraggableEvent } from "react-draggable";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import React, { useState } from "react";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import { SelectedOption } from "../views/ShowPage";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AppBar, Skeleton, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import getUpdatedZIndex from "../utilities/getUpdatedZIndex";
//Component for displaying the Fall of Wickets timeline
const FallOfWickets = ({
  selections,
  setSelection,
  data,
  isLoading,
  isError,
  isARMode,
}: {
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;

  isARMode: boolean;
  isLoading: boolean;
  isError: boolean;
  data: GetScorecard | undefined;
}) => {
  return (
    <>
      {data?.scoreCard.map((row, i) => {
        return (
          <Fow
            row={row}
            isLoading={isLoading}
            isError={isError}
            selections={selections}
            setSelection={setSelection}
            key={i}
            isARMode={isARMode}
          />
        );
      })}
    </>
  );
};
//Wrapper component for fall of wickets
const Fow = ({
  row,

  isLoading,
  isError,
  selections,
  setSelection,
  isARMode,
}: {
  row: ScoreCard;

  isLoading: boolean;
  isError: boolean;
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
  isARMode: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const componentRef = React.useRef<HTMLDivElement>(null);
  const { x: randomX, y: randomY } = getRandomCoordinates();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  //Fetching the position and size of stored fallof wickets component
  const storedFallOfWickets = selections.find(
    (s) => s.name === `Fall of wickets ${row.inningsId}`
  );
  const {
    x = randomX,
    y = randomY,
    width = 350,
    height = 350,
    zIndex = 1,
  } = storedFallOfWickets ?? {};
  //If the component is being used for the first time, store to local storage
  if (!storedFallOfWickets && !isMobile && !isARMode) {
    const newItems = [
      ...selections,
      {
        name: `Fall of wickets ${row.inningsId}`,
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
  //Function for setting the new position
  const setPosition = (x: number, y: number) => {
    const newSelections = [...selections];
    const option = newSelections.find(
      (s) => s.name === `Fall of wickets ${row.inningsId}`
    );
    if (option && !isMobile) {
      option.x = x;
      option.y = y;
      option.zIndex = getUpdatedZIndex(selections, option.name);
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };
  //Function for setting the new size
  const setSize = (w: number, h: number) => {
    const newSelections = [...selections];
    const option = newSelections.find(
      (s) => s.name === `Fall of wickets ${row.inningsId}`
    );
    if (option && !isMobile) {
      option.width = w;
      option.height = h;
      option.zIndex = getUpdatedZIndex(selections, option.name);
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };
  //Function for handling resizing
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
  //functions for controlling the state of dragging
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
  //Display Loader incase of network delay
  if (isLoading || isError)
    return (
      <div
        style={{
          width: isMobile ? window.screen.width : "350px",
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
              variant="h6"
              className="grow cursor-pointer select-none"
              style={{ color: "white" }}
            >
              {`Fall of wickets ${row.inningsId}`}
            </Typography>
          </Toolbar>
        </AppBar>
        <Skeleton height={"2rem"} />
        <Skeleton height={"2rem"} />
        <Skeleton height={"2rem"} />
        <Skeleton height={"2rem"} />
        <Skeleton height={"2rem"} />
      </div>
    );
  else {
    /*Adapting based on user's device*/
    return isMobile || isARMode ? (
      <div
        style={{
          width: window.screen.width,
          marginBottom: "1rem",
          overflowY: "scroll",
          color: "black",
          background: "white",
        }}
      >
        <AppBar
          position="static"
          style={{ background: "#303036" }}
          className="grow"
        >
          <Toolbar variant="dense" className="px-2 min-h-8">
            <Typography
              variant="h6"
              className="grow cursor-pointer select-none"
              style={{ color: "white" }}
            >
              {`Fall of wickets ${row.inningsId}`}
            </Typography>
          </Toolbar>
        </AppBar>
        {Object.values(row.wicketsData).reduce(
          (accumulator, currentValue, i, a) =>
            accumulator +
            `${currentValue.wktRuns}-${currentValue.wktNbr}(${
              currentValue.batName
            },${currentValue.wktOver})${i !== a.length - 1 ? ", " : ""}`,
          ""
        )}
      </div>
    ) : (
      /*Customizable UI for Desktops, Laptops */
      <Rnd
        size={{ width: width, height: height }}
        position={{ x: x, y: y }}
        onResize={handleResize}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        onDragStart={handleDragStart}
        onDragStop={(e, data) => {
          const minY = 0;
          if (data.y < minY) {
            handleDragStop(e, { ...data, y: minY });
          } else {
            handleDragStop(e, data);
          }
        }}
        minWidth={350}
        minHeight={350}
        key={row.batTeamDetails.batTeamName}
        style={{ zIndex: isDragging ? 999999 : zIndex }}
      >
        <div
          ref={componentRef}
          style={{ width: width, height: height, overflow: "auto" }}
        >
          <WithTitleBar
            title="Fall of wickets"
            width={componentRef.current?.getBoundingClientRect().width ?? width}
            height={
              componentRef.current?.getBoundingClientRect().height ?? height
            }
            storedKey={`Fall of wickets ${row.inningsId}`}
            selections={selections}
            setSelection={setSelection}
          >
            <div>
              {Object.values(row.wicketsData).reduce(
                (accumulator, currentValue, i, a) =>
                  accumulator +
                  `${currentValue.wktRuns}-${currentValue.wktNbr}(${
                    currentValue.batName
                  },${currentValue.wktOver})${i !== a.length - 1 ? ", " : ""}`,
                ""
              )}
            </div>
          </WithTitleBar>
        </div>
      </Rnd>
    );
  }
};

export default FallOfWickets;
