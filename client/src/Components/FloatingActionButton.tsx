import React, { useState } from "react";
import { Button } from "@mui/material";
import ScoreIcon from "@mui/icons-material/Score";
import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import ListIcon from "@mui/icons-material/List";
import PinDropIcon from "@mui/icons-material/PinDrop";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CommentIcon from "@mui/icons-material/Comment";
import { Link, useParams } from "react-router-dom";
import "../styles/floatingActionButton.css";
import "../utilities/FloatingActionButton.js";
import ScoreCardTable from "./ScoreCard";
import RunsPerOver from "./RunsPerOver";
import Scorecomparison from "./ScoreComparison";
import { SelectedOption } from "../views/ShowPage";

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

  let { matchId } = useParams();
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
        {/* {selections.find((s) => s.name === "Score Comparison") && (
          <Scorecomparison matchId={matchId ?? ""} x={x} y={y} />
        )} */}
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
              <Button onClick={() => handleMenuItemClick("Score Comparison")}>
                Score Comparison
              </Button>
            </li>
            <li>
              <Button>Add Menu</Button>
            </li>
            <li>
              <Button>Go To Google</Button>
            </li>
            <li>
              <Button>Add Inventory</Button>
            </li>
            <li>
              <Button>Add Staff</Button>
            </li>
          </ul>
        </div>
      </div>
      {renderComponent()}
    </>
  );
};

export default FloatingActionButton;
