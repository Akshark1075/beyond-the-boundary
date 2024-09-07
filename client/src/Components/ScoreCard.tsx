import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { GetScorecard, ScoreCard } from "../types/getScorecard";
import { useCallback, useRef } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ScoreCardLoader from "./Loaders/ScorecardLoader";
import { DraggableEvent } from "react-draggable";
import WithTitleBar from "./WithTitleBar";
import { useQuery } from "@tanstack/react-query";
import { Rnd, RndResizeCallback } from "react-rnd";
import { SelectedOption } from "../views/ShowPage";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import fetchWithRetry from "../api/fetch";

export type ScoreCardType = "Batting" | "Bowling";

// const fetchScorecard = async (matchId: string): Promise<Response> => {
//   const res = await fetchWithRetry(
//     `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/hscard`
//   );

//   return res;
// };

const BattingScorecard = ({
  row,

  isLoading,
  isError,
  selections,
  setSelection,
  isARMode,
}: {
  row: ScoreCard;
  isARMode: boolean;
  isLoading: boolean;
  isError: boolean;
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
}) => {
  const [open, setOpen] = React.useState(true);
  const componentRef = React.useRef<HTMLDivElement>(null);
  const { x: randomX, y: randomY } = getRandomCoordinates();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const storedScorecard = selections.find(
    (s) => s.name === `Batting Scorecard ${row.inningsId}`
  );
  console.log("S");
  const {
    x = randomX,
    y = randomY,
    width = 350,
    height = 350,
  } = storedScorecard ?? {};
  if (!storedScorecard && !isMobile && !isARMode) {
    const newItems = [
      ...selections,
      {
        name: `Batting Scorecard ${row.inningsId}`,
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
      (s) => s.name === `Batting Scorecard ${row.inningsId}`
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
      (s) => s.name === `Batting Scorecard ${row.inningsId}`
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

  const BattingScorecardComponent = ({
    width,
    height,
  }: {
    width?: number;
    height?: number;
  }) => {
    return (
      <TableContainer
        component={Paper}
        style={{
          boxShadow: "none",
          background: "white",
          width: isMobile
            ? window.screen.width
            : width
            ? `${width}px`
            : "350px",
        }}
      >
        <Box
          // @ts-ignore: Unreachable code error
          sx={{
            width: width ? width : window.screen.width,
            backgroundColor: "#303036",
          }}
          className=" flex justify-between"
        >
          <Box className="px-4 text-white">{`${row.batTeamDetails.batTeamName} Innings`}</Box>
          <Box className="flex px-4">
            <Box className="text-white" style={{ color: "white" }}>
              {row.scoreDetails.runs +
                "-" +
                row.scoreDetails.wickets +
                (row.scoreDetails.isDeclared ? " d " : "") +
                (row.scoreDetails.isFollowOn ? " (f/o) " : "") +
                "(" +
                row.scoreDetails.overs +
                " Ov)"}
            </Box>
            <Box>
              {!isARMode && (
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
        <Table
          sx={{
            width: isMobile
              ? window.screen.width
              : width
              ? `${width}px`
              : "350px",
            tableLayout: "fixed",
          }}
          size="small"
          aria-label="a dense table"
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <TableHead>
              <TableRow className="bg-slate-300">
                <TableCell
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  Batter
                </TableCell>
                <TableCell
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                ></TableCell>
                <TableCell
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  R
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  B
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  4s
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  6s
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  SR
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {new Array(11).fill(undefined).map((x, i) => {
                return (
                  <TableRow
                    key={row.batTeamDetails.batsmenData[`bat_${i + 1}`]?.batId}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      style={{
                        paddingLeft: "2px",
                        paddingRight: "2px",
                      }}
                    >
                      {row.batTeamDetails.batsmenData[`bat_${i + 1}`]?.batName}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        paddingLeft: "2px",
                        paddingRight: "2px",
                      }}
                    >
                      {row.batTeamDetails.batsmenData[`bat_${i + 1}`]
                        ?.outDesc ?? "Did not bat"}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        paddingLeft: "2px",
                        paddingRight: "2px",
                      }}
                    >
                      {row.batTeamDetails.batsmenData[`bat_${i + 1}`]?.runs ??
                        0}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        paddingLeft: "2px",
                        paddingRight: "2px",
                      }}
                    >
                      {row.batTeamDetails.batsmenData[`bat_${i + 1}`]?.balls ??
                        0}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        paddingLeft: "2px",
                        paddingRight: "2px",
                      }}
                    >
                      {row.batTeamDetails.batsmenData[`bat_${i + 1}`]?.fours ??
                        0}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        paddingLeft: "2px",
                        paddingRight: "2px",
                      }}
                    >
                      {row.batTeamDetails.batsmenData[`bat_${i + 1}`]?.sixes ??
                        0}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        paddingLeft: "2px",
                        paddingRight: "2px",
                      }}
                    >
                      {row.batTeamDetails.batsmenData[`bat_${i + 1}`]
                        ?.strikeRate ?? 0.0}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell colSpan={2}>Extras</TableCell>

                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                  colSpan={5}
                >
                  {`${row.extrasData.total}(b ${row.extrasData.byes}, lb ${row.extrasData.legByes}, w ${row.extrasData.wides}, nb ${row.extrasData.noBalls}, p ${row.extrasData.noBalls})`}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell colSpan={4}>
                  <b>Total</b>
                </TableCell>

                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                  colSpan={3}
                >
                  {`${row.scoreDetails?.runs} (${row.scoreDetails?.wickets} Wkts, ${row.scoreDetails?.overs}Ov)`}
                </TableCell>
              </TableRow>
            </TableBody>
          </Collapse>
        </Table>
      </TableContainer>
    );
  };
  console.log(isARMode, "ar");
  return isMobile || isARMode ? (
    <div
      style={{
        width: window.screen.width,
        marginBottom: "1rem",
        overflowY: "scroll",
        background: "white",
      }}
    >
      <AppBar
        position="static"
        style={{ background: "#303036", color: "white" }}
        className="grow"
      >
        <Toolbar variant="dense" className="px-2 min-h-8">
          <Typography
            component="h6"
            className="grow cursor-pointer select-none"
          >
            {`Batting Scorecard ${row.inningsId}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <BattingScorecardComponent />
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
          title={`Batting Scorecard ${row.inningsId}`}
          width={componentRef.current?.getBoundingClientRect().width ?? width}
          height={
            componentRef.current?.getBoundingClientRect().height ?? height
          }
          storedKey={`Batting Scorecard ${row.inningsId}`}
          // handleClose={handleClose}
          selections={selections}
          setSelection={setSelection}
        >
          <BattingScorecardComponent width={width} height={height} />
        </WithTitleBar>
      </div>
    </Rnd>
  );
};

const BowlingScorecard = ({
  row,
  isARMode,
  isLoading,
  isError,
  selections,
  setSelection,
}: {
  row: ScoreCard;
  isARMode: boolean;
  isLoading: boolean;
  isError: boolean;
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
}) => {
  const [open, setOpen] = React.useState(true);
  const componentRef = useRef<HTMLDivElement>(null);
  const { x: randomX, y: randomY } = getRandomCoordinates();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const storedScorecard = selections.find(
    (s) => s.name === `Bowling Scorecard ${row.inningsId}` && !isMobile
  );
  const {
    x = randomX,
    y = randomY,
    width = 350,
    height = 350,
  } = storedScorecard ?? {};

  if (!storedScorecard && !isMobile && !isARMode) {
    const newItems = [
      ...selections,
      {
        name: `Bowling Scorecard ${row.inningsId}`,
        x: x,
        y: y,
        width: 350,
        height: 350,
      },
    ];
    setSelection(newItems);
    saveArrayToLocalStorage("selectedOptions", newItems);
  }

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
  const setPosition = (x: number, y: number) => {
    const newSelections = [...selections];
    const option = newSelections.find(
      (s) => s.name === `Bowling Scorecard ${row.inningsId}`
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
      (s) => s.name === `Bowling Scorecard ${row.inningsId}`
    );
    if (option && !isMobile) {
      option.width = w;
      option.height = h;
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };
  const handleDragStop = (e: DraggableEvent, d: { x: number; y: number }) => {
    setPosition(d.x, d.y);
  };
  const BowlingScorecardComponent = ({
    width,
    height,
  }: {
    width?: number;
    height?: number;
  }) => {
    return (
      <TableContainer component={Paper} style={{ boxShadow: "none" }}>
        <Box
          // @ts-ignore: Unreachable code error
          sx={{
            width: width ? width : window.screen.width,
            backgroundColor: "#303036",
          }}
          className=" flex justify-between"
          style={{ color: "white" }}
        >
          <Box className="px-4 text-white">{`${row.batTeamDetails.batTeamName} Innings`}</Box>
          <Box className="flex px-4">
            <Box className="text-white" style={{ color: "white" }}>
              {row.scoreDetails.runs +
                "-" +
                row.scoreDetails.wickets +
                (row.scoreDetails.isDeclared ? " d " : "") +
                (row.scoreDetails.isFollowOn ? " (f/o) " : "") +
                "(" +
                row.scoreDetails.overs +
                " Ov)"}
            </Box>
            <Box>
              {!isARMode && (
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
        <Table
          sx={{
            width: width ? `${width}px` : window.screen.width,
            tableLayout: "fixed",
          }}
          size="small"
          aria-label="a dense table"
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <TableHead>
              <TableRow className="bg-slate-300">
                <TableCell>Bowling</TableCell>

                <TableCell
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  O
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  M
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  R
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  W
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  NB
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  WD
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  ECO
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {new Array(11).fill(undefined).map((x, i) => {
                return (
                  row.bowlTeamDetails.bowlersData[`bowl_${i + 1}`] && (
                    <TableRow
                      key={
                        row.bowlTeamDetails.bowlersData[`bowl_${i + 1}`]
                          ?.bowlerId
                      }
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {
                          row.bowlTeamDetails.bowlersData[`bowl_${i + 1}`]
                            ?.bowlName
                        }
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          paddingLeft: "2px",
                          paddingRight: "2px",
                        }}
                      >
                        {row.bowlTeamDetails.bowlersData[`bowl_${i + 1}`]
                          ?.overs ?? 0}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          paddingLeft: "2px",
                          paddingRight: "2px",
                        }}
                      >
                        {row.bowlTeamDetails.bowlersData[`bowl_${i + 1}`]
                          ?.maidens ?? 0}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          paddingLeft: "2px",
                          paddingRight: "2px",
                        }}
                      >
                        {row.bowlTeamDetails.bowlersData[`bowl_${i + 1}`]
                          ?.runs ?? 0}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          paddingLeft: "2px",
                          paddingRight: "2px",
                        }}
                      >
                        {row.bowlTeamDetails.bowlersData[`bowl_${i + 1}`]
                          ?.wickets ?? 0}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          paddingLeft: "2px",
                          paddingRight: "2px",
                        }}
                      >
                        {row.bowlTeamDetails.bowlersData[`bowl_${i + 1}`]
                          ?.no_balls ?? 0}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          paddingLeft: "2px",
                          paddingRight: "2px",
                        }}
                      >
                        {row.bowlTeamDetails.bowlersData[`bowl_${i + 1}`]
                          ?.wides ?? 0}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          paddingLeft: "2px",
                          paddingRight: "2px",
                        }}
                      >
                        {row.bowlTeamDetails.bowlersData[`bowl_${i + 1}`]
                          ?.economy ?? 0.0}
                      </TableCell>
                    </TableRow>
                  )
                );
              })}
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell colSpan={2}>Extras</TableCell>

                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                  colSpan={5}
                >
                  {`${row.extrasData.total}(b ${row.extrasData.byes}, lb ${row.extrasData.legByes}, w ${row.extrasData.wides}, nb ${row.extrasData.noBalls}, p ${row.extrasData.noBalls})`}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell colSpan={4}>
                  <b>Total</b>
                </TableCell>

                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  style={{
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                  colSpan={3}
                >
                  {`${row.scoreDetails.runs} (${row.scoreDetails.wickets} Wkts, ${row.scoreDetails.overs}Ov)`}
                </TableCell>
              </TableRow>
            </TableBody>
          </Collapse>
        </Table>
      </TableContainer>
    );
  };

  return isMobile || isARMode ? (
    <div
      style={{
        width: window.screen.width,
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
          >
            {`Bowling Scorecard ${row.inningsId}`}
          </Typography>
        </Toolbar>
      </AppBar>
      {/* <BowlingScorecardComponent /> */}
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
      key={row.bowlTeamDetails.bowlTeamName}
    >
      <div ref={componentRef} style={{ overflow: "scroll" }}>
        <WithTitleBar
          title={`Bowling Scorecard ${row.inningsId}`}
          width={componentRef.current?.getBoundingClientRect().width ?? width}
          height={
            componentRef.current?.getBoundingClientRect().height ?? height
          }
          storedKey={`Bowling Scorecard ${row.inningsId}`}
          selections={selections}
          setSelection={setSelection}
        >
          <BowlingScorecardComponent width={width} height={height} />
        </WithTitleBar>
      </div>
    </Rnd>
  );
};

export default function ScoreCardTable({
  type,

  selections,
  setSelection,
  isARMode,
  data,
  isLoading,
  isError,
}: {
  type: ScoreCardType;

  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
  isARMode: boolean;
  data: GetScorecard | undefined;
  isLoading: boolean;
  isError: boolean;
}) {
  // const { isLoading, isError, data } = useQuery<GetScorecard>({
  //   queryKey: [`scoresData-${matchId}`],
  //   queryFn: useCallback(
  //     () => fetchScorecard(matchId).then((res) => res.json()),
  //     [matchId]
  //   ),
  //   refetchInterval: isLive ? 30000 : undefined,
  // });
  // console.log(data, "sc");
  console.log(type);
  if (isARMode) {
    if (data?.scoreCard) {
      if (type === "Batting") {
        return (
          <BattingScorecard
            row={data.scoreCard[data.scoreCard.length - 1]}
            isLoading={isLoading}
            isError={isError}
            selections={selections}
            setSelection={setSelection}
            key={data.scoreCard[data.scoreCard.length - 1].inningsId}
            isARMode={isARMode}
          />
        );
      } else {
        return (
          <BowlingScorecard
            row={data.scoreCard[data.scoreCard.length - 1]}
            isLoading={isLoading}
            isError={isError}
            selections={selections}
            setSelection={setSelection}
            key={data.scoreCard[data.scoreCard.length - 1].inningsId}
            isARMode={isARMode}
          />
        );
      }
    }
  }
  return (
    <>
      {data?.scoreCard.map((row) => {
        if (type === "Batting") {
          return (
            <BattingScorecard
              row={row}
              isLoading={isLoading}
              isError={isError}
              selections={selections}
              setSelection={setSelection}
              key={row.inningsId}
              isARMode={isARMode}
            />
          );
        } else {
          return (
            <BowlingScorecard
              row={row}
              isLoading={isLoading}
              isError={isError}
              selections={selections}
              setSelection={setSelection}
              key={row.inningsId}
              isARMode={isARMode}
            />
          );
        }
      })}
    </>
  );
}
