import React, { useState } from "react";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import "../styles/floatingActionButton.css";
import "../utilities/FloatingActionButton.js";
import ScoreCardTable from "./ScoreCard";
import RunsPerOver from "./RunsPerOver";
import Scorecomparison from "./ScoreComparison";
import { SelectedOption } from "../views/ShowPage";
import WagonWheelWrapper from "./WagonWheel";
import Video from "./Video";
import Squad from "./Squad";
import FallOfWickets from "./FallOfWickets";
import MatchInfo from "./MatchInfo";
import FieldPosition from "./FieldPosition";

const FloatingActionButton = ({
  selections,
  setSelection,
}: {
  selections: SelectedOption[];
  setSelection: (options: SelectedOption[]) => void;
}) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  const { matchId } = useParams();
  const handleMenuItemClick = (component: string) => {
    setSelectedComponent(component);
  };
  const renderComponent = () => {
    const battingScorecard = selections.find((s) =>
      s.name.includes("Batting Scorecard")
    );
    const bowlingScorecard = selections.find((s) =>
      s.name.includes("Bowling Scorecard")
    );
    const runsPerOver = selections.find((s) => s.name === "Runs per over");
    const scorecardComparison = selections.find(
      (s) => s.name === "Scorecard comparison"
    );
    const wagonWheel = selections.find((s) => s.name === "Wagonwheel");
    const video = selections.find((s) => s.name === "Video");
    const squad = selections.find((s) => s.name === "Squad");
    const fallOfWickets = selections.find((s) =>
      s.name.includes("Fall of wickets")
    );

    const fieldPosition = selections.find((s) =>
      s.name.includes("Field position")
    );
    const matchInfo = selections.find((s) => s.name.includes("Match info"));
    return (
      <>
        {(battingScorecard || selectedComponent === "Batting Scorecard") && (
          <ScoreCardTable
            matchId={matchId ?? ""}
            type={"Batting"}
            selections={selections}
            setSelection={setSelection}
          />
        )}

        {(bowlingScorecard || selectedComponent === "Bowling Scorecard") && (
          <ScoreCardTable
            matchId={matchId ?? ""}
            type={"Bowling"}
            selections={selections}
            setSelection={setSelection}
          />
        )}

        {(runsPerOver || selectedComponent === "Runs per over") && (
          <RunsPerOver
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
          />
        )}
        {(scorecardComparison ||
          selectedComponent === "Scorecard comparison") && (
          <Scorecomparison
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
          />
        )}
        {(wagonWheel || selectedComponent === "Wagonwheel") && (
          <WagonWheelWrapper
            selections={selections}
            setSelection={setSelection}
            matchId={matchId ?? ""}
          />
        )}
        {(video || selectedComponent === "Video") && (
          <Video
            selections={selections}
            setSelection={setSelection}
            matchId={matchId ?? ""}
          />
        )}
        {(squad || selectedComponent === "Squad") && (
          <Squad
            selections={selections}
            setSelection={setSelection}
            matchId={matchId ?? ""}
          />
        )}
        {(fallOfWickets || selectedComponent === "Fall of wickets") && (
          <FallOfWickets
            selections={selections}
            setSelection={setSelection}
            matchId={matchId ?? ""}
          />
        )}

        {(matchInfo || selectedComponent === "Match info") && (
          <MatchInfo
            selections={selections}
            setSelection={setSelection}
            matchId={matchId ?? ""}
          />
        )}

        {(fieldPosition || selectedComponent === "Field position") && (
          <FieldPosition selections={selections} setSelection={setSelection} />
        )}
      </>
    );
  };
  return (
    <>
      <div className="floatingButtonWrap">
        <div className="floatingButtonInner">
          <Button
            className="floatingButton"
            style={{ border: "5px solid #b2bedc", borderRadius: "50% 50%" }}
          >
            <i className="fa fa-plus icon-default"></i>
          </Button>
          <ul className="floatingMenu">
            <li>
              <Button onClick={() => handleMenuItemClick("Match info")}>
                Match Info
              </Button>
            </li>
            <li>
              <Button onClick={() => handleMenuItemClick("Video")}>
                Video
              </Button>
            </li>
            <li>
              <Button onClick={() => handleMenuItemClick("Batting Scorecard")}>
                Batting Scorecard
              </Button>
            </li>
            <li>
              <Button onClick={() => handleMenuItemClick("Bowling Scorecard")}>
                Bowling Scorecard
              </Button>
            </li>
            <li>
              <Button onClick={() => handleMenuItemClick("Runs per over")}>
                Runs per over
              </Button>
            </li>
            <li>
              <Button
                onClick={() => handleMenuItemClick("Scorecard comparison")}
              >
                Score Comparison
              </Button>
            </li>
            <li>
              <Button onClick={() => handleMenuItemClick("Wagonwheel")}>
                Wagonwheel
              </Button>
            </li>

            <li>
              <Button onClick={() => handleMenuItemClick("Squad")}>
                Squad
              </Button>
            </li>
            <li>
              <Button onClick={() => handleMenuItemClick("Fall of wickets")}>
                Fall Of Wickets
              </Button>
            </li>
            <li>
              <Button onClick={() => handleMenuItemClick("Field position")}>
                Field Position
              </Button>
            </li>
          </ul>
        </div>
      </div>
      {renderComponent()}
    </>
  );
};

export default FloatingActionButton;
