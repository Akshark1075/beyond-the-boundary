import React, { useRef, useState, useEffect, useCallback } from "react";
import Box from "@mui/joy/Box";
import { useQuery } from "@tanstack/react-query";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import getTrophyImage from "../utilities/getTrophyImage";
import MatchLoadingCard from "./Loaders/MatchLoadingCard";
import { useNavigate } from "react-router-dom";

interface GetLiveMatches {
  typeMatches: {
    matchType: string;
    seriesMatches: (
      | {
          seriesAdWrapper: {
            seriesId: number;
            seriesName: string;
            matches: {
              matchInfo: {
                matchId: number;
                seriesId: number;
                seriesName: string;
                matchDesc: string;
                matchFormat: string;
                startDate: string;
                endDate: string;
                state: string;
                status: string;
                team1: {
                  teamId: number;
                  teamName: string;
                  teamSName: string;
                  imageId: number;
                };
                team2: {
                  teamId: number;
                  teamName: string;
                  teamSName: string;
                  imageId: number;
                };
                venueInfo: {
                  id: number;
                  ground: string;
                  city: string;
                  timezone: string;
                };
                currBatTeamId: number;
                seriesStartDt: string;
                seriesEndDt: string;
                isTimeAnnounced: boolean;
                stateTitle: string;
              };
              matchScore: {
                team1Score: {
                  inngs1: {
                    inningsId: number;
                    runs: number;
                    wickets: number;
                    overs: number;
                  };
                  inngs2?: {
                    inningsId: number;
                    runs: number;
                    wickets: number;
                    overs: number;
                  };
                };
                team2Score: {
                  inngs1: {
                    inningsId: number;
                    runs: number;
                    wickets: number;
                    overs: number;
                  };
                  inngs2?: {
                    inningsId: number;
                    runs: number;
                    wickets: number;
                    overs: number;
                  };
                };
              };
            }[];
          };
        }
      | {
          adDetail: {
            name: string;
            layout: string;
            position: number;
          };
        }
    )[];
  }[];
  filters: {
    matchType: string[];
  };
  appIndex: {
    seoTitle: string;
    webURL: string;
  };
  responseLastUpdated: string;
}

type GetCountries = [
  {
    name: string;
    code: string;
    flag: string;
  }
];
type CardTypes = "live" | "upcoming" | "recent";
interface MatchCardProps {
  type: CardTypes;
}
const fetchMatches = async (type: string): Promise<Response> => {
  try {
    const res = await fetch(
      `https://cricbuzz-cricket.p.rapidapi.com/matches/v1/${type}`,
      {
        headers: {
          "x-rapidapi-host": "cricbuzz-cricket.p.rapidapi.com",
          "x-rapidapi-key":
            "71c49e5ccfmsh4e7224d6d7fbb0ap11128bjsnd1bdf317c93e",
        },
      }
    );
    if (!res.ok) {
      throw new Error("First API call failed");
    }
    return res;
  } catch (error) {
    const fallbackRes = await fetch(
      `https://cricbuzz-cricket.p.rapidapi.com/matches/v1/${type}`,
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
function MatchCard({ type }: MatchCardProps): JSX.Element {
  const { isPending, error, data } = useQuery<GetLiveMatches>({
    queryKey: [`matchesData-${type}`],
    queryFn: useCallback(
      () => fetchMatches(type).then((res) => res.json()),
      [type]
    ),
  });
  const {
    isPending: isCountriesPending,
    error: isCountriesError,
    data: countriesData,
  } = useQuery<GetCountries>({
    queryKey: ["countriesData"],
    queryFn: () =>
      fetch("https://cdn.simplelocalize.io/public/v1/countries").then((res) =>
        res.json()
      ),
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      setShowRightButton(true);
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      setShowLeftButton(true);
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      console.log(scrollLeft < scrollWidth - clientWidth);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  if (isPending || isCountriesPending)
    return <MatchLoadingCard showLeftButton showRightButton />;

  if (error || isCountriesError)
    return (
      <>
        <div>"An error has occurred: " + error.message</div>
      </>
    );
  const getFlag = (countryName: string) => {
    if (countriesData) {
      const foundCountry = countriesData.find((c) => c.name == countryName);
      return !!foundCountry ? foundCountry.flag : "🏴‍☠️";
    }
    return "🏴‍☠️";
  };
  const handleClick = (matchId: number) => {
    navigate(`/matches/${matchId}`);
  };

  return (
    // @ts-ignore: Unreachable code error
    <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
      {showLeftButton && (
        <IconButton
          onClick={handleScrollLeft}
          sx={{
            position: "absolute",
            left: 0,
            zIndex: 1,
            display: { xs: "none", md: "block" },
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
      )}
      <Box // @ts-ignore: Unreachable code error
        ref={scrollContainerRef}
        sx={{
          display: "flex",
          gap: 1,
          py: 1,
          overflow: "auto",
          scrollSnapType: "x mandatory",
          "& > *": {
            scrollSnapAlign: "center",
          },
          "::-webkit-scrollbar": { display: "none" },
        }}
      >
        {data.typeMatches[0].seriesMatches.map((series) => {
          if ("seriesAdWrapper" in series) {
            return series.seriesAdWrapper?.matches.map((item) => {
              return (
                <Card
                  orientation="horizontal"
                  size="sm"
                  key={item.matchInfo.matchId}
                  variant="outlined"
                  onClick={() => {
                    if (type !== "upcoming") {
                      handleClick(item.matchInfo.matchId);
                    }
                  }}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    minWidth: "450px",
                    maxWidth: "450px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "25px",
                    }}
                  >
                    <AspectRatio ratio="1" sx={{ width: 60, height: "100%" }}>
                      <img
                        srcSet={`logos/${getTrophyImage(
                          item.matchInfo.seriesName
                        )}?h=120&fit=crop&auto=format`}
                        src={`logos/${getTrophyImage(
                          item.matchInfo.seriesName
                        )}?h=120&fit=crop&auto=format`}
                        alt={item.matchInfo.seriesName ?? ""}
                      />
                    </AspectRatio>
                    <Box sx={{ whiteSpace: "nowrap", mx: 1, flex: 1 }}>
                      <Typography
                        noWrap
                        level="title-md"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.matchInfo.seriesName}
                      </Typography>
                      <Typography
                        level="title-md"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "90%",
                        }}
                      >
                        {item.matchInfo.matchDesc}
                      </Typography>
                      <Typography
                        level="body-sm"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {item.matchInfo.venueInfo.ground}
                      </Typography>
                      <Typography
                        level="body-sm"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {`${getFlag(item.matchInfo.team1.teamName)} ${
                          item.matchInfo.team1.teamName
                        } ${
                          type !== "upcoming"
                            ? item.matchScore?.team1Score?.inngs1?.runs +
                              " - " +
                              (item.matchScore?.team1Score?.inngs1?.wickets ??
                                0) +
                              " (" +
                              item.matchScore?.team1Score?.inngs1?.overs +
                              ") " +
                              (!!item.matchScore?.team1Score?.inngs2
                                ? item.matchScore?.team1Score?.inngs2?.runs +
                                  " - " +
                                  (item.matchScore?.team1Score?.inngs2
                                    ?.wickets ?? 0) +
                                  " (" +
                                  item.matchScore?.team1Score?.inngs2?.overs +
                                  ") "
                                : "")
                            : ""
                        }`}
                      </Typography>
                      <Typography
                        level="body-sm"
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {`${getFlag(item.matchInfo.team2.teamName)} ${
                          item.matchInfo.team2.teamName
                        } ${
                          type !== "upcoming"
                            ? item.matchScore?.team2Score?.inngs1?.runs +
                              " - " +
                              (item.matchScore?.team2Score?.inngs1?.wickets ??
                                0) +
                              " (" +
                              item.matchScore?.team2Score?.inngs1?.overs +
                              ") " +
                              (!!item.matchScore?.team2Score?.inngs2
                                ? item.matchScore?.team2Score?.inngs2?.runs +
                                  " - " +
                                  (item.matchScore?.team2Score?.inngs2
                                    ?.wickets ?? 0) +
                                  " (" +
                                  item.matchScore?.team2Score?.inngs2?.overs +
                                  ") "
                                : "")
                            : ""
                        }`}
                      </Typography>
                    </Box>
                  </Box>
                  <hr />

                  <Typography
                    level="body-md"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "black",
                    }}
                  >
                    {item.matchInfo.status}
                  </Typography>
                </Card>
              );
            });
          }
        })}
      </Box>
      {showRightButton && (
        <IconButton
          onClick={handleScrollRight}
          sx={{
            position: "absolute",
            right: 0,
            zIndex: 1,
            display: { xs: "none", md: "block" },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  );
}
export default MatchCard;
