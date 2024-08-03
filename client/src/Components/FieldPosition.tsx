import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import WithTitleBar from "./WithTitleBar";
import { Rnd, RndResizeCallback } from "react-rnd";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";
import { SelectedOption } from "../views/ShowPage";
import getRandomCoordinates from "../utilities/getRandomCoordinates";
import { DraggableEvent } from "react-draggable";
import { AppBar, Toolbar, Typography, useMediaQuery } from "@mui/material";

import { useTheme } from "@mui/material/styles";

interface FieldPositionProps {
  selections: SelectedOption[];
  setSelection: (option: SelectedOption[]) => void;
}

const FieldPosition: React.FC<FieldPositionProps> = ({
  selections,
  setSelection,
}) => {
  const allPos = [
    [0.0, 10.0, 1.0], //Keeper

    [-1.0, 12.0, 1.0], //First Slip

    [-1.5, 11.75, 1.0], //Second Slip

    [-2.0, 11.5, 1.0], //Third Slip

    [-2.5, 11.25, 1.0], //Fourth Slip

    [-3.0, 11.0, 1.0], //Fifth Slip

    [-3.5, 10.75, 1.0], //Sixth Slip

    [-6.5, 10.75, 1.0], //Fly Slip

    [-9, 10, 1.0], //Gully

    [-12.5, 6, 1.0], //Point

    [-12, 7.5, 1.0], //Backward Point

    [-4, 4, 1.0], //Silly Point

    [-13, 4.5, 1.0], //Forward Point

    [-13.5, 0, 1.0], //Cover Point

    [-13.5, -4, 1.0], //Cover

    [-6, -2, 1.0], //Short Cover

    [-13, -6, 1.0], //Extra Cover

    [-5, -8, 1.0], //Mid off

    [-5, -12, 1.0], //Deep Mid off

    [-5, -6, 1.0], //Short Mid off

    [-2.5, 1, 1.0], //Silly Mid off

    [5, -8, 1.0], //Mid on

    [5, -12, 1.0], //Deep Mid on

    [5, -6, 1.0], //Short Mid on

    [2.5, 1, 1.0], //Silly Mid on

    [6, -2, 1.0], //Short Cover

    [13.5, -4, 1.0], //Mid wicket

    [4, 4, 1.0], //Short leg

    [13.5, 4, 1.0], //Square leg

    [13.5, 0, 1.0], //Forward Square leg

    [13.5, -4, 1.0], //Backward Square leg

    [3.0, 11.0, 1.0], //Leg slip

    [9, 10, 1.0], //Leg Gully

    [8, 12, 1.0], //Backward Short Leg

    [12, 15, 1.0], //fine leg

    [10.0, 13, 1.0], //Short fine leg

    [14, 17, 1.0], //Deep fine leg

    [12, 19, 1.0], //Long leg

    [-12, 15, 1.0], //third man

    [-10, 13, 1.0], //Short third man

    [-14, 17, 1.0], //Deep third man

    [-12, 19, 1.0], //Fine third man
    [-16, 14, 1.0], //Square fine leg

    [-20, 8.5, 1.0], //Deep Backward Point

    [-22, 6, 1.0], //Deep Point

    [-23, 0, 1.0], //Deep Cover Point

    [-22, -6, 1.0], //Deep Cover

    [-21, -10, 1.0], //Sweeper Cover

    [-12, -20, 1.0], //Wide Long off

    [-8, -22, 1.0], //Long off

    [-4, -23, 1.0], //Straight Long offs

    [0, -23, 1.0], //Straight Hit

    [8, -22, 1.0], //Long on

    [4, -23, 1.0], //Straight Long on

    [21, -10, 1.0], //Deep Forward Mid wicket

    [22, -6, 1.0], //Deep Mid wicket

    [-23, 2, 1.0], //Deep Forward Square leg

    [22, 6, 1.0], //Deep Square leg

    [20, 8.5, 1.0], //Deep Backward Square leg
  ];

  const mountRef = useRef<HTMLDivElement>(null);
  const { x: randomX, y: randomY } = getRandomCoordinates();
  const storedScoreComparison = selections.find(
    (s) => s.name === `Field positions`
  );
  const componentRef = React.useRef<HTMLDivElement>(null);

  function getRandomSubarray(arr: number[][], subarrayLength: number) {
    const indexesArr = [0];
    while (indexesArr.length < subarrayLength) {
      const rand = Math.floor(Math.random() * arr.length);
      if (!indexesArr.includes(rand)) {
        indexesArr.push(rand);
      }
    }
    return indexesArr.map((i) => arr[i]).flat();
  }

  const randArray = useMemo(
    () => getRandomSubarray(allPos, 10),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allPos[0][0]]
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {
    x = randomX,
    y = randomY,
    width = isMobile ? window.screen.width : 350,
    height = isMobile ? window.screen.width + 20 : 370,
  } = storedScoreComparison ?? {};

  if (!storedScoreComparison && !isMobile) {
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
    let renderer: THREE.WebGLRenderer | null = null;

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio is 1 for a square canvas
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
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
    drawPoint(randArray, "blue");

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
  }, [width, height, randArray]);

  return isMobile ? (
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

export default FieldPosition;
