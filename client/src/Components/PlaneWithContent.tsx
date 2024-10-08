import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { BufferGeometry, Mesh, Vector3 } from "three";
import Html from "./HTMLOverlay";
import { createContext } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { Interactive, useXR, XRInteractionEvent } from "@react-three/xr";
import { useDrag } from "@use-gesture/react";
import { Model } from "../views/ShowPage";
import { saveArrayToLocalStorage } from "../utilities/localStorageUtils";

export const PositionContext = createContext<Vector3 | undefined>(
  new THREE.Vector3(0, 0, 0)
);

const WithXRPlane = ({
  component,
  position,
  title,
  image,
  models,
  setModels,
  scale,
  videoRef,
}: {
  component: JSX.Element;
  position?: Vector3;
  scale?: Vector3;
  title: string;
  image: string;
  models: Model[];
  setModels: React.Dispatch<React.SetStateAction<Model[]>>;
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
}) => {
  const { camera, size: viewSize } = useThree();
  const sceneSize = useMemo(() => {
    const cam = camera;
    // @ts-ignore: Unreachable code error
    const fov = (cam.fov * Math.PI) / 180; // convert vertical fov to radians
    const height = 2 * Math.tan(fov / 2) * 5; // visible height
    const width = height * (viewSize.width / viewSize.height);
    return { width, height };
  }, [camera, viewSize]);
  //Initializing reference for main mesh and control meshes
  const meshRef = useRef<Mesh<BufferGeometry>>(null);
  const plusMeshRef = useRef<Mesh<BufferGeometry>>(null);
  const minusMeshRef = useRef<Mesh<BufferGeometry>>(null);
  const closeMeshRef = useRef<Mesh<BufferGeometry>>(null);
  const titleRef = useRef<Mesh<BufferGeometry>>(null);
  //Initializing Position and Scale
  const [pos, setPos] = useState(
    position ? position : new THREE.Vector3(-3, 1, 3)
  );
  const [meshScale, setMeshScale] = useState(
    scale
      ? new THREE.Vector3(
          scale.x,
          scale.y,

          scale.z
        )
      : new THREE.Vector3(1, 1, 1)
  );
  //Using useDrag function for implementing draggable meshes
  const bind = useDrag((state) => {
    const {
      movement: [mx, my],
    } = state;

    // Get the camera's world direction
    const direction = new THREE.Vector3();
    const rightController = controllers.find(
      (c) => c.inputSource && c.inputSource.handedness === "right"
    );
    rightController?.getWorldDirection(direction);

    // threshold for movement sensitivity
    const threshold = 0.1;
    //setting new position
    setPos((prev: any) => {
      // Calculate movement based on the camera's world direction
      const xMove = Math.abs(direction.x) > threshold ? mx / 10000 : 0; // Move along the X-axis
      const yMove = Math.abs(direction.y) > threshold ? my / 10000 : 0; // Move along the Y-axis
      const zMove = Math.abs(direction.z) > threshold ? -my / 10000 : 0; // Move forward/backward along Z-axis

      // Only apply movement if it's greater than the threshold
      const newX = Math.abs(xMove) > threshold ? prev.x + xMove : prev.x;
      const newY = Math.abs(yMove) > threshold ? prev.y + yMove : prev.y;
      const newZ = Math.abs(zMove) > threshold ? prev.z + zMove : prev.z;

      return new THREE.Vector3(newX, newY, newZ);
    });
  });
  //Making the meshes look at the camera
  useEffect(() => {
    if (meshRef.current) {
      if (!!meshRef.current.lookAt) meshRef.current.lookAt(camera.position);
      updateControlMeshPositions();
    }
  }, [camera.position, pos]);
  //Update the position of mesh controls
  const updateControlMeshPositions = () => {
    if (meshRef.current && camera) {
      const scaleY = meshRef.current.scale.y;

      // Get the camera's right vector
      const rightVector = new THREE.Vector3();
      camera.getWorldDirection(rightVector);
      rightVector.cross(camera.up).normalize();
      //Plus Button
      if (plusMeshRef.current) {
        plusMeshRef.current.position.copy(meshRef.current.position);
        plusMeshRef.current.position.add(
          rightVector.clone().multiplyScalar(1 + meshRef.current.scale.x / 2)
        );
        plusMeshRef.current.position.y += scaleY + 0.2;
        plusMeshRef.current.lookAt(camera.position);
      }
      //Minus Button
      if (minusMeshRef.current) {
        minusMeshRef.current.position.copy(meshRef.current.position);
        minusMeshRef.current.position.add(
          rightVector.clone().multiplyScalar(-1 - meshRef.current.scale.x / 2)
        );
        minusMeshRef.current.position.y += scaleY + 0.2;
        minusMeshRef.current.lookAt(camera.position);
      }
      //Close Button
      if (closeMeshRef.current) {
        const offset =
          title === `Runs per over` ||
          title === `Scorecard comparison` ||
          title === `Field positions` ||
          title === `Wagonwheel`
            ? 1
            : 0.2;
        closeMeshRef.current.position.copy(meshRef.current.position);
        closeMeshRef.current.position.y += scaleY + offset; // Move down to the bottom center
        closeMeshRef.current.lookAt(camera.position); // Ensure it faces the camera
      }
      //Component Title
      if (titleRef.current) {
        const offset =
          title === `Runs per over` ||
          title === `Scorecard comparison` ||
          title === `Field positions` ||
          title === `Wagonwheel`
            ? 1.5
            : 0.5;
        titleRef.current.position.copy(meshRef.current.position);
        titleRef.current.position.y += scaleY + offset; // Move down to the bottom center
        titleRef.current.lookAt(camera.position); // Ensure it faces the camera
      }
    }
  };
  //Function for scaling up the meshes
  const handleScaleUp = () => {
    if (meshRef.current) {
      const scaleX = meshRef.current.scale.x;
      const scaleY = meshRef.current.scale.y;
      const scaleZ = meshRef.current.scale.z;
      const newScaleOffset =
        title === `Runs per over` || title === `Scorecard comparison`
          ? 0.1
          : title === `Field positions` || title === `Wagonwheel`
          ? 0.02
          : 0.2;
      setMeshScale((prevScale) => {
        return new Vector3(
          prevScale.x + newScaleOffset,
          prevScale.y + newScaleOffset,
          prevScale.z + newScaleOffset
        );
      });
      meshRef.current.scale.set(
        scaleX + newScaleOffset,
        scaleY + newScaleOffset,
        scaleZ + newScaleOffset
      );
      const selectedModels = [...models];
      const option = selectedModels.find((s) => s.title === title);
      if (option) {
        option.scale = new THREE.Vector3(
          scaleX + newScaleOffset,
          scaleY + newScaleOffset,
          scaleZ + newScaleOffset
        );
        saveArrayToLocalStorage(
          "selectedAROptions",
          selectedModels.map((m) => ({
            position: m.position,
            title: m.title,
            id: m.id,
            scale: m.scale,
          }))
        );
        setModels(selectedModels);
      }
      updateControlMeshPositions();
    }
  };
  //Function for scaling down the meshes
  const handleScaleDown = () => {
    if (meshRef.current) {
      const scaleX = meshRef.current.scale.x;
      const scaleY = meshRef.current.scale.y;
      const scaleZ = meshRef.current.scale.z;
      const newScaleOffset =
        title === `Runs per over` || title === `Scorecard comparison`
          ? 0.1
          : title === `Field positions` || title === `Wagonwheel`
          ? 0.02
          : 0.2;
      setMeshScale(
        (prevScale) =>
          new Vector3(
            prevScale.x - newScaleOffset,
            prevScale.y - newScaleOffset,
            prevScale.z - newScaleOffset
          )
      );
      meshRef.current.scale.set(
        scaleX - newScaleOffset,
        scaleY - newScaleOffset,
        scaleZ - newScaleOffset
      );
      const selectedModels = [...models];
      const option = selectedModels.find((s) => s.title === title);
      if (option) {
        option.scale = new THREE.Vector3(
          scaleX - newScaleOffset,
          scaleY - newScaleOffset,
          scaleZ - newScaleOffset
        );
        saveArrayToLocalStorage(
          "selectedAROptions",
          selectedModels.map((m) => ({
            position: m.position,
            title: m.title,
            id: m.id,
            scale: m.scale,
          }))
        );
        setModels(selectedModels);
      }

      updateControlMeshPositions();
    }
  };
  //Function for removing the meshes
  const handleClose = () => {
    if (title === "Video") {
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
    }
    setModels((prevModels) => {
      saveArrayToLocalStorage(
        "selectedAROptions",
        prevModels
          .filter((model) => model.component !== component)
          .map((m) =>
            Object.assign({
              title: m.title,
              id: m.id,
              position: m.position,
              scale: m.scale,
            })
          )
      );

      return prevModels.filter((model) => model.component !== component);
    });
  };
  const isDraggingRef = useRef(false);
  //Functions for controlling drag functionality
  const handleDragStart = (event: XRInteractionEvent) => {
    if (isDraggingRef.current) {
      return;
    }

    if (meshRef.current) {
      isDraggingRef.current = true;
    }
  };
  const handleDrag = (event: XRInteractionEvent) => {
    if (!isDraggingRef.current) {
      return;
    }
    if (meshRef.current) {
      meshRef.current.position.copy(event.intersections[0].point);
      setPos(event.intersections[0].point);
    }
  };

  const handleRelease = (event: XRInteractionEvent) => {
    // Clean up event listeners when dragging ends
    if (isDraggingRef.current) {
      // setPos(event.intersections[0].point);
      const selectedModels = [...models];
      const option = selectedModels.find((s) => s.title === title);
      if (option) {
        option.position = event.intersections[0].point;
        saveArrayToLocalStorage(
          "selectedAROptions",
          selectedModels.map((m) => ({
            position: m.position,
            title: m.title,
            id: m.id,
            scale: m.scale,
          }))
        );
        setModels(selectedModels);
      }
      isDraggingRef.current = false;
    }
  };

  const { controllers } = useXR();
  //Functionality for controlling the distance of the meshes from the camera (uses Joystick)
  useFrame(() => {
    // Find the right controller
    const rightController = controllers.find(
      (c) => c.inputSource && c.inputSource.handedness === "right"
    );

    if (
      isDraggingRef.current &&
      rightController &&
      rightController.inputSource
    ) {
      const gamepad = rightController.inputSource.gamepad;

      if (gamepad && gamepad.axes.length >= 2) {
        const thumbstickY = gamepad.axes[3]; // Y-axis for forward-backward movement

        // Move mesh along the Z-axis based on thumbstick Y movement
        const speedForward = thumbstickY * 0.1;
        if (meshRef.current) {
          meshRef.current.position.z -= speedForward; // Adjust mesh position
          setPos(
            (prevPos) =>
              new THREE.Vector3(prevPos.x, prevPos.y, prevPos.z - speedForward)
          );
        }
      }
    }
  });
  //Setting width and height for the planes
  const getWidthAndHeight = (title: string) => {
    switch (title) {
      case "Fall of wickets":
        return { width: 2, height: 0.5 };
      case "Batting Scorecard":
        return { width: 2, height: 2 };
      case "Bowling Scorecard":
        return { width: 2, height: 2 };
      default:
        return { width: 2, height: 2 };
    }
  };
  const { width, height } = getWidthAndHeight(title);

  return (
    <PositionContext.Provider value={pos}>
      <>
        <Interactive
          onSelectStart={handleDragStart}
          onSelectEnd={handleRelease}
          onMove={handleDrag}
        >
          (
          <Text fontSize={0.1} color="white" fontWeight="bold" ref={titleRef}>
            {title}
          </Text>
          ){/**Approach 1: Using 3D Models**/}
          {title === `Runs per over` ||
          title === `Scorecard comparison` ||
          title === `Field positions` ||
          title === `Wagonwheel` ? (
            <group
              position={pos}
              ref={meshRef}
              scale={
                !!meshScale
                  ? meshScale
                  : title === `Field positions` || title === `Wagonwheel`
                  ? [0.1, 0.1, 0.1]
                  : title === `Runs per over` ||
                    title === `Scorecard comparison`
                  ? [0.5, 0.5, 0.5]
                  : [1, 1, 1]
              }
              {...(bind() as any)}
            >
              {component}
            </group>
          ) : (
            <mesh
              position={pos}
              ref={meshRef}
              scale={
                !!meshScale
                  ? meshScale
                  : title === `Field positions` || title === `Wagonwheel`
                  ? [0.1, 0.1, 0.1]
                  : [1, 1, 1]
              }
              {...(bind() as any)}
            >
              {/**Approach 2: Using HTML image textures**/}
              {title === `Field positions` ||
              title === `Video` ||
              title === `Wagonwheel` ? (
                component
              ) : (
                <>
                  {title === "Batting Scorecard" ||
                    (title === "Bowling Scorecard" && (
                      <mesh>
                        <planeGeometry args={[width, height]} />
                        <meshBasicMaterial color={"white"} />
                      </mesh>
                    ))}
                  <Html
                    width={width}
                    height={height}
                    image={image}
                    sceneSize={sceneSize}
                  >
                    {component}
                  </Html>
                </>
              )}
            </mesh>
          )}
        </Interactive>
        {/* Minus Button*/}
        <Interactive onSelect={handleScaleDown}>
          <mesh ref={minusMeshRef}>
            <circleGeometry args={[0.15, 32]} />
            <meshBasicMaterial color={"lightgray"} />
            <Text
              fontSize={0.3}
              color="black"
              anchorX="center"
              anchorY="middle"
            >
              -
            </Text>
          </mesh>
        </Interactive>
        {/* Plus Button*/}
        <Interactive onSelect={handleScaleUp}>
          <mesh ref={plusMeshRef}>
            <circleGeometry args={[0.15, 32]} />
            <meshBasicMaterial color={"lightgray"} />
            <Text
              fontSize={0.3}
              color="black"
              anchorX="center"
              anchorY="middle"
            >
              +
            </Text>
          </mesh>
        </Interactive>
        {/* Close Button*/}
        <Interactive onSelect={handleClose}>
          <mesh ref={closeMeshRef}>
            <circleGeometry args={[0.15, 32]} />
            <meshBasicMaterial color={new THREE.Color("#E50914")} />
            <Text
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              X
            </Text>
          </mesh>
        </Interactive>
      </>
    </PositionContext.Provider>
  );
};

export default WithXRPlane;
