import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useQuery } from "@tanstack/react-query";
import { GetScorecard } from "../types/getScorecard";
import { useCallback } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { Box } from "@mui/material";
import ScoreCardLoader from "./ScorecardLoader";
export type ScoreCardType = "Batting" | "Bowling";

const fetchScorecard = async (matchID: string): Promise<Response> => {
  try {
    const res = await fetch(
      `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchID}/hscard`,
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
      `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchID}/hscard`,
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

export default function DenseTable({
  matchID,
  type,
}: {
  matchID: string;
  type: ScoreCardType;
}) {
  const [open, setOpen] = React.useState(true);
  const { isLoading, error, data } = useQuery<GetScorecard>({
    queryKey: ["scoresData", matchID],
    queryFn: useCallback(
      () => fetchScorecard(matchID).then((res) => res.json()),
      [matchID]
    ),
  });
  if (isLoading || error) return <ScoreCardLoader type="Batting" />;
  else
    return (
      <>
        {data?.scoreCard.map((row) => (
          <TableContainer component={Paper} style={{ boxShadow: "none" }}>
            <Box
              // @ts-ignore: Unreachable code error
              sx={{ width: 350 }}
              className="bg-slate-700 flex justify-between"
            >
              <Box className="px-4">{`${row.batTeamDetails.batTeamName} Innings`}</Box>
              <Box className="flex px-4">
                <Box className="text-white">
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
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                  >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Table
              sx={{ width: "350px", tableLayout: "fixed" }}
              size="small"
              aria-label="a dense table"
            >
              <Collapse in={open} timeout="auto" unmountOnExit>
                {type === "Batting" ? (
                  <>
                    <TableHead>
                      <TableRow className="bg-slate-300">
                        <TableCell
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                        >
                          Batter
                        </TableCell>
                        <TableCell
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                        ></TableCell>
                        <TableCell
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                        >
                          R
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                        >
                          B
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                        >
                          4s
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                        >
                          6s
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                        >
                          SR
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {new Array(11).fill(undefined).map((x, i) => {
                        return (
                          <TableRow
                            key={
                              row.batTeamDetails.batsmenData[`bat_${i + 1}`]
                                ?.batId
                            }
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
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
                              {
                                row.batTeamDetails.batsmenData[`bat_${i + 1}`]
                                  ?.batName
                              }
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
                              {row.batTeamDetails.batsmenData[`bat_${i + 1}`]
                                ?.runs ?? 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{
                                paddingLeft: "2px",
                                paddingRight: "2px",
                              }}
                            >
                              {row.batTeamDetails.batsmenData[`bat_${i + 1}`]
                                ?.balls ?? 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{
                                paddingLeft: "2px",
                                paddingRight: "2px",
                              }}
                            >
                              {row.batTeamDetails.batsmenData[`bat_${i + 1}`]
                                ?.fours ?? 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{
                                paddingLeft: "2px",
                                paddingRight: "2px",
                              }}
                            >
                              {row.batTeamDetails.batsmenData[`bat_${i + 1}`]
                                ?.sixes ?? 0}
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
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell colSpan={2}>Extras</TableCell>

                        <TableCell
                          component="th"
                          scope="row"
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                          colSpan={5}
                        >
                          {`${row.extrasData.total}(b ${row.extrasData.byes}, lb ${row.extrasData.legByes}, w ${row.extrasData.wides}, nb ${row.extrasData.noBalls}, p ${row.extrasData.noBalls})`}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell colSpan={4}>
                          <b>Total</b>
                        </TableCell>

                        <TableCell
                          component="th"
                          scope="row"
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                          colSpan={3}
                        >
                          {`${row.scoreDetails?.runs} (${row.scoreDetails?.wickets} Wkts, ${row.scoreDetails?.overs}Ov)`}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </>
                ) : (
                  <>
                    <TableHead>
                      <TableRow className="bg-slate-300">
                        <TableCell>Bowling</TableCell>

                        <TableCell
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                        >
                          O
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                        >
                          M
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                        >
                          R
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                        >
                          W
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                        >
                          NB
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                        >
                          WD
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
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
                                  row.bowlTeamDetails.bowlersData[
                                    `bowl_${i + 1}`
                                  ]?.bowlName
                                }
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{
                                  paddingLeft: "2px",
                                  paddingRight: "2px",
                                }}
                              >
                                {row.bowlTeamDetails.bowlersData[
                                  `bowl_${i + 1}`
                                ]?.overs ?? 0}
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{
                                  paddingLeft: "2px",
                                  paddingRight: "2px",
                                }}
                              >
                                {row.bowlTeamDetails.bowlersData[
                                  `bowl_${i + 1}`
                                ]?.maidens ?? 0}
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{
                                  paddingLeft: "2px",
                                  paddingRight: "2px",
                                }}
                              >
                                {row.bowlTeamDetails.bowlersData[
                                  `bowl_${i + 1}`
                                ]?.runs ?? 0}
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{
                                  paddingLeft: "2px",
                                  paddingRight: "2px",
                                }}
                              >
                                {row.bowlTeamDetails.bowlersData[
                                  `bowl_${i + 1}`
                                ]?.wickets ?? 0}
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{
                                  paddingLeft: "2px",
                                  paddingRight: "2px",
                                }}
                              >
                                {row.bowlTeamDetails.bowlersData[
                                  `bowl_${i + 1}`
                                ]?.no_balls ?? 0}
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{
                                  paddingLeft: "2px",
                                  paddingRight: "2px",
                                }}
                              >
                                {row.bowlTeamDetails.bowlersData[
                                  `bowl_${i + 1}`
                                ]?.wides ?? 0}
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{
                                  paddingLeft: "2px",
                                  paddingRight: "2px",
                                }}
                              >
                                {row.bowlTeamDetails.bowlersData[
                                  `bowl_${i + 1}`
                                ]?.economy ?? 0.0}
                              </TableCell>
                            </TableRow>
                          )
                        );
                      })}
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell colSpan={2}>Extras</TableCell>

                        <TableCell
                          component="th"
                          scope="row"
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                          colSpan={5}
                        >
                          {`${row.extrasData.total}(b ${row.extrasData.byes}, lb ${row.extrasData.legByes}, w ${row.extrasData.wides}, nb ${row.extrasData.noBalls}, p ${row.extrasData.noBalls})`}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell colSpan={4}>
                          <b>Total</b>
                        </TableCell>

                        <TableCell
                          component="th"
                          scope="row"
                          align="center"
                          style={{ paddingLeft: "2px", paddingRight: "2px" }}
                          colSpan={3}
                        >
                          {`${row.scoreDetails.runs} (${row.scoreDetails.wickets} Wkts, ${row.scoreDetails.overs}Ov)`}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </>
                )}
              </Collapse>
            </Table>
          </TableContainer>
        ))}
        )
      </>
    );
}
