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

const ScoreCardLoader = ({ type }: { type: ScoreCardType }) => {
  return (
    <TableContainer component={Paper}>
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
  );
};
export default ScoreCardLoader;
