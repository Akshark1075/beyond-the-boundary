import "../styles/ShowPage.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import {
  ARButton,
  Controllers,
  Hands,
  XR,
  XRInteractionEvent,
} from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import Interface from "../Components/Overlay";
import { Reticle } from "../Components/Reticle";
import { OrbitControls } from "@react-three/drei";
import WithXRPlane from "../Components/PlaneWithContent";
import WithXR from "../Components/WithXR";
import fetchWithRetry from "../api/fetch";
import { useQuery } from "@tanstack/react-query";
import { GetScorecard } from "../types/getScorecard";

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
  const [isARMode, setIsARMode] = useState(false);
  const fetchScorecard = async (matchId: string): Promise<Response> => {
    const res = await fetchWithRetry(
      `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/hscard`
    );
    console.log(res);
    return res;
  };
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
  useQuery<GetScorecard>({
    queryKey: [`scoresData-${matchId}`],
    queryFn: useCallback(
      () => fetchScorecard(matchId ?? "").then((res) => res.json()),
      [matchId]
    ),
    enabled: !!matchId,
    // refetchInterval: isLive ? 30000 : undefined,
  });

  const ref = useRef<HTMLDivElement>(null);

  const [overlayContent, setOverlayContent] = useState<HTMLDivElement | null>(
    null
  );
  // @ts-ignore: Unreachable code error
  // usePinch(handle, { ref });

  useEffect(() => {
    if (ref.current !== null) {
      setOverlayContent(ref.current);
    }
  }, []);
  // let interfaceRef = useCallback(
  //   (node: React.SetStateAction<HTMLDivElement | null>) => {
  //     if (node !== null) {
  //       setOverlayContent(node);
  //     }
  //   },
  //   []
  // );

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    if (canvas) {
      if (isARMode) {
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.visibility = "visible";
      } else {
        canvas.style.width = "1%";
        canvas.style.height = "1%";
        canvas.style.visibility = "hidden";
      }
    }
  }, [isARMode]);
  const [models, setModels] = useState<Array<{ [key: string]: any }>>([]);
  const [shouldShowReticle, setShouldShowReticle] = useState(false);
  const [selectedARComponent, setSelectedARComponent] = useState<string | null>(
    null
  );
  const placeModel = (
    e: XRInteractionEvent,
    component: JSX.Element,
    title: string
  ) => {
    let position = e.intersection?.object.position.clone();
    let id = Date.now();
    setModels((prevModels) => [
      ...prevModels,
      { position, component, id, title },
    ]);
    setShouldShowReticle(false);
  };
  const getARComponent = (componentName: string) => {
    switch (componentName) {
      case "Match Info":
        return (
          <MatchInfo
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isARMode={isARMode}
          />
        );
      case "Batting Scorecard":
        return (
          <ScoreCardTable
            type="Batting"
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isLive={isLive === "y"}
            isARMode={isARMode}
          />
        );
      case "Bowling Scorecard":
        return (
          <ScoreCardTable
            type="Bowling"
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isLive={isLive === "y"}
            isARMode={isARMode}
          />
        );
      case "Scorecard comparison":
        return (
          <Scorecomparison
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isARMode={isARMode}
          />
        );
      case "Wagonwheel":
        return (
          <WagonWheelWrapper
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isARMode={isARMode}
          />
        );
      case "Video":
        return (
          <Video
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isARMode={isARMode}
          />
        );
      case "Squad":
        return (
          <Squad
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isARMode={isARMode}
          />
        );
      case "Fall of wickets":
        return (
          <FallOfWickets
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isLive={isLive === "y"}
            isARMode={isARMode}
          />
        );

      case "Field positions":
        return (
          <FieldPosition
            selections={selections}
            setSelection={setSelection}
            isARMode={isARMode}
          />
        );
      case "Runs per over":
        return (
          <RunsPerOver
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isARMode={isARMode}
          />
        );

      default:
        return (
          <Video
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isARMode={isARMode}
          />
        );
    }
  };
  return (
    <>
      {/* <div id="overlay" className="overlay" ref={ref} /> */}

      <Canvas
        id="canvas"
        style={{ width: "1px", height: "1px", visibility: "hidden" }}
      >
        <XR>
          <Controllers />
          <Hands />
          <OrbitControls />
          <axesHelper />
          <ambientLight />

          <WithXR setIsARMode={setIsARMode} />

          {!!shouldShowReticle && (
            <Reticle
              component={getARComponent(selectedARComponent ?? "")}
              placeModel={placeModel}
              title={selectedARComponent ?? ""}
            />
          )}
          {models.map(({ position, component, id, title }) => (
            // <Cube key={id} position={position} />
            <WithXRPlane
              key={id}
              component={component}
              position={position}
              title={title}
            />
          ))}
        </XR>
      </Canvas>
      {isARMode && (
        <Interface
          ref={ref}
          selections={selections}
          setSelection={setSelection}
          setShouldShowReticle={setShouldShowReticle}
          setSelectedARComponent={setSelectedARComponent}
        />
      )}
      {!isARMode && (
        // @ts-ignore: Unreachable code error
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
                          isARMode={false}
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
                          isARMode={false}
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
                          isARMode={false}
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
                          isARMode={false}
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
                          isARMode={false}
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
                          isARMode={false}
                        />
                      ),
                      title: "RPO",
                    },
                    {
                      component: (
                        <FieldPosition
                          selections={selections}
                          setSelection={setSelection}
                          isARMode={false}
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
                          isARMode={false}
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
                          isARMode={false}
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
                          isARMode={false}
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
                  isARMode={false}
                />
              </>
            )}
          </Box>
        </Box>
      )}
      <ARButton
        sessionInit={{
          requiredFeatures: ["hit-test", "dom-overlay"],

          domOverlay: !!overlayContent
            ? {
                root: overlayContent as HTMLElement,
              }
            : undefined,
        }}
      />
    </>
  );
};
export default ShowPage;
