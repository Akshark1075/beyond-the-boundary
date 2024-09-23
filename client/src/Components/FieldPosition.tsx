import React, { useContext, useEffect, useRef } from "react";
import * as THREE from "three";
import WithTitleBar from "./WithTitleBar";
import { Rnd, RndResizeCallback } from "react-rnd";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import { SelectedOption } from "../views/ShowPage";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import { DraggableEvent } from "react-draggable";
import { AppBar, Toolbar, Typography, useMediaQuery } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { PositionContext } from "./PlaneWithContent";
import { BufferGeometry, Mesh } from "three";

interface FieldPositionProps {
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
  isARMode: boolean;
  fieldPosArr: number[][];
  arPos?: THREE.Vector3;
}

const FieldPos: React.FC<FieldPositionProps> = ({
  selections,
  setSelection,
  isARMode,
  fieldPosArr,
  arPos,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { x: randomX, y: randomY } = getRandomCoordinates();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const storedFieldPosition = selections.find(
    (s) => s.name === `Field positions`
  );
  const componentRef = React.useRef<HTMLDivElement>(null);

  const {
    x = randomX,
    y = randomY,
    width = isMobile ? window.screen.width : 350,
    height = isMobile ? window.screen.width + 20 : 370,
  } = storedFieldPosition ?? {};

  if (!storedFieldPosition && !isMobile && !isARMode) {
    const newItems = [
      ...selections,
      {
        name: `Field positions`,
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
    const option = newSelections.find((s) => s.name === `Field positions`);
    if (option && !isMobile) {
      option.x = x;
      option.y = y;
      setSelection(newSelections);
      saveArrayToLocalStorage("selectedOptions", newSelections);
    }
  };

  const setSize = (w: number, h: number) => {
    const newSelections = [...selections];
    const option = newSelections.find((s) => s.name === `Field positions`);
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

  const createCircleTexture = (size: number, color: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;

    // Draw black border
    if (context) {
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fillStyle = "black";
      context.fill();

      // Draw smaller blue circle inside the black border
      context.beginPath();
      context.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  useEffect(() => {
    if (!isARMode) {
      let renderer: THREE.WebGLRenderer | null = null;

      // Set up the scene, camera, and renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio is 1 for a square canvas
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(
        isMobile ? window.screen.width : width,
        isMobile ? window.screen.width : height
      );
      mountRef.current?.appendChild(renderer.domElement);

      // Set ground color
      const groundColor = 0x00ff00;
      scene.background = new THREE.Color(groundColor);

      // Helper function to draw a circle
      const drawCircle = (radius: number, color: number) => {
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

      const drawPoint = (pos: number[], color: string) => {
        // Geometry
        const dotGeometry = new THREE.BufferGeometry();

        // Positions of points
        const vertices = new Float32Array(pos);

        // Set position attribute
        dotGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(vertices, 3)
        );

        // Create a circular texture
        const circleTexture = createCircleTexture(64, color);

        // Points material
        const dotMaterial = new THREE.PointsMaterial({
          size: 10,
          sizeAttenuation: false,
          map: circleTexture,
          alphaTest: 0.5, // To discard the transparent parts of the texture
          transparent: true, // Ensure the material is transparent
        });

        // Points
        const dot = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(dot);
      };

      // Draw the pitch, thirty-yard circle, and boundary
      drawCircle(5, 0xffffff); // White circle for the pitch
      drawCircle(15, 0xffff00); // Thirty-yard circle
      drawCircle(25, 0xff0000); // Boundary

      drawPitch(); // Draw the pitch rectangle
      drawPoint([0, 5.5, 1, 0, -5.5, 1], "red");
      drawPoint([0, -9, 1], "yellow");
      fieldPosArr.map((p: number[], i: number) => {
        drawPoint(fieldPosArr[i], "blue");
      });
      camera.position.z = 40;

      const animate = () => {
        requestAnimationFrame(animate);
        if (renderer) renderer.render(scene, camera);
      };

      animate();

      // Clean up on component unmount
      return () => {
        if (renderer) {
          renderer.dispose();
          renderer.forceContextLoss();
          mountRef.current?.removeChild(renderer.domElement);
          renderer = null;
        }
      };
    }
  }, [width, height, fieldPosArr]);

  const Circle = ({
    radius,
    color,
    position,
  }: {
    position?: THREE.Vector3 | undefined;
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

  const Point = ({
    position,
    color,
    radius,
  }: {
    position: THREE.Vector3 | undefined;
    color: string | undefined;
    radius: number;
  }) => {
    return (
      <mesh position={position}>
        <circleGeometry args={[radius, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    );
  };
  const meshRef = useRef<Mesh<BufferGeometry>>(null);

  return isARMode ? (
    <>
      <mesh ref={meshRef} renderOrder={1}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial transparent={true} color={"white"} opacity={0} />
      </mesh>
      <Circle
        radius={8}
        color="green"
        position={new THREE.Vector3(arPos?.x, arPos?.y, arPos?.z)}
      />

      {/* Pitch in the center */}
      <mesh position={new THREE.Vector3(arPos?.x, arPos?.y, arPos?.z)}>
        <planeGeometry args={[0.5, 2]} />
        <meshBasicMaterial color="saddlebrown" />
      </mesh>

      {/* Circles and points */}
      <Circle
        radius={4}
        color="white"
        position={
          arPos ? new THREE.Vector3(arPos.x, arPos.y, arPos.z - 0.1) : undefined
        }
      />

      <Point
        position={
          arPos
            ? new THREE.Vector3(arPos?.x, arPos?.y + 0.75, arPos?.z)
            : undefined
        }
        color="red"
        radius={0.1}
      />
      <Point
        position={
          arPos
            ? new THREE.Vector3(arPos?.x, arPos?.y - 0.75, arPos?.z)
            : undefined
        }
        color="red"
        radius={0.1}
      />
      <Point
        position={
          arPos
            ? new THREE.Vector3(arPos?.x, arPos?.y - 2, arPos?.z)
            : undefined
        }
        color="yellow"
        radius={0.2}
      />

      {fieldPosArr.map((p: number[], i: number) => {
        return (
          <Point
            position={
              arPos
                ? new THREE.Vector3(
                    arPos.x + fieldPosArr[i][0] / 10,
                    arPos.y + (fieldPosArr[i][1] + 10) / 12,
                    arPos.z + fieldPosArr[i][2]
                  )
                : new THREE.Vector3(
                    fieldPosArr[i][0] / 10,
                    (fieldPosArr[i][1] + 10) / 12,
                    fieldPosArr[i][2]
                  )
            }
            color="blue"
            radius={0.1}
            key={i}
          />
        );
      })}
    </>
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
          <Typography variant="h6" className="grow cursor-pointer select-none">
            {"Field positions"}
          </Typography>
        </Toolbar>
      </AppBar>
      {<div ref={mountRef} />}
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
          title="Field positions"
          width={componentRef.current?.getBoundingClientRect().width ?? width}
          height={
            componentRef.current?.getBoundingClientRect().height ?? height
          }
          storedKey={"Field positions"}
          selections={selections}
          setSelection={setSelection}
        >
          <div ref={mountRef} />
        </WithTitleBar>
      </div>
    </Rnd>
  );
};

const FieldPosition: React.FC<FieldPositionProps> = (props) => {
  const arPos = useContext(PositionContext);
  return (
    <FieldPos
      selections={props.selections}
      setSelection={props.setSelection}
      isARMode={props.isARMode}
      fieldPosArr={props.fieldPosArr}
      arPos={arPos}
    />
  );
};
export default FieldPosition;
