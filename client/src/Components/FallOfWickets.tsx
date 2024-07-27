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
const fetchScorecard = async (matchId: string): Promise<Response> => {
  try {
    const res = await fetch(
      `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/hscard`,
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
      `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/hscard`,
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
const FallOfWickets = ({
  matchId,
  selections,
  setSelection,
}: {
  matchId: string;
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
}) => {
  const { isLoading, isError, data } = useQuery<GetScorecard>({
    queryKey: ["scoresData", matchId],
    queryFn: useCallback(
      () => fetchScorecard(matchId).then((res) => res.json()),
      [matchId]
    ),
  });
  return (
    <>
      {data?.scoreCard.map((row) => {
        return (
          <Fow
            row={row}
            isLoading={isLoading}
            isError={isError}
            selections={selections}
            setSelection={setSelection}
            key={row.inningsId}
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
}: {
  row: ScoreCard;

  isLoading: boolean;
  isError: boolean;
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
}) => {
  const componentRef = React.useRef<HTMLDivElement>(null);
  const { x: randomX, y: randomY } = getRandomCoordinates();
  const storedFallOfWickets = selections.find(
    (s) => s.name === `Fall of wickets ${row.inningsId}`
  );
  const {
    x = randomX,
    y = randomY,
    width = 350,
    height = 350,
  } = storedFallOfWickets ?? {};
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  if (
    selections.find((s) => s.name.includes("Fall of wickets")) &&
    !storedFallOfWickets
  ) {
    return <></>;
  }
  if (!storedFallOfWickets && !isMobile) {
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
          width: window.screen.width,
          marginBottom: "1rem",
          overflowY: "scroll",
        }}
      >
        <AppBar
          position="static"
          style={{ background: "#334155" }}
          className="grow"
        >
          <Toolbar variant="dense" className="px-2 min-h-8">
            <Typography
              variant="h6"
              className="grow cursor-pointer select-none"
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
    return isMobile ? (
      <div
        style={{
          width: window.screen.width,
          marginBottom: "1rem",
          overflowY: "scroll",
        }}
      >
        <AppBar
          position="static"
          style={{ background: "#334155" }}
          className="grow"
        >
          <Toolbar variant="dense" className="px-2 min-h-8">
            <Typography
              variant="h6"
              className="grow cursor-pointer select-none"
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
