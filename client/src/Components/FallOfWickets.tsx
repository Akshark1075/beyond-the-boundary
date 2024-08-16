import { useQuery } from "@tanstack/react-query";
import { GetScorecard, ScoreCard } from "../types/getScorecard";
import { useCallback } from "react";
import { Rnd, RndResizeCallback } from "react-rnd";
import WithTitleBar from "./WithTitleBar";
import { DraggableEvent } from "react-draggable";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import React from "react";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import { SelectedOption } from "../views/ShowPage";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AppBar, Skeleton, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import fetchWithRetry from "../api/fetch";
const fetchScorecard = async (matchId: string): Promise<GetScorecard> => {
  const res = await fetchWithRetry(
    `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/hscard`
  );

  return res;
};
const FallOfWickets = ({
  matchId,
  selections,
  setSelection,
  isLive,
  isARMode,
}: {
  matchId: string;
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
  isLive: boolean;
  isARMode: boolean;
}) => {
  const { isLoading, isError, data } = useQuery<GetScorecard>({
    queryKey: [`scoresData-${matchId}`],
    queryFn: useCallback(() => fetchScorecard(matchId), [matchId]),
    refetchInterval: isLive ? 30000 : undefined,
  });
  return (
    // <Fow
    //   row={data.scoreCard[data.scoreCard.length - 1]}
    //   isLoading={isLoading}
    //   isError={isError}
    //   selections={selections}
    //   setSelection={setSelection}
    //   key={data.scoreCard[data?.scoreCard.length - 1].inningsId}
    //   isARMode={isARMode}
    // />
    <>
      {data?.scoreCard.map((row) => {
        console.log("loaded");
        return (
          <Fow
            row={row}
            isLoading={isLoading}
            isError={isError}
            selections={selections}
            setSelection={setSelection}
            key={row.inningsId}
            isARMode={isARMode}
          />
        );
      })}
    </>
  );
};

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
  const componentRef = React.useRef<HTMLDivElement>(null);
  const { x: randomX, y: randomY } = getRandomCoordinates();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const storedFallOfWickets = selections.find(
    (s) => s.name === `Fall of wickets ${row.inningsId}`
  );
  const {
    x = randomX,
    y = randomY,
    width = 350,
    height = 350,
  } = storedFallOfWickets ?? {};

  // if (
  //   selections.find((s) => s.name.includes("Fall of wickets")) &&
  //   !storedFallOfWickets
  // ) {
  //   return <></>;
  // }
  if (!storedFallOfWickets && !isMobile && !isARMode) {
    const newItems = [
      ...selections,
      {
        name: `Fall of wickets ${row.inningsId}`,
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
    const option = newSelections.find(
      (s) => s.name === `Fall of wickets ${row.inningsId}`
    );
    if (option && !isMobile) {
      option.x = x;
      option.y = y;
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };

  const setSize = (w: number, h: number) => {
    const newSelections = [...selections];
    const option = newSelections.find(
      (s) => s.name === `Fall of wickets ${row.inningsId}`
    );
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
      <Rnd
        size={{ width: width, height: height }}
        position={{ x: x, y: y }}
        onResize={handleResize}
        onDragStop={handleDragStop}
        minWidth={350}
        minHeight={350}
        bounds="window"
        key={row.batTeamDetails.batTeamName}
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
