import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";
import "../styles/floatingActionButton.css";
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

interface FloatingActionButtonProps {
  selections: SelectedOption[];
  setSelection: (options: SelectedOption[]) => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  selections,
  setSelection,
}) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const { matchId } = useParams();
  const [searchParams] = useSearchParams();
  const isLive = searchParams.get("isLive");
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
      s.name.includes("Field positions")
    );
    const matchInfo = selections.find((s) => s.name.includes("Match Info"));

    return (
      <>
        {(battingScorecard || selectedComponent === "Batting Scorecard") && (
          <ScoreCardTable
            matchId={matchId ?? ""}
            type={"Batting"}
            selections={selections}
            setSelection={setSelection}
            isLive={isLive === "y"}
          />
        )}

        {(bowlingScorecard || selectedComponent === "Bowling Scorecard") && (
          <ScoreCardTable
            matchId={matchId ?? ""}
            type={"Bowling"}
            selections={selections}
            setSelection={setSelection}
            isLive={isLive === "y"}
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
            isLive={isLive === "y"}
          />
        )}

        {(matchInfo || selectedComponent === "Match Info") && (
          <MatchInfo
            selections={selections}
            setSelection={setSelection}
            matchId={matchId ?? ""}
          />
        )}

        {(fieldPosition || selectedComponent === "Field positions") && (
          <FieldPosition selections={selections} setSelection={setSelection} />
        )}
      </>
    );
  };

  useEffect(() => {
    const handleFloatingButtonClick = (e: Event) => {
      e.preventDefault();
      const floatingButtonWrap = e.currentTarget as HTMLElement;
      floatingButtonWrap.classList.toggle("open");

      const icon = floatingButtonWrap.querySelector(".fa") as HTMLElement;
      if (icon.classList.contains("fa-plus")) {
        icon.classList.remove("fa-plus");
        icon.classList.add("fa-close");
      } else if (icon.classList.contains("fa-close")) {
        icon.classList.remove("fa-close");
        icon.classList.add("fa-plus");
      }

      const floatingMenu = document.querySelector(
        ".floatingMenu"
      ) as HTMLElement;
      if (floatingMenu) {
        floatingMenu.style.display =
          floatingMenu.style.display === "none" ? "block" : "none";
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const container = document.querySelector(
        ".floatingButton"
      ) as HTMLElement;

      if (
        container &&
        !container.contains(e.target as Node) &&
        !document
          .querySelector(".floatingButtonWrap")
          ?.contains(e.target as Node)
      ) {
        if (container.classList.contains("open")) {
          container.classList.remove("open");
        }
        const icon = container.querySelector(".fa") as HTMLElement;
        if (icon && icon.classList.contains("fa-close")) {
          icon.classList.remove("fa-close");
          icon.classList.add("fa-plus");
        }
        const floatingMenu = document.querySelector(
          ".floatingMenu"
        ) as HTMLElement;
        if (floatingMenu) {
          floatingMenu.style.display = "none";
        }
      }

      if (
        container &&
        !container.contains(e.target as Node) &&
        document.querySelector(".floatingMenu")?.contains(e.target as Node)
      ) {
        container.classList.remove("open");
        const floatingMenu = document.querySelector(
          ".floatingMenu"
        ) as HTMLElement;
        if (floatingMenu) {
          floatingMenu.style.display =
            floatingMenu.style.display === "none" ? "block" : "none";
        }
      }
    };

    const floatingButtonWrap = document.querySelector(".floatingButtonWrap");
    floatingButtonWrap?.addEventListener("click", handleFloatingButtonClick);
    document.addEventListener("click", handleClickOutside);

    return () => {
      floatingButtonWrap?.removeEventListener(
        "click",
        handleFloatingButtonClick
      );
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const components = [
    { title: "Match Info", key: "Match Info" },
    { title: "Video", key: "Video" },
    { title: "Batting Scorecard", key: "Batting Scorecard" },
    { title: "Bowling Scorecard", key: "Bowling Scorecard" },
    { title: "Runs Per Over", key: "Runs per over" },
    { title: "Score Comparison", key: "Scorecard comparison" },
    {
      title: "Wagonwheel",
      key: "Wagonwheel",
    },
    { title: "Squad", key: "Squad" },
    {
      title: "Fall Of Wickets",
      key: "Fall of wickets",
    },
    { title: "Field Placements", key: "Field positions" },
  ];

  const filteredOptions = components.filter(
    (c) => !selections.find((s) => s.name === c.key)
  );

  return (
    <>
      <div className="floatingButtonWrap">
        <div className="floatingButtonInner">
          <Button
            className="floatingButton"
            style={{ border: "5px solid #b2bedc", borderRadius: "50%" }}
          >
            <i className="fa fa-plus icon-default"></i>
          </Button>
          <ul className="floatingMenu">
            {filteredOptions.map((option) => (
              <li key={option.key}>
                <Button onClick={() => handleMenuItemClick(option.key)}>
                  {option.title}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {renderComponent()}
    </>
  );
};

export default FloatingActionButton;
