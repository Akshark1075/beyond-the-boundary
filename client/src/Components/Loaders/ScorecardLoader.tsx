import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Skeleton,
  TableBody,
  Box,
} from "@mui/material";
import React from "react";
import { ScoreCardType } from "../ScoreCard";
import { DraggableEvent } from "react-draggable";
import WithTitleBar from "../TitleBar";
import { Rnd, RndResizeCallback } from "react-rnd";
type Position = { x: number; y: number };
const ScoreCardLoader = ({
  type,
  width,
  height,
  position,
  setPosition,
  setSize,
}: {
  type: ScoreCardType;
  width: number;
  height: number;
  position: Position;
  setPosition: (x: number, y: number) => void;
  setSize: (width: number, height: number) => void;
}) => {
  const componentRef = React.useRef<HTMLDivElement>(null);
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
  return (
    <Rnd
      size={{ width: width, height: height }}
      position={position}
      onResize={handleResize}
      onDragStop={handleDragStop}
      minWidth={350}
      minHeight={350}
      bounds="window"
    >
      <div style={{ width: `${width}px` }}>
        <WithTitleBar
          title="Score Comparison"
          width={componentRef.current?.getBoundingClientRect().width ?? width}
          height={
            componentRef.current?.getBoundingClientRect().height ?? height
          }
        >
          <TableContainer component={Paper} style={{ boxShadow: "none" }}>
            <Box
              // @ts-ignore: Unreachable code error
              className="bg-slate-700"
              sx={{ width: 350 }}
            >
              <Skeleton variant="text" />
            </Box>
            <Table sx={{ width: 350 }} size="small" aria-label="a dense table">
              <TableHead>
                {type === "Batting" ? (
                  <TableRow className="bg-slate-300">
                    <TableCell>Batter</TableCell>
                    <TableCell></TableCell>
                    <TableCell align="center">R</TableCell>
                    <TableCell align="center">B</TableCell>
                    <TableCell align="center">4s</TableCell>
                    <TableCell align="center">6s</TableCell>
                    <TableCell align="center">SR</TableCell>
                  </TableRow>
                ) : (
                  <TableRow className="bg-slate-300">
                    <TableCell>Bowling</TableCell>

                    <TableCell align="center">O</TableCell>
                    <TableCell align="center">M</TableCell>
                    <TableCell align="center">R</TableCell>
                    <TableCell align="center">W</TableCell>
                    <TableCell align="center">NB</TableCell>
                    <TableCell align="center">WD</TableCell>
                    <TableCell align="center">ECO</TableCell>
                  </TableRow>
                )}
              </TableHead>
              <TableBody>
                {new Array(11).fill(undefined).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell component="th" scope="row">
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </WithTitleBar>
      </div>
    </Rnd>
  );
};
export default ScoreCardLoader;
