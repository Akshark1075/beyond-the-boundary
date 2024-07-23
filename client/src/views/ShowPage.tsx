import "../styles/ShowPage.css";
import React, { useEffect, useState } from "react";
import FloatingActionButton from "../Components/FloatingActionButton";
import { getArrayFromLocalStorage } from "../utilities/localStorageUtils";
import { useParams } from "react-router-dom";
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
export interface SelectedOption {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
const ShowPage = () => {
  const [selections, setSelection] = useState<SelectedOption[]>([]);
  useEffect(() => {
    // Retrieve the array from local storage on component mount
    const storedItems = getArrayFromLocalStorage("selectedOptions");
    setSelection(storedItems);
  }, []);
  const { matchId } = useParams();
  return (
    <>
      {/* //   <SpinningWheel 
    //     components={[
    //       {
    //         component: (
    //           <MatchInfo
    //             matchId={matchId ?? ""}
    //             selections={selections}
    //             setSelection={setSelection}
    //           />
    //         ),
    //         title: "Match Info",
    //       },
    //       {
    //         component: (
    //           <Squad
    //             matchId={matchId ?? ""}
    //             selections={selections}
    //             setSelection={setSelection}
    //           />
    //         ),
    //         title: "Squad",
    //       },
    //       {
    //         component: (
    //           <Video
    //             matchId={matchId ?? ""}
    //             selections={selections}
    //             setSelection={setSelection}
    //           />
    //         ),
    //         title: "Video",
    //       },
    //       {
    //         component: (
    //           <ScoreCardTable
    //             type="Batting"
    //             matchId={matchId ?? ""}
    //             selections={selections}
    //             setSelection={setSelection}
    //           />
    //         ),
    //         title: "Bat Scorecard",
    //       },
    //       {
    //         component: (
    //           <ScoreCardTable
    //             type="Bowling"
    //             matchId={matchId ?? ""}
    //             selections={selections}
    //             setSelection={setSelection}
    //           />
    //         ),
    //         title: "Bowl Scorecard",
    //       },
    //       {
    //         component: (
    //           <Scorecomparison
    //             matchId={matchId ?? ""}
    //             selections={selections}
    //             setSelection={setSelection}
    //           />
    //         ),
    //         title: "Score Comp",
    //       },
    //       {
    //         component: (
    //           <RunsPerOver
    //             matchId={matchId ?? ""}
    //             selections={selections}
    //             setSelection={setSelection}
    //           />
    //         ),
    //         title: "Runs Per Over",
    //       },
    //       {
    //         component: (
    //           <FieldPosition
    //             selections={selections}
    //             setSelection={setSelection}
    //           />
    //         ),
    //         title: "Field Pos",
    //       },
    //       {
    //         component: (
    //           <FallOfWickets
    //             matchId={matchId ?? ""}
    //             selections={selections}
    //             setSelection={setSelection}
    //           />
    //         ),
    //         title: "FOW",
    //       },
    //       {
    //         component: (
    //           <WagonWheelWrapper
    //             matchId={matchId ?? ""}
    //             selections={selections}
    //             setSelection={setSelection}
    //           />
    //         ),
    //         title: "Wagonwheel",
    //       },
    //     ]}
    //   />*/}
      <FloatingActionButton
        selections={selections}
        setSelection={setSelection}
      />
    </>
  );
};
export default ShowPage;
