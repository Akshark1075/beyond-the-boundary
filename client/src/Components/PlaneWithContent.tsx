import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { BufferGeometry, Mesh, Vector3 } from "three";
import Html from "./HTMLOverlay";

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
  useEffect(() => {
    if (meshRef.current) {
      // Make the mesh look at the camera when it is first placed
      meshRef.current.lookAt(camera.position);
    }
  }, [camera.position]);
  return (
    <mesh
      position={!!position ? [position.x, 1, position.z] : [0, 1, -2]}
      ref={meshRef}
    >
      {title === `Runs per over` ||
      title === `Scorecard comparison` ||
      title === `Field positions` ||
      title === `Video` ? (
        component
      ) : (
        <Html width={2} height={2}>
          {component}
        </Html>
      )}
    </mesh>
  );
};

export default WithXRPlane;
