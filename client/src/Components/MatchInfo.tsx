import React, { useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Skeleton,
  useMediaQuery,
  AppBar,
  Toolbar,
} from "@mui/material";
import Typography from "@mui/joy/Typography";
import { useQuery } from "@tanstack/react-query";
import { GetInfo } from "../types/getInfo";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import { SelectedOption } from "../views/ShowPage";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import { Rnd, RndResizeCallback } from "react-rnd";
import { DraggableEvent } from "react-draggable";
import WithTitleBar from "./WithTitleBar";

import { useTheme } from "@mui/material/styles";
import fetchWithRetry from "../api/fetch";
const MatchInfoComponent = ({
  width,
  height,
  isMatchDataLoading,
  matchData,
  isARMode,
}: {
  width: number;
  height: number;
  isMatchDataLoading: boolean;
  matchData: GetInfo | undefined;
  isARMode: boolean;
}) => {
  return (
    <div
      style={{
        width: width,
        height: height,
        overflow: "auto",
      }}
      className={isARMode ? "bg-white" : ""}
    >
      <TableContainer component={Paper}>
        <Table aria-label="match info table">
          <TableBody>
            {isMatchDataLoading ? (
              <>
                <Skeleton height={"2rem"} />
                <Skeleton height={"2rem"} />
                <Skeleton height={"2rem"} />
                <Skeleton height={"2rem"} />
                <Skeleton height={"2rem"} />
              </>
            ) : (
              <>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Typography
                      level="title-md"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {"Match"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      level="body-sm"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {matchData?.matchInfo.series.name}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Typography
                      level="title-md"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {"Date"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      level="body-sm"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {matchData?.matchInfo.matchStartTimestamp &&
                      matchData?.matchInfo.matchCompleteTimestamp
                        ? new Date(matchData?.matchInfo.matchStartTimestamp) +
                          " - " +
                          new Date(matchData?.matchInfo.matchCompleteTimestamp)
                        : "-"}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Typography
                      level="title-md"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {"Match"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      level="body-sm"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {matchData?.matchInfo.series.name}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Typography
                      level="title-md"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {"Toss"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      level="body-sm"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {matchData?.matchInfo.tossResults
                        ? `${matchData?.matchInfo.tossResults.tossWinnerName} won the toss and chose to ${matchData?.matchInfo.tossResults.decision}`
                        : "-"}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Typography
                      level="title-md"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {"Venue"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      level="body-sm"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {matchData?.matchInfo.venue
                        ? matchData?.matchInfo.venue.city +
                          " - " +
                          matchData?.matchInfo.venue.country
                        : "-"}
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Typography
                      level="title-md"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {"Umpires"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      level="body-sm"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {matchData?.matchInfo
                        ? matchData?.matchInfo.umpire1.name +
                          "," +
                          matchData?.matchInfo.umpire2.name
                        : "-"}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Typography
                      level="title-md"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {"Third Umpire"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      level="body-sm"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {matchData?.matchInfo
                        ? matchData?.matchInfo.umpire3.name
                        : "-"}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Typography
                      level="title-md"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {"Match Refree"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      level="body-sm"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {matchData?.matchInfo
                        ? matchData?.matchInfo.referee.name
                        : "-"}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Typography
                      level="title-md"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {matchData?.matchInfo
                        ? matchData?.matchInfo.team1.name
                        : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      level="body-sm"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {matchData?.matchInfo.team1.playerDetails.reduce(
                        (accumulator, currentValue, i, a) =>
                          accumulator +
                          `${currentValue.name}
     ${i !== a.length - 1 ? ", " : ""}`,
                        ""
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Typography
                      level="title-md"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {matchData?.matchInfo
                        ? matchData?.matchInfo.team2.name
                        : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      level="body-sm"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {matchData?.matchInfo.team2.playerDetails.reduce(
                        (accumulator, currentValue, i, a) =>
                          accumulator +
                          `${currentValue.name}
     ${i !== a.length - 1 ? ", " : ""}`,
                        ""
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const MatchInfo = React.memo(
  ({
    matchId,
    selections,
    setSelection,
    isARMode,
  }: {
    matchId: string;
    selections: SelectedOption[];
    setSelection: (option: SelectedOption[]) => void;
    isARMode: boolean;
  }) => {
    const fetchInfo = async (matchId: string): Promise<GetInfo> => {
      const res = await fetchWithRetry(
        `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}`
      );
      return res;
    };

    const {
      isLoading: isMatchDataLoading,
      isError: isMatchDataError,
      data: matchData,
    } = useQuery<GetInfo>({
      queryKey: ["infoData", matchId],
      queryFn: useCallback(() => fetchInfo(matchId), [matchId]),
    });

    const { x: randomX, y: randomY } = getRandomCoordinates();
    const componentRef = React.useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const storedInfo = selections.find((s) => s.name === `Match Info`);
    const {
      x = randomX,
      y = randomY,
      width = 350,
      height = 350,
    } = storedInfo ?? {};

    if (!storedInfo && !isMobile) {
      const newItems = [
        ...selections,
        {
          name: `Match Info`,
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
      const option = newSelections.find((s) => s.name === `Match Info`);
      if (option) {
        option.x = x;
        option.y = y;
        setSelection(newSelections);
        saveArrayToLocalStorage("selectedOptions", newSelections);
      }
    };

    const setSize = (w: number, h: number) => {
      const newSelections = [...selections];
      const option = newSelections.find((s) => s.name === `Match Info`);
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
    return isARMode || isMobile ? (
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
              {"Match Info"}
            </Typography>
          </Toolbar>
        </AppBar>

        <MatchInfoComponent
          width={window.screen.width}
          height={height}
          isMatchDataLoading={isMatchDataLoading}
          matchData={matchData}
          isARMode={isARMode}
        />
      </div>
    ) : (
      <Rnd
        size={{ width: width, height: height }}
        position={{ x: x ?? randomX, y: y ?? randomY }}
        onResize={handleResize}
        onDragStop={handleDragStop}
        minWidth={350}
        minHeight={350}
        bounds="window"
      >
        <div>
          <WithTitleBar
            title="Match Info"
            width={componentRef.current?.getBoundingClientRect().width ?? width}
            height={
              componentRef.current?.getBoundingClientRect().height ?? height
            }
            storedKey="Match Info"
            selections={selections}
            setSelection={setSelection}
          >
            <MatchInfoComponent
              width={width}
              height={height}
              isMatchDataLoading={isMatchDataLoading}
              matchData={matchData}
              isARMode={isARMode}
            />
          </WithTitleBar>
        </div>
      </Rnd>
    );
  }
);

export default MatchInfo;
