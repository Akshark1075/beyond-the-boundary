import React, { useState, useEffect, useRef } from "react";
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
import { Html } from "@react-three/drei";
import { Interactive } from "@react-three/xr";
import * as THREE from "three";

import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { BufferGeometry } from "three";
import { fieldPositions } from "../utilities/getFieldPositions";

interface FloatingActionButtonProps {
  selections: SelectedOption[];
  setSelection: (options: SelectedOption[]) => void;
  isARMode: boolean;
  setShouldShowReticle?: (shouldShowReticle: boolean) => void;
  setSelectedARComponent?: (component: string) => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  selections,
  setSelection,
  isARMode,
  setShouldShowReticle,
  setSelectedARComponent,
}) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const { matchId } = useParams();
  const [searchParams] = useSearchParams();
  const isLive = searchParams.get("isLive");
  const handleMenuItemClick = (component: string) => {
    console.log(component);
    if (isARMode && !!setShouldShowReticle && !!setSelectedARComponent) {
      setShouldShowReticle(true);
      setSelectedARComponent(component);
    } else {
      setSelectedComponent(component);
    }
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
            isARMode={isARMode}
          />
        )}

        {(bowlingScorecard || selectedComponent === "Bowling Scorecard") && (
          <ScoreCardTable
            matchId={matchId ?? ""}
            type={"Bowling"}
            selections={selections}
            setSelection={setSelection}
            isLive={isLive === "y"}
            isARMode={isARMode}
          />
        )}

        {(runsPerOver || selectedComponent === "Runs per over") && (
          <RunsPerOver
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isARMode={isARMode}
          />
        )}
        {(scorecardComparison ||
          selectedComponent === "Scorecard comparison") && (
          <Scorecomparison
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isARMode={isARMode}
          />
        )}
        {(wagonWheel || selectedComponent === "Wagonwheel") && (
          <WagonWheelWrapper
            selections={selections}
            setSelection={setSelection}
            matchId={matchId ?? ""}
            isARMode={isARMode}
          />
        )}
        {(video || selectedComponent === "Video") && (
          <Video
            selections={selections}
            setSelection={setSelection}
            matchId={matchId ?? ""}
            isARMode={isARMode}
          />
        )}
        {(squad || selectedComponent === "Squad") && (
          <Squad
            selections={selections}
            setSelection={setSelection}
            matchId={matchId ?? ""}
            isARMode={isARMode}
          />
        )}
        {(fallOfWickets || selectedComponent === "Fall of wickets") && (
          <FallOfWickets
            selections={selections}
            setSelection={setSelection}
            matchId={matchId ?? ""}
            isLive={isLive === "y"}
            isARMode={isARMode}
          />
        )}

        {(matchInfo || selectedComponent === "Match Info") && (
          <MatchInfo
            selections={selections}
            setSelection={setSelection}
            matchId={matchId ?? ""}
            isARMode={isARMode}
          />
        )}

        {(fieldPosition || selectedComponent === "Field positions") && (
          <FieldPosition
            selections={selections}
            setSelection={setSelection}
            isARMode={isARMode}
            fieldPosArr={fieldPositions}
          />
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
    (c) => !selections.find((s) => s.name === c.key && !isARMode)
  );

  return (
    <>
      {!isARMode ? (
        <>
          <div className="floatingButtonWrap">
            <div className="floatingButtonInner">
              <Button
                className="floatingButton"
                style={{ border: "5px solid #b2bedc", borderRadius: "50%" }}
              >
                <i
                  className="fa fa-plus icon-default"
                  style={{ color: "white" }}
                ></i>
              </Button>
              <ul className="floatingMenu">
                {filteredOptions.map((option) => (
                  <li key={option.key}>
                    <Button
                      onClick={() => handleMenuItemClick(option.key)}
                      className="floatingButtonItem"
                    >
                      {option.title}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {renderComponent()}
        </>
      ) : (
        <ARFloatingActionButton
          components={components}
          handleMenuItemClick={handleMenuItemClick}
        ></ARFloatingActionButton>
      )}
    </>
  );
};
const ARFloatingActionButton = ({
  components,
  handleMenuItemClick,
}: {
  components: {
    title: string;
    key: string;
  }[];
  handleMenuItemClick: (component: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const handleButtonClick = () => {
    setOpen(!open);
  };
  const meshRef = useRef<THREE.Mesh<BufferGeometry>>(null);
  const { camera } = useThree();
  // Update the position of the mesh to always be in front of the camera
  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.position.set(
        camera.position.x,
        camera.position.y - 1,
        camera.position.z - 2
      );
    }
  });
  return (
    <>
      {" "}
      <Interactive onSelect={handleButtonClick}>
        <mesh
          ref={meshRef}
          onClick={() => handleButtonClick()} // Handle button click
        >
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial color={"black"} opacity={0.9} />
          <Text
            fontSize={0.3} // Adjust font size as needed
            color="linear-gradient(45deg, #fffaff, #303036)"
            anchorX="center" // Center text horizontally
            anchorY="middle" // Center text vertically
          >
            {open ? "X" : "+"}
          </Text>
        </mesh>
      </Interactive>
      {open &&
        components.map((c, i) => (
          // position={[-4, 1 - i * 0.5, 0.1]}
          // <mesh position={[0, 1, 0]} key={i}>
          //   <planeGeometry args={[1, 1]} />
          //   <meshBasicMaterial color="#303036" />

          //   {/* Render buttons as 3D text */}
          // {
          <Interactive
            key={i}
            onSelect={() => {
              handleMenuItemClick(c.key); // Call the click handler with the component title
              setOpen(!open);
            }}
          >
            <Text
              position={[
                camera.position.x - 2,
                camera.position.y + i,
                camera.position.z - 10,
              ]}
              fontSize={1} // Adjust font size as needed
              color="#fff"
              anchorX="left" // Align text to the left
              anchorY="middle" // Center text vertically
              rotation-z={Math.PI}
              rotation-x={Math.PI}
              rotation-y={Math.PI}
            >
              {c.title}
            </Text>
          </Interactive>
          //     }
          //   </mesh>
          // ))}
        ))}
    </>
  );
};
export default FloatingActionButton;
