import React, { useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Skeleton,
  useTheme,
  useMediaQuery,
  Toolbar,
  AppBar,
} from "@mui/material";
import Typography from "@mui/joy/Typography";
import { useQuery } from "@tanstack/react-query";
import { GetInfo } from "../types/getInfo";
import { GetSquad } from "../types/getSquad";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import { SelectedOption } from "../views/ShowPage";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import { Rnd, RndResizeCallback } from "react-rnd";
import { DraggableEvent } from "react-draggable";
import WithTitleBar from "./WithTitleBar";
import fetchWithRetry from "../api/fetch";
const SquadComponent = ({
  width,
  height,
  matchData,
  isMatchDataLoading,
  isTeam1SquadDataLoading,
  isTeam2SquadDataLoading,
  team1SquadData,
  team2SquadData,
  isARMode,
}: {
  width: number;
  height: number;
  matchData: GetInfo | undefined;
  isMatchDataLoading: boolean;
  isTeam1SquadDataLoading: boolean;
  isTeam2SquadDataLoading: boolean;
  team1SquadData: GetSquad | undefined;
  team2SquadData: GetSquad | undefined;
  isARMode: boolean;
}) => {
  return (
    <div
      style={{ width: width, height: height, overflow: "auto" }}
      className={isARMode ? "bg-white" : ""}
    >
      <TableContainer component={Paper}>
        <Table aria-label="squad table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography
                  level="title-md"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",

                    fontWeight: "900",
                  }}
                >
                  {matchData?.matchInfo.team1.name}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography
                  level="title-md"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",

                    fontWeight: "900",
                  }}
                >
                  {matchData?.matchInfo.team2.name}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isMatchDataLoading ||
            isTeam1SquadDataLoading ||
            isTeam2SquadDataLoading ? (
              <>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Box>
                      <Skeleton height={"2rem"} />
                      <Skeleton height={"2rem"} />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Skeleton height={"2rem"} />
                      <Skeleton height={"2rem"} />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Box>
                      <Skeleton height={"2rem"} />
                      <Skeleton height={"2rem"} />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Skeleton height={"2rem"} />
                      <Skeleton height={"2rem"} />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Box>
                      <Skeleton height={"2rem"} />
                      <Skeleton height={"2rem"} />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Skeleton height={"2rem"} />
                      <Skeleton height={"2rem"} />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1 }}>
                    <Box>
                      <Skeleton height={"2rem"} />
                      <Skeleton height={"2rem"} />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Skeleton height={"2rem"} />
                      <Skeleton height={"2rem"} />
                    </Box>
                  </TableCell>
                </TableRow>
              </>
            ) : (
              (team1SquadData &&
                team2SquadData &&
                team1SquadData.players["playing XI"].map((p, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ borderRight: 1 }}
                      >
                        <Box>
                          <Typography
                            level="title-md"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",

                              fontWeight: "800",
                            }}
                          >
                            {team1SquadData?.players["playing XI"][i].name ??
                              ""}
                          </Typography>
                          <Typography
                            level="body-sm"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {team1SquadData?.players["playing XI"][i].role ??
                              ""}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box>
                          <Typography
                            level="title-md"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",

                              fontWeight: "800",
                            }}
                          >
                            {team2SquadData?.players["playing XI"][i].name ??
                              ""}
                          </Typography>
                          <Typography
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {team2SquadData?.players["playing XI"][i].role ??
                              ""}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })) ?? <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
const Squad = React.memo(
  ({
    selections,
    setSelection,
    isARMode,
    matchData,
    isMatchDataLoading,
    isMatchDataError,
    isTeam1SquadDataLoading,
    isTeam2SquadDataLoading,
    team1SquadData,
    team2SquadData,
  }: {
    selections: SelectedOption[];
    setSelection: (option: SelectedOption[]) => void;
    isARMode: boolean;
    matchData: GetInfo | undefined;
    isMatchDataLoading: boolean;
    isMatchDataError: boolean;
    isTeam1SquadDataLoading: boolean;
    isTeam2SquadDataLoading: boolean;
    team1SquadData: GetSquad | undefined;
    team2SquadData: GetSquad | undefined;
  }) => {
    // const fetchInfo = async (matchId: string): Promise<GetInfo> => {
    //   const res = await fetchWithRetry(
    //     `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}`
    //   );
    //   return res;
    // };

    // const {
    //   isLoading: isMatchDataLoading,
    //   isError: isMatchDataError,
    //   data: matchData,
    // } = useQuery<GetInfo>({
    //   queryKey: ["infoData", matchId],
    //   queryFn: useCallback(() => fetchInfo(matchId), [matchId]),
    // });

    const { x: randomX, y: randomY } = getRandomCoordinates();
    const componentRef = React.useRef<HTMLDivElement>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const storedSquad = selections.find((s) => s.name === `Squad`);
    const {
      x = randomX,
      y = randomY,
      width = 350,
      height = 500,
    } = storedSquad ?? {};
    if (!storedSquad && !isMobile && !isARMode) {
      const newItems = [
        ...selections,
        {
          name: `Squad`,
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
      const option = newSelections.find((s) => s.name === `Squad`);
      if (option && !isMobile) {
        option.x = x;
        option.y = y;
        setSelection(newSelections);
        saveArrayToLocalStorage("selectedOptions", newSelections);
      }
    };

    const setSize = (w: number, h: number) => {
      const newSelections = [...selections];
      const option = newSelections.find((s) => s.name === `Squad`);
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

    return isARMode ? (
      <div
        style={{
          width: "100%",
          marginBottom: "1rem",
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
              component="h6"
              className="grow cursor-pointer select-none "
              style={{ color: "white" }}
            >
              {"Squad"}
            </Typography>
          </Toolbar>
        </AppBar>
        <SquadComponent
          width={window.screen.width}
          height={window.screen.height}
          matchData={matchData}
          isMatchDataLoading={isMatchDataLoading}
          isTeam1SquadDataLoading={isTeam1SquadDataLoading}
          isTeam2SquadDataLoading={isTeam2SquadDataLoading}
          team1SquadData={team1SquadData}
          team2SquadData={team2SquadData}
          isARMode={isARMode}
        />
      </div>
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
              {"Squad"}
            </Typography>
          </Toolbar>
        </AppBar>
        <SquadComponent
          width={window.screen.width}
          height={window.screen.height}
          matchData={matchData}
          isMatchDataLoading={isMatchDataLoading}
          isTeam1SquadDataLoading={isTeam1SquadDataLoading}
          isTeam2SquadDataLoading={isTeam2SquadDataLoading}
          team1SquadData={team1SquadData}
          team2SquadData={team2SquadData}
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
            title="Squad"
            width={componentRef.current?.getBoundingClientRect().width ?? width}
            height={
              componentRef.current?.getBoundingClientRect().height ?? height
            }
            storedKey="Squad"
            selections={selections}
            setSelection={setSelection}
          >
            <SquadComponent
              width={width}
              height={height}
              matchData={matchData}
              isMatchDataLoading={isMatchDataLoading}
              isTeam1SquadDataLoading={isTeam1SquadDataLoading}
              isTeam2SquadDataLoading={isTeam2SquadDataLoading}
              team1SquadData={team1SquadData}
              team2SquadData={team2SquadData}
              isARMode={isARMode}
            />
          </WithTitleBar>
        </div>
      </Rnd>
    );
  }
);

export default Squad;
