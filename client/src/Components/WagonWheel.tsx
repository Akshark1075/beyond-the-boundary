import React, { useCallback, useContext, useEffect, useRef } from "react";
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
import { useQuery } from "@tanstack/react-query";
import fetchWithRetry from "../api/fetch";
import { PositionContext } from "./PlaneWithContent";

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
      }); // Brown color
      const pitch = new THREE.Mesh(geometry, material);
      pitch.position.set(0, 0, 0.01); // Slightly offset to avoid z-fighting
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

        // const geometry = new THREE.BufferGeometry().setFromPoints(points);
        var tubeGeometry = new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(points),
          512, // path segments
          0.1, // THICKNESS
          8, //Roundness of Tube
          false //closed
        );
        const material = new THREE.LineBasicMaterial({
          color,

          linewidth: lineWidth,
        });
        const line = new THREE.Line(tubeGeometry, material);
        scene.add(line);
      }
    };

    // Draw the pitch, thirty-yard circle, and boundary
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

    // Clean up on component unmount
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [scores]);

  return <div ref={mountRef} />;
};

const WagonWheelWrapper = ({
  matchId,
  selections,
  setSelection,
  isARMode,
}: {
  matchId: string;
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
  isARMode: boolean;
}) => {
  const { x: randomX, y: randomY } = getRandomCoordinates();
  const storedWagonWheel = selections.find((s) => s.name === `Wagonwheel`);
  const componentRef = React.useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {
    x = randomX,
    y = randomY,
    width = isMobile ? window.screen.width : 350,
    height = isMobile ? window.screen.width + 20 : 370,
  } = storedWagonWheel ?? {};

  if (!storedWagonWheel && !isMobile) {
    const newItems = [
      ...selections,
      {
        name: `Wagonwheel`,
        x: x,
        y: y,
        width: width,
        height: height,
      },
    ];
    setSelection(newItems);
    saveArrayToLocalStorage("selectedOptions", newItems);
  }

  const setPosition = (x: number, y: number) => {
    const newSelections = [...selections];
    const option = newSelections.find((s) => s.name === `Wagonwheel`);
    if (option && !isMobile) {
      option.x = x;
      option.y = y;
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };

  const setSize = (w: number, h: number) => {
    const newSelections = [...selections];
    const option = newSelections.find((s) => s.name === `Wagonwheel`);
    if (option && !isMobile) {
      option.width = w;
      option.height = h;
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };
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
  const handleDragStop = (e: DraggableEvent, d: { x: number; y: number }) => {
    setPosition(d.x, d.y);
  };

  const fetchOvers = async (matchId: string): Promise<GetScorecard> => {
    const res = await fetchWithRetry(
      `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/hscard`
    );
    return res;
  };
  const [team, setTeam] = React.useState(0);
  const [player, setPlayer] = React.useState("");
  const { isLoading, error, data } = useQuery<GetScorecard>({
    queryKey: [`scoresData-${matchId}`],
    queryFn: useCallback(() => fetchOvers(matchId), [matchId]),
  });
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
  const position = useContext(PositionContext);
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
    count,
    length,
    color,
    lineWidth,
    angleOffset,
    angleRange,
    position,
  }: {
    count: number;
    length: number;
    color: number;
    lineWidth: number;
    angleOffset: number;
    angleRange: number;
    position: THREE.Vector3;
  }) => {
    const drawLines = () => {
      const lines = [];
      for (let i = 0; i < count; i++) {
        const angle = angleOffset + Math.random() * angleRange;
        const x = length * Math.cos(angle);
        const y = length * Math.sin(angle);

        const points = [
          position
            ? new THREE.Vector3(position.x, position.y, position.z + 0.2)
            : new THREE.Vector3(0, 1, 0.2),
          position
            ? new THREE.Vector3(position.x + x, position.y + y, position.z)
            : new THREE.Vector3(x, y, 0),
        ];

        // const geometry = new THREE.BufferGeometry().setFromPoints(points);
        var tubeGeometry = new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(points),
          512, // path segments
          0.04, // THICKNESS
          8, //Roundness of Tube
          false //closed
        );
        const material = new THREE.LineBasicMaterial({
          color,

          linewidth: lineWidth,
        });
        const line = new THREE.Line(tubeGeometry, material);
        lines.push(line);
      }
      return lines;
    };

    return (
      <>
        {drawLines().map((line, index) => (
          <primitive key={index} object={line} />
        ))}
      </>
    );
  };

  return isARMode ? (
    <mesh
      position={
        !!position
          ? [position?.x + 10, position?.y, position.z + 50]
          : [0, 0, 0]
      }
    >
      <DrawLines
        count={teamBatters[0]?.ones ?? 0}
        length={2}
        color={0x800080}
        lineWidth={0.3}
        angleOffset={0}
        angleRange={Math.PI * 2}
        position={
          position
            ? new THREE.Vector3(position.x, position.y, position.z - 1.5)
            : new THREE.Vector3(0, 0, -1.5)
        }

        // Position in AR space
      />
      <DrawLines
        count={teamBatters[0]?.twos ?? 0}
        length={3}
        color={0x8b4513}
        lineWidth={0.3}
        angleOffset={0}
        angleRange={Math.PI * 2}
        position={
          position
            ? new THREE.Vector3(position.x, position.y, position.z - 1.5)
            : new THREE.Vector3(0, 0, -1.5)
        }
      />
      <DrawLines
        count={teamBatters[0]?.threes ?? 0}
        length={6}
        color={0xffff00}
        lineWidth={0.3}
        angleOffset={0}
        angleRange={Math.PI * 2}
        position={
          position
            ? new THREE.Vector3(position.x, position.y, position.z - 1.5)
            : new THREE.Vector3(0, 0, -1.5)
        }
      />
      <DrawLines
        count={teamBatters[0]?.fours ?? 0}
        length={8.5}
        color={0xffffff}
        lineWidth={0.3}
        angleOffset={0}
        angleRange={Math.PI * 2}
        position={
          position
            ? new THREE.Vector3(position.x, position.y, position.z - 1.5)
            : new THREE.Vector3(0, 0, -1.5)
        }
      />
      <DrawLines
        count={teamBatters[0]?.sixes ?? 0}
        length={9}
        color={0xff0000}
        lineWidth={0.3}
        angleOffset={0}
        angleRange={Math.PI * 2}
        position={
          position
            ? new THREE.Vector3(position.x, position.y, position.z - 1.5)
            : new THREE.Vector3(0, 0, -1.5)
        }
      />
      <Circle
        radius={8}
        color="green"
        position={
          position
            ? new THREE.Vector3(position.x, position.y, position.z - 0.5)
            : new THREE.Vector3(0, 0, -0.5)
        }
      />

      {/* Pitch in the center */}
      <mesh
        position={
          position
            ? new THREE.Vector3(position.x, position.y, position.z - 0.1)
            : new THREE.Vector3(0, 0, 0.1)
        }
      >
        <boxGeometry args={[0.5, 2, -0.01]} />
        <meshBasicMaterial color="saddlebrown" />
      </mesh>
      <Circle
        radius={3}
        color="white"
        position={
          position
            ? new THREE.Vector3(position.x, position.y, position.z - 1.1)
            : new THREE.Vector3(0, 0, -1.1)
        }
      />

      <Circle
        radius={9}
        color="red"
        position={
          position
            ? new THREE.Vector3(position.x, position.y, position.z - 1)
            : new THREE.Vector3(0, 0, -1)
        }
      />
    </mesh>
  ) : isMobile ? (
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
                {teamBatters.map((b) => (
                  <MenuItem value={b.batName}>{b.batName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        {isLoading || error ? (
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
              teamBatters.find((b) => b.batName === player) ?? {
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
    <Rnd
      size={{ width: width, height: height }}
      position={{ x: x ?? randomX, y: y ?? randomY }}
      onResize={handleResize}
      onDragStop={handleDragStop}
      minWidth={350}
      minHeight={350}
      bounds="window"
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
                    {teamBatters.map((b) => (
                      <MenuItem value={b.batName} key={b.batName}>
                        {b.batName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            {isLoading || error ? (
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
                  teamBatters.find((b) => b.batName === player) ?? {
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
export default WagonWheelWrapper;
