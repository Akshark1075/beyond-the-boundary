// @ts-nocheck
import {
  Box,
  Card,
  Paper,
  SelectChangeEvent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Typography from "@mui/joy/Typography";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { GetRankings } from "../types/getRankings";
import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import fetchWithRetry from "../api/fetch";
type categories = "batsmen" | "bowlers" | "allrounders" | "teams";
type formatType = "test" | "odi" | "t20";
type isWomen = 1 | 0;
const fetchRankings = async (
  category: categories,
  formatType: formatType,
  isWomen?: isWomen
): Promise<Response> => {
  const res = await fetchWithRetry(
    `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/rankings/${category}?formatType=${formatType}${
      !!isWomen ? "&isWomen=1" : ""
    }`
  );
  return res;
};
//Component for presenting player and team rankings
const ICCRankings = () => {
  const categoriesTitles = ["Batting", "Bowling", "All-rounders", "Teams"];
  const categories: categories[] = [
    "batsmen",
    "bowlers",
    "allrounders",
    "teams",
  ];

  const [categoryIndex, setCategoryIndex] = React.useState(0);
  const [formatType, setFormatType] = React.useState("TEST");
  const { isLoading, isError, data } = useQuery<GetRankings>({
    queryKey: [`rankingsData-category ${categoryIndex}, ${formatType}`],
    queryFn: useCallback(
      () =>
        fetchRankings(
          categories[categoryIndex],
          formatType.toLocaleLowerCase() as formatType
        ),
      [categoryIndex, formatType]
    ),
  });

  const handleCategoryChange = (
    _event: React.ChangeEvent<{}>,
    newValue: string
  ) => {
    setCategoryIndex(Number(newValue));
  };
  const handleFormatChange = (event: SelectChangeEvent) => {
    setFormatType(event.target.value as string);
  };
  return (
    <Card
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        padding: "1rem",
      }}
    >
      <Typography
        component="h5"
        sx={{ color: "black", marginY: "1rem", fontWeight: "800" }}
      >
        {`ICC Cricket Rankings - ${categoriesTitles[categoryIndex]}`}
      </Typography>
      <Tabs
        aria-label="tabs"
        defaultValue={0}
        sx={{ marginY: "1rem" }}
        value={categoryIndex}
        onChange={handleCategoryChange}
      >
        <TabList
          sx={{
            overflow: "auto",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {categoriesTitles.map((value, index) => (
            <Tab
              key={index}
              sx={{
                flex: "none",
                color:
                  categoriesTitles[categoryIndex] === value
                    ? "#038062"
                    : "text.primary",
              }}
            >
              {value}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      <Box sx={{ width: 500, marginY: "1rem" }}>
        <RadioGroup
          aria-labelledby="storage-label"
          defaultValue="TEST"
          size="lg"
          sx={{ gap: 1.5, flexDirection: "row" }}
          onChange={handleFormatChange}
        >
          {["TEST", "ODI", "T20"].map((value) => (
            <Sheet
              key={value}
              variant={"solid"}
              sx={{
                p: 0.5,
                borderRadius: "lg",
                boxShadow: "sm",
                width: "80px",
                textAlign: "center",
                backgroundColor: formatType === value ? "#038062" : "#d1dfdb",
                "&:hover": {
                  bgcolor: formatType === value ? "#038062" : "#d1dfdb",
                },
              }}
            >
              <Radio
                label={value}
                overlay
                disableIcon
                value={value}
                slotProps={{
                  label: ({ checked }: { checked: boolean }) => ({
                    sx: {
                      fontWeight: "lg",
                      fontSize: "sm",
                      color: checked ? "white" : "text.primary",
                    },
                  }),
                  action: () => ({
                    sx: () => ({
                      "&:hover": {
                        bgcolor: formatType === value ? "#038062" : "#d1dfdb",
                      },
                    }),
                  }),
                }}
              />
            </Sheet>
          ))}
        </RadioGroup>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="rankings table">
          <TableHead>
            <TableRow>
              <TableCell scope="row">
                <Typography
                  level="title-md"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",

                    fontWeight: "800",
                  }}
                >
                  {"Rank"}
                </Typography>
              </TableCell>
              <TableCell scope="row">
                <Typography
                  level="title-md"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",

                    fontWeight: "800",
                  }}
                ></Typography>
              </TableCell>
              <TableCell scope="row">
                <Typography
                  level="title-md"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",

                    fontWeight: "800",
                  }}
                >
                  {"Player"}
                </Typography>
              </TableCell>
              <TableCell scope="row">
                <Typography
                  level="title-md"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",

                    fontWeight: "800",
                  }}
                >
                  {"Rating"}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading || isError ? (
              <>
                {new Array(3).fill(null).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell scope="row">
                      <Typography
                        sx={{
                          overflow: "hidden",
                        }}
                      >
                        <Skeleton height={"2rem"} />
                      </Typography>
                    </TableCell>
                    <TableCell scope="row">
                      <Typography
                        sx={{
                          overflow: "hidden",
                        }}
                      >
                        <Skeleton height={"2rem"} />
                      </Typography>
                    </TableCell>
                    <TableCell scope="row">
                      <Typography
                        sx={{
                          overflow: "hidden",
                        }}
                      >
                        <Skeleton height={"2rem"} />
                      </Typography>
                    </TableCell>
                    <TableCell scope="row">
                      <Typography
                        sx={{
                          overflow: "hidden",
                        }}
                      >
                        <Skeleton height={"2rem"} />
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              data?.rank.map((p) => (
                <TableRow>
                  <TableCell scope="row">
                    <Typography
                      level="body-md"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {p.rank}
                    </Typography>
                  </TableCell>
                  <TableCell scope="row">
                    <Typography
                      level="body-md"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {!!p.difference ? (
                        p.difference < 1 ? (
                          <>
                            <ArrowDropDownIcon /> {p.difference}
                          </>
                        ) : (
                          <>
                            <ArrowDropUpIcon /> {p.difference}
                          </>
                        )
                      ) : (
                        "-"
                      )}
                    </Typography>
                  </TableCell>

                  <TableCell scope="row">
                    <div className="flex flex-col gap-2">
                      <Typography
                        level="title-md"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",

                          fontWeight: "800",
                        }}
                      >
                        {p.name}
                      </Typography>

                      <Typography
                        level="body-sm"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",

                          fontWeight: "800",
                        }}
                      >
                        {p.country}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell scope="row">
                    <Typography
                      level="body-md"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        fontWeight: "800",
                      }}
                    >
                      {p.rating}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default ICCRankings;
