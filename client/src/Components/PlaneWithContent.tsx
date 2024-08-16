import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { BufferGeometry, Mesh, Vector3 } from "three";
import Html from "./HTMLOverlay";
import { createContext } from "react";
import * as THREE from "three";
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
  const { camera } = useThree();
  const [pos, setPos] = useState(
    position
      ? new THREE.Vector3(
          position?.x,
          position.y,
          title === "Field positions" || title === "Wagonwheel"
            ? position.z - 4
            : position.z
        )
      : new THREE.Vector3(0, 0, 0)
  );
  useEffect(() => {
    if (meshRef.current) {
      // Make the mesh look at the camera when it is first placed
      meshRef.current.lookAt(camera.position);
    }
  }, [camera.position]);
  const getWidthAndHeight = (title: string) => {
    switch (title) {
      case "Fall of wickets":
        return { width: 2, height: 0.5 };
      case "Batting Scorecard":
        return { width: 2, height: 0.5 };
      case "Bowling Scorecard":
        return { width: 2, height: 0.5 };
      default:
        return { width: 2, height: 2 };
    }
  };
  const { width, height } = getWidthAndHeight(title);
  console.log(!!pos, pos);
  return (
    <PositionContext.Provider value={pos}>
      <mesh position={!!pos ? [pos.x, pos.y, pos.z] : [0, 1, -2]} ref={meshRef}>
        {title === `Runs per over` ||
        title === `Scorecard comparison` ||
        title === `Field positions` ||
        title === `Video` ||
        title === `Wagonwheel` ? (
          component
        ) : (
          <Html width={width} height={height}>
            {component}
          </Html>
        )}
      </mesh>
    </PositionContext.Provider>
  );
};
export default WithXRPlane;
