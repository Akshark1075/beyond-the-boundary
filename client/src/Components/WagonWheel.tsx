import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import WithTitleBar from "./WithTitleBar";
import { DraggableEvent } from "react-draggable";
import { Rnd, RndResizeCallback } from "react-rnd";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import { SelectedOption } from "../views/ShowPage";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import {
  AppBar,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import "../styles/WagonWheel.css";
import { GetScorecard } from "../types/getScorecard";

import { PositionContext } from "./PlaneWithContent";
import getUpdatedZIndex from "../utilities/getUpdatedZIndex";

interface WagonWheelProps {
  scores: {
    ones: number;
    twos: number;
    threes: number;
    fours: number;
    sixes: number;
  };
  width: number;
  height: number;
}

const WagonWheel: React.FC<WagonWheelProps> = ({ scores, width, height }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    const { ones, twos, threes, fours, sixes } = scores;

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio is 1 for a square canvas
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      isMobile ? window.screen.width : width,
      isMobile ? window.screen.width : height
    );
    mountRef.current?.appendChild(renderer.domElement);

    // Set ground color
    const groundColor = 0x00ff00;
    scene.background = new THREE.Color(groundColor);

    // Helper function to draw a circle
    const drawCircle = (
      radius: number,
      color: number,
      lineWidth: number = 1
    ) => {
      const geometry = new THREE.CircleGeometry(radius, 64);
      const material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        opacity: 0.2,
        transparent: true,
      });
      const circle = new THREE.Mesh(geometry, material);
      scene.add(circle);
    };

    // Helper function to draw the pitch
    const drawPitch = () => {
      const pitchWidth = 2;
      const pitchHeight = 12;

      const geometry = new THREE.PlaneGeometry(pitchWidth, pitchHeight);
      const material = new THREE.MeshBasicMaterial({
        color: 0x8b4513,
        side: THREE.DoubleSide,
      });
      const pitch = new THREE.Mesh(geometry, material);
      pitch.position.set(0, 0, 0.01);
      scene.add(pitch);
    };

    // Helper function to draw lines
    const drawLines = (
      count: number,
      length: number,
      color: number,
      lineWidth: number,
      angleOffset: number,
      angleRange: number
    ) => {
      for (let i = 0; i < count; i++) {
        const angle = angleOffset + Math.random() * angleRange;
        const x = length * Math.cos(angle);
        const y = length * Math.sin(angle);

        const points = [new THREE.Vector3(0, 6, 0), new THREE.Vector3(x, y, 0)];

        var tubeGeometry = new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(points),
          512,
          0.1,
          8,
          false
        );
        const material = new THREE.LineBasicMaterial({
          color,

          linewidth: lineWidth,
        });
        const line = new THREE.Line(tubeGeometry, material);
        scene.add(line);
      }
    };

    drawCircle(5, 0xffffff); // White circle for the pitch
    drawCircle(15, 0xffff00, 2); // Thirty-yard circle
    drawCircle(25, 0xff0000, 2); // Boundary

    drawPitch(); // Draw the pitch rectangle

    // Draw lines for different run types
    const fullCircle = 2 * Math.PI;
    drawLines(ones, 10, 0x800080, 8, 0, fullCircle);
    drawLines(twos, 15, 0x8b4513, 8, 0, fullCircle);
    drawLines(threes, 20, 0xffff00, 8, 0, fullCircle);
    drawLines(fours, 25, 0xffffff, 8, 0, fullCircle);
    drawLines(sixes, 30, 0xff0000, 8, 0, fullCircle);

    camera.position.z = 40;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [scores]);

  return <div ref={mountRef} />;
};

const WagWheel = ({
  matchId,
  selections,
  setSelection,
  isARMode,
  arPos,
  isLoading,
  isError,
  isSuccess,
  data,
}: {
  matchId: string;
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
  isARMode: boolean;
  arPos?: THREE.Vector3;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  data: GetScorecard | undefined;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { x: randomX, y: randomY } = getRandomCoordinates();
  //Fetching the position and size of stored wagonwheel component
  const storedWagonWheel = selections.find((s) => s.name === `Wagonwheel`);
  const componentRef = React.useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {
    x = randomX,
    y = randomY,
    width = isMobile ? window.screen.width : 350,
    height = isMobile ? window.screen.width + 20 : 370,
    zIndex = 1,
  } = storedWagonWheel ?? {};
  //If the component is being used for the first time, store to local storage
  if (!storedWagonWheel && !isMobile && !isARMode) {
    const newItems = [
      ...selections,
      {
        name: `Wagonwheel`,
        x: x,
        y: y,
        width: width,
        height: height,
        zIndex: 1,
      },
    ];
    setSelection(newItems);
    saveArrayToLocalStorage("selectedOptions", newItems);
  }
  //Function for setting the new position
  const setPosition = (x: number, y: number) => {
    const newSelections = [...selections];
    const option = newSelections.find((s) => s.name === `Wagonwheel`);
    if (option && !isMobile) {
      option.x = x;
      option.y = y;
      option.zIndex = getUpdatedZIndex(selections, option.name);
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };
  //Function for setting the new size
  const setSize = (w: number, h: number) => {
    const newSelections = [...selections];
    const option = newSelections.find((s) => s.name === `Wagonwheel`);
    if (option && !isMobile) {
      option.width = w;
      option.height = h;
      option.zIndex = getUpdatedZIndex(selections, option.name);
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };
  //Function for handling resizing
  const handleResize: RndResizeCallback = (
    e,
    direction,
    ref,
    delta,
    position
  ) => {
    if (ref && ref.style && !isMobile) {
      const newWidth = parseInt(ref.style.width, 10);
      const newHeight = parseInt(ref.style.height, 10);
      setSize(newWidth, newHeight);
    }
  };
  //Functions for controlling the drag state
  const handleDragStart = (e: DraggableEvent) => {
    setIsDragging(true);
  };
  const handleDragStop = (e: DraggableEvent, d: { x: number; y: number }) => {
    setIsDragging(false);
    setPosition(d.x, d.y);
  };
  const handleResizeStart = (e: DraggableEvent) => {
    setIsDragging(true);
  };
  const handleResizeStop = (e: DraggableEvent) => {
    setIsDragging(false);
  };
  const [team, setTeam] = React.useState(0);
  const [player, setPlayer] = React.useState("");

  const handleTeamChange = (event: SelectChangeEvent) => {
    setTeam(Number(event.target.value));
  };
  const handlePlayerChange = (event: SelectChangeEvent) => {
    setPlayer(event.target.value as string);
  };
  const team1Name =
    data?.scoreCard[data?.scoreCard.length - 2]?.batTeamDetails.batTeamName;
  const team2Name =
    data?.scoreCard[data?.scoreCard.length - 1]?.batTeamDetails.batTeamName;

  const teamBatters = Object.values(
    data?.scoreCard[team]?.batTeamDetails.batsmenData ?? {}
  );
  //Creating random angles for runs
  const randomOnesAngles = useMemo(() => {
    if (!teamBatters || teamBatters?.length === 0) return [];
    return Array.from(
      { length: teamBatters[0]?.ones },
      () => Math.random() * Math.PI * 2
    );
  }, [isSuccess]);

  const randomTwosAngles = useMemo(() => {
    if (!teamBatters || teamBatters?.length === 0) return [];
    return Array.from(
      { length: teamBatters[0]?.twos },
      () => Math.random() * Math.PI * 2
    );
  }, [isSuccess]);

  const randomThreesAngles = useMemo(() => {
    if (!teamBatters || teamBatters?.length === 0) return [];
    return Array.from(
      { length: teamBatters[0]?.threes },
      () => Math.random() * Math.PI * 2
    );
  }, [isSuccess]);

  const randomFoursAngles = useMemo(() => {
    if (!teamBatters || teamBatters?.length === 0) return [];
    return Array.from(
      { length: teamBatters[0]?.fours },
      () => Math.random() * Math.PI * 2
    );
  }, [isSuccess]);

  const randomSixesAngles = useMemo(() => {
    if (!teamBatters || teamBatters?.length === 0) return [];
    return Array.from(
      { length: teamBatters[0]?.sixers },
      () => Math.random() * Math.PI * 2
    );
  }, [isSuccess]);
  const Circle = ({
    radius,
    color,
    position,
  }: {
    position: THREE.Vector3 | undefined;
    radius: number;
    color: string | undefined;
  }) => {
    return (
      <mesh position={position}>
        <circleGeometry args={[radius, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    );
  };

  const DrawLines = ({
    length,
    color,
    meshType,
    position,
    angles,
  }: {
    length: number;
    color: number;
    meshType?: string;
    position?: THREE.Vector3;
    angles: number[];
  }) => {
    const meshes = useMemo(() => {
      const generatedMeshes = [];

      for (let i = 0; i < angles.length; i++) {
        const angle = angles[i] * Math.PI * 2;
        const x = length * Math.cos(angle);
        const y = length * Math.sin(angle);

        let geometry;
        if (meshType === "box") {
          geometry = new THREE.BoxGeometry(1, 1, 1);
        } else if (meshType === "sphere") {
          geometry = new THREE.SphereGeometry(0.5, 16, 16);
        } else {
          // Default to tube geometry
          const points = [
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(x, y, 0),
          ];
          geometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points),
            512,
            0.04,
            8,
            false
          );
        }

        const material = new THREE.MeshBasicMaterial({
          color,
        });

        // Create the mesh
        const mesh = new THREE.Mesh(geometry, material);
        generatedMeshes.push(mesh);
      }

      return generatedMeshes;
    }, [angles, length, color, meshType]); // Position is no longer a dependency

    return (
      <group position={position || new THREE.Vector3(0, 0, 0)}>
        {meshes.map((mesh, index) => (
          <primitive key={index} object={mesh} />
        ))}
      </group>
    );
  };
  //AR Interface
  return isARMode ? (
    <>
      <mesh>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial transparent={true} color={"none"} opacity={0} />
      </mesh>

      <DrawLines
        length={2}
        color={0x800080}
        angles={randomOnesAngles}
        position={arPos}
      />
      <DrawLines
        angles={randomTwosAngles}
        length={3}
        color={0x8b4513}
        position={new THREE.Vector3(arPos?.x, arPos?.y, arPos?.z)}
      />
      <DrawLines
        length={6}
        color={0xffff00}
        angles={randomThreesAngles}
        position={new THREE.Vector3(arPos?.x, arPos?.y, arPos?.z)}
      />
      <DrawLines
        length={8}
        color={0xffffff}
        angles={randomFoursAngles}
        position={new THREE.Vector3(arPos?.x, arPos?.y, arPos?.z)}
      />
      <DrawLines
        length={9}
        color={0xff0000}
        angles={randomSixesAngles}
        position={new THREE.Vector3(arPos?.x, arPos?.y, arPos?.z)}
      />
      <Circle
        radius={8}
        color="green"
        position={
          arPos ? new THREE.Vector3(arPos.x, arPos.y, arPos.z + 0.2) : undefined
        }
      />

      {/* Pitch in the center */}
      <mesh position={new THREE.Vector3(arPos?.x, arPos?.y, arPos?.z)}>
        <planeGeometry args={[0.5, 2]} />
        <meshBasicMaterial color="saddlebrown" />
      </mesh>
      <Circle
        radius={3}
        color="white"
        position={
          arPos ? new THREE.Vector3(arPos.x, arPos.y, arPos.z - 0.1) : undefined
        }
      />
    </>
  ) : //Mobile interface
  isMobile ? (
    <div
      style={{
        width: window.screen.width,
        marginBottom: "1rem",
        overflowY: "scroll",
      }}
    >
      <AppBar
        position="static"
        style={{ background: "#303036" }}
        className="grow"
      >
        <Toolbar variant="dense" className="px-2 min-h-8">
          <Typography
            component="h6"
            className="grow cursor-pointer select-none"
          >
            {"Wagonwheel"}
          </Typography>
        </Toolbar>
      </AppBar>

      <div>
        <div
          className=" flex justify-between p-2 w-full"
          style={{ background: "#303036" }}
        >
          <Box
            // @ts-ignore: Unreachable code error
            sx={{ minWidth: 120 }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" sx={{ color: "white" }}>
                Team
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="select-wagon-team"
                value={String(team)}
                label="Team"
                sx={{ color: "white" }}
                onChange={handleTeamChange}
              >
                <MenuItem value={0}>{team1Name}</MenuItem>
                <MenuItem value={1}>{team2Name}</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            // @ts-ignore: Unreachable code error
            sx={{ minWidth: 120 }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" sx={{ color: "white" }}>
                Player
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={player}
                label="Player"
                sx={{ color: "white" }}
                onChange={handlePlayerChange}
              >
                {teamBatters?.map((b) => (
                  <MenuItem value={b.batName}>{b.batName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        {isLoading || isError ? (
          <>
            <Skeleton height={"2rem"} />
            <Skeleton height={"2rem"} />
            <Skeleton height={"2rem"} />
            <Skeleton height={"2rem"} />
            <Skeleton height={"2rem"} />
          </>
        ) : (
          <WagonWheel
            scores={
              teamBatters?.find((b) => b.batName === player) ?? {
                ones: 0,
                twos: 0,
                threes: 0,
                fours: 0,
                sixes: 0,
              }
            }
            width={width}
            height={height}
          />
        )}
      </div>
    </div>
  ) : (
    //Customizable Desktop interface
    <Rnd
      size={{ width: width, height: height }}
      position={{ x: x ?? randomX, y: y ?? randomY }}
      onResize={handleResize}
      onDragStart={handleDragStart}
      onDragStop={(e, data) => {
        const minY = 0; // You can set this to any value to add padding from the top.
        if (data.y < minY) {
          handleDragStop(e, { ...data, y: minY });
        } else {
          handleDragStop(e, data);
        }
      }}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
      minWidth={350}
      minHeight={350}
      style={{ zIndex: isDragging ? 1101 : zIndex }}
    >
      <div style={{ width: `${width}px` }}>
        <WithTitleBar
          title="Wagonwheel"
          width={componentRef.current?.getBoundingClientRect().width ?? width}
          height={
            componentRef.current?.getBoundingClientRect().height ?? height
          }
          storedKey={"Wagonwheel"}
          selections={selections}
          setSelection={setSelection}
        >
          <div>
            <Box // @ts-ignore: Unreachable code error
              sx={{ width: width, background: "#303036" }}
              className=" flex justify-between p-2"
            >
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "white" }}
                  >
                    Team
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="select-wagon-team"
                    value={String(team)}
                    label="Team"
                    sx={{ color: "white" }}
                    onChange={handleTeamChange}
                  >
                    <MenuItem value={0}>{team1Name}</MenuItem>
                    <MenuItem value={1}>{team2Name}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "white" }}
                  >
                    Player
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={player}
                    label="Player"
                    sx={{ color: "white" }}
                    onChange={handlePlayerChange}
                  >
                    {teamBatters?.map((b) => (
                      <MenuItem value={b.batName} key={b.batName}>
                        {b.batName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            {isLoading || isError ? (
              <>
                <Skeleton height={"2rem"} />
                <Skeleton height={"2rem"} />
                <Skeleton height={"2rem"} />
                <Skeleton height={"2rem"} />
                <Skeleton height={"2rem"} />
              </>
            ) : (
              <WagonWheel
                scores={
                  teamBatters?.find((b) => b.batName === player) ?? {
                    ones: 0,
                    twos: 0,
                    threes: 0,
                    fours: 0,
                    sixes: 0,
                  }
                }
                width={width}
                height={height}
              />
            )}
          </div>
        </WithTitleBar>
      </div>
    </Rnd>
  );
};
const WagonWheelWrapper = ({
  matchId,
  selections,
  setSelection,
  isARMode,
  isLoading,
  isError,
  isSuccess,
  data,
}: {
  matchId: string;
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
  isARMode: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  data: GetScorecard | undefined;
}) => {
  const arPos = useContext(PositionContext);
  return (
    <WagWheel
      matchId={matchId}
      selections={selections}
      setSelection={setSelection}
      isARMode={isARMode}
      arPos={arPos}
      isLoading={isLoading}
      isError={isError}
      isSuccess={isSuccess}
      data={data}
    />
  );
};
export default WagonWheelWrapper;
