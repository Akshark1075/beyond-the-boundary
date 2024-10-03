import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { GetScorecard, ScoreCard } from "../types/getScorecard";
import { useRef } from "react";
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
import { DraggableEvent } from "react-draggable";
import WithTitleBar from "./WithTitleBar";
import { Rnd, RndResizeCallback } from "react-rnd";
import { SelectedOption } from "../views/ShowPage";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import getUpdatedZIndex from "../utilities/getUpdatedZIndex";

export type ScoreCardType = "Batting" | "Bowling";

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
  const [isDragging, setIsDragging] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const componentRef = React.useRef<HTMLDivElement>(null);
  const { x: randomX, y: randomY } = getRandomCoordinates();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  //Fetching the position and size of batting scorecard component
  const storedScorecard = selections.find(
    (s) => s.name === `Batting Scorecard ${row.inningsId}`
  );
  const {
    x = randomX,
    y = randomY,
    width = 350,
    height = 350,
    zIndex = 1,
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
      (s) => s.name === `Batting Scorecard ${row.inningsId}`
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
      (s) => s.name === `Batting Scorecard ${row.inningsId}`
    );
    if (option && !isMobile) {
      option.width = w;
      option.height = h;
      option.zIndex = getUpdatedZIndex(selections, option.name);
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };
  //Function for resizing the componenr
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
    setIsDragging(false);
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
          {/*Collapsable table body */}
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
      key={row.batTeamDetails.batTeamName}
      style={{ zIndex: isDragging ? 999999 : zIndex }}
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
  const [isDragging, setIsDragging] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const componentRef = useRef<HTMLDivElement>(null);
  const { x: randomX, y: randomY } = getRandomCoordinates();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  //Fetching the position and size of stored bowling scorecard component
  const storedScorecard = selections.find(
    (s) => s.name === `Bowling Scorecard ${row.inningsId}` && !isMobile
  );
  const {
    x = randomX,
    y = randomY,
    width = 350,
    height = 350,
    zIndex = 1,
  } = storedScorecard ?? {};
  //If the component is being used for the first time, store to local storage
  if (!storedScorecard && !isMobile && !isARMode) {
    const newItems = [
      ...selections,
      {
        name: `Bowling Scorecard ${row.inningsId}`,
        x: x,
        y: y,
        width: 350,
        height: 350,
        zIndex: 1,
      },
    ];
    setSelection(newItems);
    saveArrayToLocalStorage("selectedOptions", newItems);
  }
  //Function for resizing the component
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
  //Function for setting the new position
  const setPosition = (x: number, y: number) => {
    const newSelections = [...selections];
    const option = newSelections.find(
      (s) => s.name === `Bowling Scorecard ${row.inningsId}`
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
      (s) => s.name === `Bowling Scorecard ${row.inningsId}`
    );
    if (option && !isMobile) {
      option.width = w;
      option.height = h;
      option.zIndex = getUpdatedZIndex(selections, option.name);
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };
  //Functions for controlling the drag state
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
  //Component for displaying Bowling Scorecard
  const BowlingScorecardComponent = ({
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
          {/*Collapsable table body */}
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
  //Mobile and AR component
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
        style={{ background: "#303036", color: "white" }}
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
      <BowlingScorecardComponent />
    </div>
  ) : (
    //Customizable desktop interface
    <Rnd
      size={{ width: width, height: height }}
      position={{ x: x, y: y }}
      onResize={handleResize}
      onDragStart={handleDragStart}
      onDragStop={(e, data) => {
        const minY = 0; // You can set this to any value to add padding from the top.
        if (data.y < minY) {
          handleDragStop(e, { ...data, y: minY });
        } else {
          handleDragStop(e, data);
        }
      }}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
      minWidth={350}
      minHeight={350}
      key={row.bowlTeamDetails.bowlTeamName}
      style={{ zIndex: isDragging ? 999999 : zIndex }}
    >
      <div
        ref={componentRef}
        style={{ width: width, height: height, overflow: "auto" }}
      >
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
//Wrapper component for batting and bowling scorecard
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
  //ARMode
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
  //Non AR Mode
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
