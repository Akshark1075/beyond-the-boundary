// import { useEffect, useRef, useState } from "react";
// import { useFrame, useThree } from "@react-three/fiber";
// import { BufferGeometry, Mesh, Vector3 } from "three";
// import Html from "./HTMLOverlay";
// import { createContext } from "react";
// import * as THREE from "three";
// import { Text } from "@react-three/drei";
// import { Interactive, RayGrab } from "@react-three/xr";
// export const PositionContext = createContext<Vector3 | undefined>(
//   new THREE.Vector3(0, 0, 0)
// );
// const WithXRPlane = ({
//   component,
//   position,
//   title,
// }: {
//   component: JSX.Element;
//   position?: Vector3;
//   title: string;
// }) => {
//   const meshRef = useRef<Mesh<BufferGeometry>>(null);
//   const plusMeshRef = useRef<Mesh<BufferGeometry>>(null);
//   const minusMeshRef = useRef<Mesh<BufferGeometry>>(null);
//   const { camera } = useThree();
//   const [pos, setPos] = useState(
//     position
//       ? new THREE.Vector3(
//           position?.x,
//           position.y,
//           title === "Field positions" || title === "Wagonwheel"
//             ? position.z - 4
//             : position.z
//         )
//       : new THREE.Vector3(0, 0, 0)
//   );
//   useEffect(() => {
//     if (meshRef.current) {
//       // Make the mesh look at the camera when it is first placed
//       meshRef.current.lookAt(
//         new THREE.Vector3(
//           camera.position.x,
//           camera.position.y,
//           camera.position.z
//         )
//       );
//     }
//     updatePlusMinusMeshPositions();
//   }, [camera.position, meshRef.current]);

//   const getWidthAndHeight = (title: string) => {
//     switch (title) {
//       case "Fall of wickets":
//         return { width: 2, height: 0.5 };
//       case "Batting Scorecard":
//         return { width: 2, height: 2 };
//       case "Bowling Scorecard":
//         return { width: 2, height: 2 };
//       default:
//         return { width: 2, height: 2 };
//     }
//   };
//   const { width, height } = getWidthAndHeight(title);
//   const handleScaleUp = () => {
//     if (meshRef.current) {
//       const scaleX = meshRef.current.scale.x;
//       const scaleY = meshRef.current.scale.y;
//       const scaleZ = meshRef.current.scale.z;

//       meshRef.current.scale.set(scaleX + 0.2, scaleY + 0.2, scaleZ + 0.2);
//       if (plusMeshRef.current) {
//         plusMeshRef.current.position.set(
//           meshRef.current.position.x + 1,
//           meshRef.current.position.y + meshRef.current.scale.y + 0.2,
//           meshRef.current.position.z
//         );
//       }
//       if (minusMeshRef.current) {
//         minusMeshRef.current.position.set(
//           meshRef.current.position.x - 1,
//           meshRef.current.position.y + meshRef.current.scale.y + 0.2,
//           meshRef.current.position.z
//         );
//       }
//     }
//   };

//   const handleScaleDown = () => {
//     if (meshRef.current) {
//       const scaleX = meshRef.current.scale.x;
//       const scaleY = meshRef.current.scale.y;
//       const scaleZ = meshRef.current.scale.z;
//       meshRef.current.scale.set(scaleX - 0.2, scaleY - 0.2, scaleZ - 0.2);
//       if (plusMeshRef.current) {
//         plusMeshRef.current.position.set(
//           meshRef.current.position.x + 1,
//           meshRef.current.position.y + meshRef.current.scale.y - 0.2,
//           meshRef.current.position.z
//         );
//       }
//       if (minusMeshRef.current) {
//         minusMeshRef.current.position.set(
//           meshRef.current.position.x - 1,
//           meshRef.current.position.y + meshRef.current.scale.y - 0.2,
//           meshRef.current.position.z
//         );
//       }
//     }
//   };
//   const updatePlusMinusMeshPositions = () => {
//     if (meshRef.current) {
//       const scaleY = meshRef.current.scale.y;
//       if (plusMeshRef.current) {
//         plusMeshRef.current.position.set(
//           meshRef.current.position.x + 1,
//           meshRef.current.position.y + scaleY + 0.2,
//           meshRef.current.position.z
//         );
//       }
//       if (minusMeshRef.current) {
//         minusMeshRef.current.position.set(
//           meshRef.current.position.x - 1,
//           meshRef.current.position.y + scaleY + 0.2,
//           meshRef.current.position.z
//         );
//       }
//     }
//   };
//   return (
//     <PositionContext.Provider value={pos}>
//       {
//         <>
//           {meshRef.current && (
//             <Interactive onSelect={handleScaleDown}>
//               <mesh
//                 position={
//                   meshRef.current
//                     ? [
//                         meshRef.current?.position.x - 1,
//                         meshRef.current?.position.y +
//                           meshRef.current.scale.y +
//                           0.2,
//                         meshRef.current.position.z,
//                       ]
//                     : [0, 0, 0]
//                 }
//                 ref={minusMeshRef}
//               >
//                 <circleGeometry args={[0.15, 32]} />
//                 <meshBasicMaterial color={"lightgray"} />
//                 <Text
//                   fontSize={0.3}
//                   color="black"
//                   anchorX="center"
//                   anchorY="middle"
//                 >
//                   -
//                 </Text>
//               </mesh>
//             </Interactive>
//           )}
//           {meshRef.current && (
//             <Interactive onSelect={handleScaleUp}>
//               <mesh ref={plusMeshRef}>
//                 <circleGeometry args={[0.15, 32]} />
//                 <meshBasicMaterial color={"lightgray"} />
//                 <Text
//                   fontSize={0.3}
//                   color="black"
//                   anchorX="center"
//                   anchorY="middle"
//                 >
//                   +
//                 </Text>
//               </mesh>
//             </Interactive>
//           )}
//         </>
//       }
//       <mesh
//         position={!!pos ? [pos.x, 1, pos.z] : [0, 1, -2]}
//         ref={meshRef}
//         scale={
//           title === `Runs per over` ||
//           title === `Scorecard comparison` ||
//           title === `Field positions` ||
//           title === `Wagonwheel`
//             ? [0.1, 0.1, 0.1]
//             : [1, 1, 1]
//         }
//       >
//         {title === `Runs per over` ||
//         title === `Scorecard comparison` ||
//         title === `Field positions` ||
//         title === `Video` ||
//         title === `Wagonwheel` ? (
//           component
//         ) : (
//           <>
//             {title === "Batting Scorecard" ||
//               (title === "Bowling Scorecard" && (
//                 <mesh>
//                   <planeGeometry args={[width, height]} />
//                   <meshBasicMaterial color={"white"} />
//                 </mesh>
//               ))}
//             <Html width={width} height={height}>
//               {component}
//             </Html>
//           </>
//         )}
//       </mesh>
//     </PositionContext.Provider>
//   );
// };
// export default WithXRPlane;
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { BufferGeometry, Mesh, Vector3 } from "three";
import Html from "./HTMLOverlay";
import { createContext } from "react";
import * as THREE from "three";
import { Box, Text } from "@react-three/drei";
import { Interactive, useXR, XRInteractionEvent } from "@react-three/xr";
import { useQuery } from "@tanstack/react-query";
import { useDrag, useGesture } from "@use-gesture/react";
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

  const meshRef = useRef<Mesh<BufferGeometry>>(null);
  const plusMeshRef = useRef<Mesh<BufferGeometry>>(null);
  const minusMeshRef = useRef<Mesh<BufferGeometry>>(null);
  const closeMeshRef = useRef<Mesh<BufferGeometry>>(null);
  const titleRef = useRef<Mesh<BufferGeometry>>(null);

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
  // const bind = useDrag((state) => {
  //   const {
  //     offset: [x, y],
  //   } = state;
  //   setPos(
  //     (prev: any) =>
  //       new THREE.Vector3(prev[0] + x / 1000, prev[1] - y / 1000, prev[2])
  //   );
  // });
  // const bind = useDrag((state) => {
  //   const {
  //     movement: [mx, my],
  //   } = state;

  //   // Get the camera's world direction
  //   const direction = new THREE.Vector3();
  //   camera.getWorldDirection(direction);

  //   setPos((prev: any) => {
  //     // Check camera direction and decide to add or subtract movement
  //     const xMove = direction.z > 0 ? mx / 10000 : -mx / 10000; // Forward/backward along Z-axis
  //     const yMove = direction.y > 0 ? -my / 10000 : my / 10000; // Up/down along Y-axis

  //     return new THREE.Vector3(prev.x + xMove, prev.y + yMove, prev.z);
  //   });
  // });
  // const bind = useDrag((state) => {
  //   const {
  //     movement: [mx, my],
  //   } = state;

  //   // Get the camera's world direction
  //   const direction = new THREE.Vector3();
  //   camera.getWorldDirection(direction);

  //   // Define a threshold for movement sensitivity
  //   const threshold = 0.1;

  //   setPos((prev: any) => {
  //     // Calculate movement based on the camera's direction
  //     const xMove = direction.z > 0 ? mx / 10000 : -mx / 10000; // Forward/backward along Z-axis
  //     const yMove = direction.y > 0 ? -my / 10000 : my / 10000; // Up/down along Y-axis

  //     // Only apply movement if it's greater than the threshold
  //     const newX = Math.abs(xMove) > threshold ? prev.x + xMove : prev.x;
  //     const newY = Math.abs(yMove) > threshold ? prev.y + yMove : prev.y;

  //     // Return updated position
  //     return new THREE.Vector3(newX, newY, prev.z);
  //   });
  // });
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

    // Define a threshold for movement sensitivity
    const threshold = 0.1;

    setPos((prev: any) => {
      // Calculate movement based on the camera's world direction
      const xMove = Math.abs(direction.x) > threshold ? mx / 10000 : 0; // Move along the X-axis
      const yMove = Math.abs(direction.y) > threshold ? my / 10000 : 0; // Move along the Y-axis
      const zMove = Math.abs(direction.z) > threshold ? -my / 10000 : 0; // Move forward/backward along Z-axis

      // Only apply movement if it's greater than the threshold
      const newX = Math.abs(xMove) > threshold ? prev.x + xMove : prev.x;
      const newY = Math.abs(yMove) > threshold ? prev.y + yMove : prev.y;
      const newZ = Math.abs(zMove) > threshold ? prev.z + zMove : prev.z;

      // Return updated position
      return new THREE.Vector3(newX, newY, newZ);
    });
  });

  useEffect(() => {
    if (meshRef.current) {
      // Make the mesh look at the camera when it is first placed
      if (!!meshRef.current.lookAt) meshRef.current.lookAt(camera.position);
      updateControlMeshPositions();
    }
  }, [camera.position, pos]);

  // const updatePlusMinusMeshPositions = () => {
  //   if (meshRef.current) {
  //     const scaleY = meshRef.current.scale.y;
  //     if (plusMeshRef.current) {
  //       plusMeshRef.current.position.set(
  //         meshRef.current.position.x + 1,
  //         meshRef.current.position.y + scaleY + 0.2,
  //         meshRef.current.position.z
  //       );
  //       plusMeshRef.current.lookAt(
  //         new THREE.Vector3(
  //           camera.position.x + 1,
  //           camera.position.y,
  //           camera.position.z
  //         )
  //       );
  //     }
  //     if (minusMeshRef.current) {
  //       minusMeshRef.current.position.set(
  //         meshRef.current.position.x - 1,
  //         meshRef.current.position.y + scaleY + 0.2,
  //         meshRef.current.position.z
  //       );
  //       minusMeshRef.current.lookAt(
  //         new THREE.Vector3(
  //           camera.position.x - 1,
  //           camera.position.y,
  //           camera.position.z
  //         )
  //       );
  //     }
  //   }
  // };

  const updateControlMeshPositions = () => {
    if (meshRef.current && camera) {
      const scaleY = meshRef.current.scale.y;

      // Get the camera's right vector
      const rightVector = new THREE.Vector3();
      camera.getWorldDirection(rightVector);
      rightVector.cross(camera.up).normalize(); // Get the right direction

      // Position the plus mesh
      if (plusMeshRef.current) {
        plusMeshRef.current.position.copy(meshRef.current.position);
        plusMeshRef.current.position.add(
          rightVector.clone().multiplyScalar(1 + meshRef.current.scale.x / 2)
        ); // Move right
        plusMeshRef.current.position.y += scaleY + 0.2; // Adjust height
        plusMeshRef.current.lookAt(camera.position);
      }

      // Position the minus mesh
      if (minusMeshRef.current) {
        minusMeshRef.current.position.copy(meshRef.current.position);
        minusMeshRef.current.position.add(
          rightVector.clone().multiplyScalar(-1 - meshRef.current.scale.x / 2)
        ); // Move left
        minusMeshRef.current.position.y += scaleY + 0.2; // Adjust height
        minusMeshRef.current.lookAt(camera.position);
      }
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
      // if (plusMeshRef.current) {
      //   plusMeshRef.current.position.set(
      //     meshRef.current.position.x + 1,
      //     meshRef.current.position.y + meshRef.current.scale.y + 0.2,
      //     meshRef.current.position.z
      //   );
      // }
      // if (minusMeshRef.current) {
      //   minusMeshRef.current.position.set(
      //     meshRef.current.position.x - 1,
      //     meshRef.current.position.y + meshRef.current.scale.y + 0.2,
      //     meshRef.current.position.z
      //   );
      // }
      // if (closeMeshRef.current) {
      //   closeMeshRef.current.position.set(
      //     meshRef.current.position.x,
      //     meshRef.current.position.y + meshRef.current.scale.y + 0.2,
      //     meshRef.current.position.z
      //   );
      // }
      // if (titleRef.current) {
      //   titleRef.current.position.set(
      //     meshRef.current.position.x,
      //     meshRef.current.position.y + meshRef.current.scale.y + 0.5,
      //     meshRef.current.position.z
      //   );
      // }
    }
  };

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

      // if (plusMeshRef.current) {
      //   plusMeshRef.current.position.set(
      //     meshRef.current.position.x + 1,
      //     meshRef.current.position.y + meshRef.current.scale.y - 0.2,
      //     meshRef.current.position.z
      //   );
      // }
      // if (minusMeshRef.current) {
      //   minusMeshRef.current.position.set(
      //     meshRef.current.position.x - 1,
      //     meshRef.current.position.y + meshRef.current.scale.y - 0.2,
      //     meshRef.current.position.z
      //   );
      // }
      // if (closeMeshRef.current) {
      //   closeMeshRef.current.position.set(
      //     meshRef.current.position.x,
      //     meshRef.current.position.y + meshRef.current.scale.y - 0.2,
      //     meshRef.current.position.z
      //   );
      // }
      // if (titleRef.current) {
      //   titleRef.current.position.set(
      //     meshRef.current.position.x,
      //     meshRef.current.position.y + meshRef.current.scale.y - 0.5,
      //     meshRef.current.position.z
      //   );
      // }
      updateControlMeshPositions();
    }
  };
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
  const handleDragStart = (event: XRInteractionEvent) => {
    if (isDraggingRef.current) {
      return;
    }

    if (meshRef.current) {
      isDraggingRef.current = true;
      // meshRef.current.position.copy(event.intersections[0].point);
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
          )
          <mesh
            position={pos}
            ref={meshRef}
            scale={
              !!meshScale
                ? meshScale
                : title === `Runs per over` || title === `Scorecard comparison`
                ? [0.5, 0.5, 0.5]
                : title === `Field positions` || title === `Wagonwheel`
                ? [0.1, 0.1, 0.1]
                : [1, 1, 1]
            }
            {...(bind() as any)}
          >
            {title === `Runs per over` ||
            title === `Scorecard comparison` ||
            title === `Field positions` ||
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
        </Interactive>

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
