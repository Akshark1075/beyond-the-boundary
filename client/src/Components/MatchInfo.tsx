import React, { useState } from "react";
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
import { GetInfo } from "../types/getInfo";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import { SelectedOption } from "../views/ShowPage";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import { Rnd, RndResizeCallback } from "react-rnd";
import { DraggableEvent } from "react-draggable";
import WithTitleBar from "./WithTitleBar";

import { useTheme } from "@mui/material/styles";
import getUpdatedZIndex from "../utilities/getUpdatedZIndex";
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                        textAlign: "center",
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
    selections,
    setSelection,
    isARMode,
    isLoading,
    isError,
    data,
  }: {
    selections: SelectedOption[];
    setSelection: (option: SelectedOption[]) => void;
    isARMode: boolean;
    isLoading: boolean;
    isError: boolean;
    data: GetInfo | undefined;
  }) => {
    const [isDragging, setIsDragging] = useState(false);
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
      zIndex = 1,
    } = storedInfo ?? {};

    if (!storedInfo && !isMobile && !isARMode) {
      const newItems = [
        ...selections,
        {
          name: `Match Info`,
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
      const option = newSelections.find((s) => s.name === `Match Info`);
      if (option) {
        option.x = x;
        option.y = y;
        option.zIndex = getUpdatedZIndex(selections, option.name);
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
        option.zIndex = getUpdatedZIndex(selections, option.name);
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

    const handleDragStart = (e: DraggableEvent) => {
      setIsDragging(true);
    };
    const handleDragStop = (e: DraggableEvent, d: { x: number; y: number }) => {
      setIsDragging(false);
      setPosition(d.x, d.y);
    };
    const handleResizeStart = (e: DraggableEvent) => {
      setIsDragging(true);
    };
    const handleResizeStop = (e: DraggableEvent) => {
      setIsDragging(false);
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
          isMatchDataLoading={isLoading}
          matchData={data}
          isARMode={isARMode}
        />
      </div>
    ) : (
      <Rnd
        size={{ width: width, height: height }}
        position={{ x: x ?? randomX, y: y ?? randomY }}
        onResize={handleResize}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        onDragStart={handleDragStart}
        onDragStop={(e, data) => {
          const minY = 0; // You can set this to any value to add padding from the top.
          if (data.y < minY) {
            handleDragStop(e, { ...data, y: minY });
          } else {
            handleDragStop(e, data);
          }
        }}
        minWidth={350}
        minHeight={350}
        style={{ zIndex: isDragging ? 999999 : zIndex }}
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
              isMatchDataLoading={isLoading}
              matchData={data}
              isARMode={isARMode}
            />
          </WithTitleBar>
        </div>
      </Rnd>
    );
  }
);

export default MatchInfo;
