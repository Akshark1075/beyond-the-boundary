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
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { BufferGeometry, Mesh, Vector3 } from "three";
import Html from "./HTMLOverlay";
import { createContext } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { Interactive } from "@react-three/xr";

export const PositionContext = createContext<Vector3 | undefined>(
  new THREE.Vector3(0, 0, 0)
);

const WithXRPlane = ({
  component,
  position,
  title,
}: {
  component: JSX.Element;
  position?: Vector3;
  title: string;
}) => {
  const meshRef = useRef<Mesh<BufferGeometry>>(null);
  const plusMeshRef = useRef<Mesh<BufferGeometry>>(null);
  const minusMeshRef = useRef<Mesh<BufferGeometry>>(null);
  const { camera } = useThree();
  const [pos, setPos] = useState(
    position
      ? new THREE.Vector3(
          position.x,
          position.y,

          position.z
        )
      : new THREE.Vector3(0, 0, 0)
  );

  useEffect(() => {
    if (meshRef.current) {
      // Make the mesh look at the camera when it is first placed
      meshRef.current.lookAt(camera.position);
      updatePlusMinusMeshPositions();
    }
  }, [camera.position, pos]);

  const updatePlusMinusMeshPositions = () => {
    if (meshRef.current) {
      const scaleY = meshRef.current.scale.y;
      if (plusMeshRef.current) {
        plusMeshRef.current.position.set(
          meshRef.current.position.x + 1,
          meshRef.current.position.y + scaleY + 0.2,
          meshRef.current.position.z
        );
        plusMeshRef.current.lookAt(
          new THREE.Vector3(
            camera.position.x + 1,
            camera.position.y,
            camera.position.z
          )
        );
      }
      if (minusMeshRef.current) {
        minusMeshRef.current.position.set(
          meshRef.current.position.x - 1,
          meshRef.current.position.y + scaleY + 0.2,
          meshRef.current.position.z
        );
        minusMeshRef.current.lookAt(
          new THREE.Vector3(
            camera.position.x,
            camera.position.y - 1,
            camera.position.z
          )
        );
      }
    }
  };

  const handleScaleUp = () => {
    if (meshRef.current) {
      const scaleX = meshRef.current.scale.x;
      const scaleY = meshRef.current.scale.y;
      const scaleZ = meshRef.current.scale.z;

      meshRef.current.scale.set(scaleX + 0.2, scaleY + 0.2, scaleZ + 0.2);
      if (plusMeshRef.current) {
        plusMeshRef.current.position.set(
          meshRef.current.position.x + 1,
          meshRef.current.position.y + meshRef.current.scale.y + 0.2,
          meshRef.current.position.z
        );
      }
      if (minusMeshRef.current) {
        minusMeshRef.current.position.set(
          meshRef.current.position.x - 1,
          meshRef.current.position.y + meshRef.current.scale.y + 0.2,
          meshRef.current.position.z
        );
      }
    }
  };

  const handleScaleDown = () => {
    if (meshRef.current) {
      const scaleX = meshRef.current.scale.x;
      const scaleY = meshRef.current.scale.y;
      const scaleZ = meshRef.current.scale.z;
      meshRef.current.scale.set(scaleX - 0.2, scaleY - 0.2, scaleZ - 0.2);
      if (plusMeshRef.current) {
        plusMeshRef.current.position.set(
          meshRef.current.position.x + 1,
          meshRef.current.position.y + meshRef.current.scale.y - 0.2,
          meshRef.current.position.z
        );
      }
      if (minusMeshRef.current) {
        minusMeshRef.current.position.set(
          meshRef.current.position.x - 1,
          meshRef.current.position.y + meshRef.current.scale.y - 0.2,
          meshRef.current.position.z
        );
      }
    }
  };
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);

  return (
    <PositionContext.Provider value={pos}>
      <>
        <mesh
          position={!!pos ? [pos.x, 1, pos.z] : [0, 1, -2]}
          ref={meshRef}
          scale={
            title === `Runs per over` ||
            title === `Scorecard comparison` ||
            title === `Field positions` ||
            title === `Wagonwheel`
              ? [0.1, 0.1, 0.1]
              : [1, 1, 1]
          }
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
                    <planeGeometry args={[2, 2]} />
                    <meshBasicMaterial color={"white"} />
                  </mesh>
                ))}
              <Html width={2} height={2}>
                {component}
              </Html>
            </>
          )}
        </mesh>

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
      </>
    </PositionContext.Provider>
  );
};

export default WithXRPlane;
