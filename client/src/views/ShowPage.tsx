import "../styles/ShowPage.css";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  Controllers,
  Hands,
  XR,
  XRInteractionEvent,
  ARButton,
} from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import { Reticle } from "../Components/Reticle";
import { OrbitControls } from "@react-three/drei";
import WithXRPlane from "../Components/PlaneWithContent";
import WithXR from "../Components/WithXR";
import fetchWithRetry from "../api/fetch";
import { useQuery } from "@tanstack/react-query";
import { GetScorecard } from "../types/getScorecard";
import * as THREE from "three";
import { fieldPositions } from "../utilities/getFieldPositions";

// @ts-ignore: Unreachable code error
import domtoimage from "dom-to-image-more";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../api/queryClient";
import { GetInfo } from "../types/getInfo";
import { GetSquad } from "../types/getSquad";
import { renderToString } from "react-dom/server";

export interface SelectedOption {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}
export interface Model {
  position: THREE.Vector3 | undefined;
  component: JSX.Element;
  id: number;
  title: string;
  scale: THREE.Vector3 | undefined;
}
// @ts-ignore: Unreachable code error
HTMLCanvasElement.prototype.getContext = (function (origFn) {
  return function (type, attribs) {
    attribs = attribs || {};
    attribs.preserveDrawingBuffer = true;
    // @ts-ignore: Unreachable code error
    return origFn.call(this, type, attribs);
  };
})(HTMLCanvasElement.prototype.getContext);

let container = document.querySelector("#htmlContainer");
if (!container) {
  const node = document.createElement("div");
  node.setAttribute("id", "htmlContainer");
  node.style.position = "fixed";
  node.style.opacity = "0";
  node.style.pointerEvents = "none";
  document.body.appendChild(node);
  container = node;
}
const ShowPage = () => {
  const [selections, setSelection] = useState<SelectedOption[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isARMode, setIsARMode] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);

  const { matchId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const isLive = searchParams.get("isLive");
  const fetchScorecard = async (matchId: string): Promise<GetScorecard> => {
    const res = await fetchWithRetry(
      `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/hscard`
    );
    return res;
  };
  const fetchInfo = async (matchId: string): Promise<GetInfo> => {
    const res = await fetchWithRetry(
      `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}`
    );
    return res;
  };
  const fetchSquad = async (
    matchId: string,
    teamId: number | undefined
  ): Promise<GetSquad> => {
    const res = await fetchWithRetry(
      `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/team/${teamId}`
    );

    return res;
  };
  const {
    isLoading: isMatchDataLoading,
    isError: isMatchDataError,
    isSuccess: isMatchDataSuccess,

    data: matchData,
  } = useQuery<GetInfo>({
    queryKey: ["infoData", matchId],
    queryFn: useCallback(() => fetchInfo(matchId), [matchId]),
    enabled: !!matchId,
    staleTime: 30000,
  });
  const team1Id = matchData?.matchInfo.team1.id;
  const team2Id = matchData?.matchInfo.team2.id;
  const {
    isLoading: isTeam1SquadDataLoading,
    isError: isTeam1SquadDataError,
    isSuccess: isTeam1SquadDataSuccess,
    data: team1SquadData,
  } = useQuery<GetSquad>({
    queryKey: [`squadData${team1Id}`, matchId],
    queryFn: useCallback(
      () => fetchSquad(matchId, team1Id),
      [matchId, team1Id]
    ),
    enabled: !!matchId && !!team1Id,
    staleTime: 30000,
  });

  const {
    isLoading: isTeam2SquadDataLoading,
    isError: isTeam2SquadDataError,
    isSuccess: isTeam2SquadDataSuccess,
    data: team2SquadData,
  } = useQuery<GetSquad>({
    queryKey: [`squadData${team2Id}`, matchId],
    queryFn: useCallback(
      () => fetchSquad(matchId, team2Id),
      [matchId, team2Id]
    ),
    enabled: !!matchId && !!team2Id,
    staleTime: 30000,
  });
  const {
    isLoading: isScoresDataLoading,
    isError: isScoresDataError,
    data: scoresData,
    isSuccess: isScoresDataSuccess,
  } = useQuery<GetScorecard>({
    queryKey: [`scoresData-${matchId}`],
    queryFn: useCallback(() => fetchScorecard(matchId), [matchId]),
    refetchInterval: isLive === "y" ? 30000 : undefined,
  });

  const memoizedmatchData = useMemo(() => matchData, [matchData]);
  const memoizedTeam1SquadData = useMemo(
    () => team1SquadData,
    [team1SquadData]
  );
  const memoizedTeam2SquadData = useMemo(
    () => team2SquadData,
    [team2SquadData]
  );
  const memoizedScoresData = useMemo(() => scoresData, [scoresData]);

  useEffect(() => {
    // Retrieve the array from local storage on component mount
    let storedItems = getArrayFromLocalStorage("selectedOptions");
    let storedARItems: Model[] = [];
    storedARItems = getArrayFromLocalStorage("selectedAROptions");
    if (storedItems.length === 0) {
      storedItems = [
        {
          name: "Video",
          x: (window.innerWidth - 853) / 2,
          y: (window.innerHeight - 480) / 2,
          width: 853,
          height: 480,
          zIndex: 1,
        },
        {
          name: "Match Info",
          x: 0,
          y: 20,
          width: 350,
          height: 680,
          zIndex: 1,
        },
        {
          name: "Squad",
          x: window.innerWidth - 350,
          y: 20,
          width: 350,
          height: 680,
          zIndex: 1,
        },
      ];
    }
    setSelection(storedItems);
    saveArrayToLocalStorage("selectedOptions", storedItems);
    if (storedARItems.length > 0 && isARMode) {
      if (videoRef.current && storedARItems.find((i) => i.title === "Video"))
        videoRef.current.muted = false;
      setModels(
        storedARItems.map((i) => {
          return {
            ...i,
            position: new THREE.Vector3(
              i.position?.x,
              i.position?.y,
              i.position?.z
            ),
            component: getARComponent(i.title),
          };
        })
      );
    }
  }, [isARMode]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  const [shouldShowReticle, setShouldShowReticle] = useState(true);
  const [selectedARComponent, setSelectedARComponent] = useState<string | null>(
    "Video"
  );

  const placeModel = (
    e: XRInteractionEvent,
    component: JSX.Element,
    title: string
  ) => {
    const position = e.intersection?.object.position.clone();
    const scale =
      title === `Runs per over` || title === `Scorecard comparison`
        ? new THREE.Vector3(0.5, 0.5, 0.5)
        : title === `Field positions` || title === `Wagonwheel`
        ? new THREE.Vector3(0.1, 0.1, 0.1)
        : new THREE.Vector3(1, 1, 1);
    let id = Date.now();
    if (title === "Video" && videoRef.current) {
      videoRef.current.muted = false;
    }
    setModels((prevModels) => {
      saveArrayToLocalStorage("selectedAROptions", [
        ...prevModels.map((m) => ({
          position: m.position,
          title: m.title,
          id: m.id,
          scale: m.scale,
        })),
        { position, id, title, scale },
      ]);
      return [...prevModels, { position, component, id, title, scale }];
    });
    setShouldShowReticle(false);
  };
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  useEffect(() => {
    if (selectedARComponent === "Video") {
      const video = document.createElement("video");
      video.src = "/video.mp4";
      video.crossOrigin = "anonymous";
      video.loop = true;
      video.muted = true;
      video.autoplay = true;
      video.controls = false;
      video.play();
      videoRef.current = video;

      textureRef.current = new THREE.VideoTexture(video);
    }
  }, [selectedARComponent]);
  const getARComponent = (componentName: string) => {
    switch (componentName) {
      case "Match Info":
        return (
          <MatchInfo
            selections={selections}
            setSelection={setSelection}
            isARMode={true}
            data={matchData}
            isLoading={isMatchDataLoading}
            isError={isMatchDataError}
          />
        );
      case "Batting Scorecard":
        return (
          <ScoreCardTable
            type="Batting"
            selections={selections}
            setSelection={setSelection}
            isARMode={true}
            data={scoresData}
            isLoading={isScoresDataLoading}
            isError={isScoresDataError}
          />
        );
      case "Bowling Scorecard":
        return (
          <ScoreCardTable
            type="Bowling"
            selections={selections}
            setSelection={setSelection}
            isARMode={true}
            data={scoresData}
            isLoading={isScoresDataLoading}
            isError={isScoresDataError}
          />
        );
      case "Scorecard comparison":
        return (
          <Scorecomparison
            selections={selections}
            setSelection={setSelection}
            isARMode={true}
            data={scoresData}
            isLoading={isScoresDataLoading}
            isError={isScoresDataError}
          />
        );
      case "Wagonwheel":
        return (
          <WagonWheelWrapper
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isARMode={true}
            data={scoresData}
            isLoading={isScoresDataLoading}
            isError={isScoresDataError}
            isSuccess={isScoresDataSuccess}
          />
        );
      case "Video":
        return (
          <Video
            matchData={matchData}
            selections={selections}
            setSelection={setSelection}
            isARMode={true}
            texture={textureRef.current}
          />
        );
      case "Squad":
        return (
          <Squad
            selections={selections}
            setSelection={setSelection}
            isARMode={true}
            matchData={matchData}
            isMatchDataLoading={isMatchDataLoading}
            isMatchDataError={isMatchDataError}
            isTeam1SquadDataLoading={isTeam1SquadDataLoading}
            isTeam2SquadDataLoading={isTeam2SquadDataLoading}
            team1SquadData={team1SquadData}
            team2SquadData={team2SquadData}
          />
        );
      case "Fall of wickets":
        return (
          <FallOfWickets
            selections={selections}
            setSelection={setSelection}
            isARMode={true}
            isLoading={isScoresDataLoading}
            isError={isScoresDataError}
            data={scoresData}
          />
        );

      case "Field positions":
        return (
          <FieldPosition
            selections={selections}
            setSelection={setSelection}
            isARMode={true}
            fieldPosArr={fieldPositions}
          />
        );
      case "Runs per over":
        return (
          <RunsPerOver
            matchId={matchId ?? ""}
            selections={selections}
            setSelection={setSelection}
            isARMode={true}
            isLoading={isScoresDataLoading}
            isError={isScoresDataError}
            data={scoresData}
          />
        );

      default:
        return (
          <Video
            matchData={matchData}
            selections={selections}
            setSelection={setSelection}
            isARMode={true}
            texture={textureRef.current}
          />
        );
    }
  };

  const lastUrl1 = useRef<string>(null);
  const lastUrl2 = useRef<string>(null);
  const lastUrl3 = useRef<string>(null);
  const lastUrl4 = useRef<string>(null);
  const lastUrl5 = useRef<string>(null);
  const [matchInfoImage, setMatchInfoImage] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  );
  const [squadImage, setSquadImage] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  );
  const [fowImage, setFowImage] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  );
  const [battingScorecardImage, setBattingScorecardImage] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  );
  const [bowlingScorecardImage, setBowlingScorecardImage] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  );

  const matchInfoNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = document.createElement("div");

    node.innerHTML = renderToString(
      <QueryClientProvider client={queryClient}>
        <MatchInfo
          selections={selections}
          setSelection={setSelection}
          isARMode={true}
          data={matchData}
          isLoading={isMatchDataLoading}
          isError={isMatchDataError}
        />
      </QueryClientProvider>
    );

    matchInfoNodeRef.current = node;
  }, [
    isMatchDataSuccess,
    matchId,
    selections,
    memoizedmatchData,
    isMatchDataLoading,
    isMatchDataError,
    queryClient,
    setSelection,
  ]);

  const squadNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = document.createElement("div");
    node.innerHTML = renderToString(
      <QueryClientProvider client={queryClient}>
        <Squad
          selections={selections}
          setSelection={setSelection}
          isARMode={true}
          matchData={matchData}
          isMatchDataLoading={isMatchDataLoading}
          isMatchDataError={isMatchDataError}
          isTeam1SquadDataLoading={isTeam1SquadDataLoading}
          isTeam2SquadDataLoading={isTeam2SquadDataLoading}
          team1SquadData={team1SquadData}
          team2SquadData={team2SquadData}
        />
      </QueryClientProvider>
    );

    squadNodeRef.current = node;
  }, [
    isMatchDataSuccess,
    isTeam1SquadDataSuccess,
    isTeam2SquadDataSuccess,
    matchId,
    selections,
    memoizedmatchData,
    isMatchDataLoading,
    isMatchDataError,
    isTeam1SquadDataLoading,
    isTeam2SquadDataLoading,
    memoizedTeam1SquadData,
    memoizedTeam2SquadData,
    queryClient,
    setSelection,
  ]);

  const fowNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = document.createElement("div");
    node.innerHTML = renderToString(
      <QueryClientProvider client={queryClient}>
        <FallOfWickets
          selections={selections}
          setSelection={setSelection}
          isARMode={true}
          isLoading={isScoresDataLoading}
          isError={isScoresDataError}
          data={scoresData}
        />
      </QueryClientProvider>
    );

    fowNodeRef.current = node;
  }, [
    isScoresDataSuccess,
    matchId,
    selections,
    isScoresDataLoading,
    isScoresDataError,
    memoizedScoresData,
    queryClient,
    setSelection,
  ]);

  const battingScorecardNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = document.createElement("div");
    node.innerHTML = renderToString(
      <QueryClientProvider client={queryClient}>
        <ScoreCardTable
          type="Batting"
          selections={selections}
          setSelection={setSelection}
          isARMode={true}
          data={scoresData}
          isLoading={isScoresDataLoading}
          isError={isScoresDataError}
        />
      </QueryClientProvider>
    );

    battingScorecardNodeRef.current = node;
  }, [
    isScoresDataSuccess,
    matchId,
    selections,
    memoizedScoresData,
    isScoresDataLoading,
    isScoresDataError,
    queryClient,
    setSelection,
  ]);

  const bowlingScorecardNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = document.createElement("div");
    node.innerHTML = renderToString(
      <QueryClientProvider client={queryClient}>
        <ScoreCardTable
          type="Bowling"
          selections={selections}
          setSelection={setSelection}
          isARMode={true}
          data={scoresData}
          isLoading={isScoresDataLoading}
          isError={isScoresDataError}
        />
      </QueryClientProvider>
    );

    bowlingScorecardNodeRef.current = node;
  }, [
    isScoresDataSuccess,
    matchId,
    selections,
    memoizedScoresData,
    isScoresDataLoading,
    isScoresDataError,
    queryClient,
    setSelection,
  ]);

  useEffect(() => {
    const node = matchInfoNodeRef.current;

    if (node) {
      if (container) container.appendChild(node);
      domtoimage
        .toBlob(node, { bgcolor: "transparent" })
        .then((blob: Blob | MediaSource | null) => {
          if (container && container.contains(node)) {
            container.removeChild(node);
          }
          if (blob === null) return;
          if (lastUrl1.current !== null) {
            URL.revokeObjectURL(lastUrl1.current);
          }
          const url = URL.createObjectURL(blob);
          // @ts-ignore: Unreachable code error
          lastUrl1.current = url;
          setMatchInfoImage(url);
        });

      return () => {
        if (container && container.contains(node)) {
          container.removeChild(node);
        }
      };
    }
  }, [isMatchDataSuccess, matchId, matchData]);
  useEffect(() => {
    const node = squadNodeRef.current;
    if (node) {
      if (container) container.appendChild(node);
      domtoimage
        .toBlob(node, { bgcolor: "transparent" })
        .then((blob: Blob | MediaSource | null) => {
          if (container && container.contains(node)) {
            container.removeChild(node);
          }
          if (blob === null) return;
          if (lastUrl2.current !== null) {
            URL.revokeObjectURL(lastUrl2.current);
          }
          const url = URL.createObjectURL(blob);
          // @ts-ignore: Unreachable code error
          lastUrl2.current = url;
          setSquadImage(url);
        });

      return () => {
        // clearTimeout(timer);
        if (container && container.contains(node)) {
          container.removeChild(node);
        }
      };
    }
  }, [
    isMatchDataSuccess,
    isTeam1SquadDataSuccess,
    isTeam2SquadDataSuccess,
    matchId,
    memoizedmatchData,
    memoizedTeam1SquadData,
    memoizedTeam2SquadData,
  ]);

  useEffect(() => {
    const node = fowNodeRef.current;
    if (node) {
      if (container) container.appendChild(node);
      domtoimage
        .toBlob(node, { bgcolor: "transparent" })
        .then((blob: Blob | MediaSource | null) => {
          if (container && container.contains(node)) {
            container.removeChild(node);
          }
          if (blob === null) return;
          if (lastUrl3.current !== null) {
            URL.revokeObjectURL(lastUrl3.current);
          }
          const url = URL.createObjectURL(blob);
          // @ts-ignore: Unreachable code error
          lastUrl3.current = url;
          setFowImage(url);
        });

      return () => {
        // clearTimeout(timer);
        if (container && container.contains(node)) {
          container.removeChild(node);
        }
      };
    }
  }, [isScoresDataSuccess, matchId, memoizedScoresData]);

  useEffect(() => {
    const node = battingScorecardNodeRef.current;
    if (node) {
      if (container) container.appendChild(node);
      domtoimage
        .toBlob(node, { bgcolor: "transparent" })
        .then((blob: Blob | MediaSource | null) => {
          if (container && container.contains(node)) {
            container.removeChild(node);
          }
          if (blob === null) return;
          if (lastUrl4.current !== null) {
            URL.revokeObjectURL(lastUrl4.current);
          }
          const url = URL.createObjectURL(blob);
          // @ts-ignore: Unreachable code error
          lastUrl4.current = url;
          setBattingScorecardImage(url);
        });

      return () => {
        // clearTimeout(timer);
        if (container && container.contains(node)) {
          container.removeChild(node);
        }
      };
    }
  }, [isScoresDataSuccess, matchId, memoizedScoresData]);

  useEffect(() => {
    const node = bowlingScorecardNodeRef.current;
    if (node) {
      if (container) container.appendChild(node);
      domtoimage
        .toBlob(node, { bgcolor: "transparent" })
        .then((blob: Blob | MediaSource | null) => {
          if (container && container.contains(node)) {
            container.removeChild(node);
          }
          if (blob === null) return;
          if (lastUrl5.current !== null) {
            URL.revokeObjectURL(lastUrl5.current);
          }
          const url = URL.createObjectURL(blob);
          // @ts-ignore: Unreachable code error
          lastUrl5.current = url;
          setBowlingScorecardImage(url);
        });

      return () => {
        // clearTimeout(timer);
        if (container && container.contains(node)) {
          container.removeChild(node);
        }
      };
    }
  }, [isScoresDataSuccess, matchId, memoizedScoresData]);

  return (
    <>
      {/* <div id="overlay" className="overlay" ref={ref} /> */}

      <Canvas
        id="canvas"
        style={{ width: "1px", height: "1px", visibility: "hidden" }}
        onCreated={({ scene, camera }) => {
          sceneRef.current = scene;
          cameraRef.current = camera;
        }}
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

          {models.map(({ position, component, id, title, scale }, i) => (
            <WithXRPlane
              key={`${title}-${id}-${i}`}
              component={component}
              position={position}
              scale={scale}
              title={title}
              models={models}
              setModels={setModels}
              image={
                title === "Squad"
                  ? squadImage
                  : title === "Match Info"
                  ? matchInfoImage
                  : title === "Fall of wickets"
                  ? fowImage
                  : title === "Batting Scorecard"
                  ? battingScorecardImage
                  : title === "Bowling Scorecard"
                  ? bowlingScorecardImage
                  : matchInfoImage
              }
              videoRef={videoRef}
            />
          ))}
          {isARMode && (
            <FloatingActionButton
              selections={selections}
              setSelection={setSelection}
              isARMode={true}
              setShouldShowReticle={setShouldShowReticle}
              setSelectedARComponent={setSelectedARComponent}
              matchData={matchData}
              isMatchDataLoading={isMatchDataLoading}
              isMatchDataError={isMatchDataError}
              isTeam1SquadDataLoading={isTeam1SquadDataLoading}
              isTeam2SquadDataLoading={isTeam2SquadDataLoading}
              team1SquadData={team1SquadData}
              team2SquadData={team2SquadData}
              isScoresDataLoading={isScoresDataLoading}
              isScoresDataError={isScoresDataError}
              isScoresDataSuccess={isScoresDataSuccess}
              scoresData={scoresData}
              videoTexture={textureRef.current}
            />
          )}
        </XR>
      </Canvas>

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
                          selections={selections}
                          setSelection={setSelection}
                          isARMode={false}
                          data={matchData}
                          isLoading={isMatchDataLoading}
                          isError={isMatchDataError}
                        />
                      ),
                      title: "Match Info",
                    },
                    {
                      component: (
                        <Squad
                          selections={selections}
                          setSelection={setSelection}
                          isARMode={false}
                          matchData={matchData}
                          isMatchDataLoading={isMatchDataLoading}
                          isMatchDataError={isMatchDataError}
                          isTeam1SquadDataLoading={isTeam1SquadDataLoading}
                          isTeam2SquadDataLoading={isTeam2SquadDataLoading}
                          team1SquadData={team1SquadData}
                          team2SquadData={team2SquadData}
                        />
                      ),
                      title: "Squad",
                    },

                    {
                      component: (
                        <ScoreCardTable
                          type="Batting"
                          selections={selections}
                          setSelection={setSelection}
                          isARMode={false}
                          data={scoresData}
                          isLoading={isScoresDataLoading}
                          isError={isScoresDataError}
                        />
                      ),
                      title: "Bat Score",
                    },
                    {
                      component: (
                        <ScoreCardTable
                          type="Bowling"
                          selections={selections}
                          setSelection={setSelection}
                          isARMode={false}
                          data={scoresData}
                          isLoading={isScoresDataLoading}
                          isError={isScoresDataError}
                        />
                      ),
                      title: "Bowl Score",
                    },
                    {
                      component: (
                        <Scorecomparison
                          selections={selections}
                          setSelection={setSelection}
                          isARMode={false}
                          data={scoresData}
                          isLoading={isScoresDataLoading}
                          isError={isScoresDataError}
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
                          isLoading={isScoresDataLoading}
                          isError={isScoresDataError}
                          data={scoresData}
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
                          fieldPosArr={fieldPositions}
                        />
                      ),
                      title: "Field",
                    },
                    {
                      component: (
                        <FallOfWickets
                          selections={selections}
                          setSelection={setSelection}
                          isARMode={false}
                          isLoading={isScoresDataLoading}
                          isError={isScoresDataError}
                          data={scoresData}
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
                          data={scoresData}
                          isLoading={isScoresDataLoading}
                          isError={isScoresDataError}
                          isSuccess={isScoresDataSuccess}
                        />
                      ),
                      title: "Wheel",
                    },
                    {
                      component: (
                        <Video
                          matchData={matchData}
                          selections={selections}
                          setSelection={setSelection}
                          isARMode={false}
                          texture={textureRef.current}
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
                  matchData={matchData}
                  isMatchDataLoading={isMatchDataLoading}
                  isMatchDataError={isMatchDataError}
                  isTeam1SquadDataLoading={isTeam1SquadDataLoading}
                  isTeam2SquadDataLoading={isTeam2SquadDataLoading}
                  team1SquadData={team1SquadData}
                  team2SquadData={team2SquadData}
                  isScoresDataLoading={isScoresDataLoading}
                  isScoresDataError={isScoresDataError}
                  isScoresDataSuccess={isScoresDataSuccess}
                  scoresData={scoresData}
                  videoTexture={textureRef.current}
                />
              </>
            )}
          </Box>
        </Box>
      )}
      {!isMobile && (
        <ARButton
          sessionInit={{
            requiredFeatures: ["hit-test"],
            optionalFeatures: ["hand-tracking"],
          }}
        />
      )}
    </>
  );
};
export default ShowPage;
