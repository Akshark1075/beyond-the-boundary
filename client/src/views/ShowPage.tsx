import "../styles/ShowPage.css";
import React, { useEffect, useState } from "react";
import FloatingActionButton from "../Components/FloatingActionButton";
import {
  getArrayFromLocalStorage,
  saveArrayToLocalStorage,
} from "../utilities/localStorageUtils";
import { useParams, useSearchParams } from "react-router-dom";
import SpinningWheel from "../Components/SpinningWheel";
import RunsPerOver from "../Components/RunsPerOver";
import MatchInfo from "../Components/MatchInfo";
import Squad from "../Components/Squad";
import Video from "../Components/Video";
import ScoreCardTable from "../Components/ScoreCard";
import Scorecomparison from "../Components/ScoreComparison";
import FieldPosition from "../Components/FieldPosition";
import FallOfWickets from "../Components/FallOfWickets";
import WagonWheelWrapper from "../Components/WagonWheel";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box } from "@mui/material";
import DrawerAppBar from "../Components/Navbar";

export interface SelectedOption {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
const ShowPage = () => {
  const [selections, setSelection] = useState<SelectedOption[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    // Retrieve the array from local storage on component mount
    let storedItems = getArrayFromLocalStorage("selectedOptions");

    if (storedItems.length === 0) {
      storedItems = [
        {
          name: "Video",
          x: (window.innerWidth - 853) / 2,
          y: (window.innerHeight - 480) / 2,
          width: 853,
          height: 480,
        },

        {
          name: "Match Info",
          x: 0,
          y: 20,
          width: 350,
          height: 680,
        },

        {
          name: "Squad",
          x: window.innerWidth - 350,
          y: 20,
          width: 350,
          height: 680,
        },
      ];
    }
    setSelection(storedItems);
    saveArrayToLocalStorage("selectedOptions", storedItems);
  }, []);
  const { matchId } = useParams();
  const [searchParams] = useSearchParams();
  const isLive = searchParams.get("isLive");
  return (
    <Box className={"h-full sm:flex overflow-y-auto "}>
      <DrawerAppBar />;
      <Box className="mt-20 sm:mt-28 w-full ">
        {isMobile ? (
          <>
            <SpinningWheel
              components={[
                {
                  component: (
                    <MatchInfo
                      matchId={matchId ?? ""}
                      selections={selections}
                      setSelection={setSelection}
                    />
                  ),
                  title: "Match Info",
                },
                {
                  component: (
                    <Squad
                      matchId={matchId ?? ""}
                      selections={selections}
                      setSelection={setSelection}
                    />
                  ),
                  title: "Squad",
                },

                {
                  component: (
                    <ScoreCardTable
                      type="Batting"
                      matchId={matchId ?? ""}
                      selections={selections}
                      setSelection={setSelection}
                      isLive={isLive === "y"}
                    />
                  ),
                  title: "Bat Score",
                },
                {
                  component: (
                    <ScoreCardTable
                      type="Bowling"
                      matchId={matchId ?? ""}
                      selections={selections}
                      setSelection={setSelection}
                      isLive={isLive === "y"}
                    />
                  ),
                  title: "Bowl Score",
                },
                {
                  component: (
                    <Scorecomparison
                      matchId={matchId ?? ""}
                      selections={selections}
                      setSelection={setSelection}
                    />
                  ),
                  title: "Score Comp",
                },
                {
                  component: (
                    <RunsPerOver
                      matchId={matchId ?? ""}
                      selections={selections}
                      setSelection={setSelection}
                    />
                  ),
                  title: "RPO",
                },
                {
                  component: (
                    <FieldPosition
                      selections={selections}
                      setSelection={setSelection}
                    />
                  ),
                  title: "Field",
                },
                {
                  component: (
                    <FallOfWickets
                      matchId={matchId ?? ""}
                      selections={selections}
                      setSelection={setSelection}
                      isLive={isLive === "y"}
                    />
                  ),
                  title: "FOW",
                },
                {
                  component: (
                    <WagonWheelWrapper
                      matchId={matchId ?? ""}
                      selections={selections}
                      setSelection={setSelection}
                    />
                  ),
                  title: "Wheel",
                },
                {
                  component: (
                    <Video
                      matchId={matchId ?? ""}
                      selections={selections}
                      setSelection={setSelection}
                    />
                  ),
                  title: "Video",
                },
              ]}
            />
          </>
        ) : (
          <>
            <FloatingActionButton
              selections={selections}
              setSelection={setSelection}
            />
          </>
        )}
      </Box>
    </Box>
  );
};
export default ShowPage;
