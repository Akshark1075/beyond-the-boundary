import React, { useEffect, useMemo, useRef, useState } from "react";
import { MeshProps, useFrame, useThree } from "@react-three/fiber";
import { Matrix4, Mesh, Vector3 } from "three";
import {
  Interactive,
  useHitTest,
  useXR,
  XRInteractionEvent,
} from "@react-three/xr";
import { Box, OrbitControls } from "@react-three/drei";

function Cube({ position }: { position?: Vector3 }) {
  const cubeRef = useRef<Mesh>(null);

  return (
    <mesh position={position} ref={cubeRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={"blue"} />
    </mesh>
  );
}

const Reticle = () => {
  const reticleRef = useRef<Mesh>(null!);
  const [models, setModels] = useState<Array<{ [key: string]: any }>>([]);
  const { isPresenting } = useXR();

  useHitTest((hitMatrix) => {
    handleHitTest(hitMatrix);
  });
  const handleHitTest = (hitMatrix: Matrix4) => {
    if (reticleRef.current) {
      hitMatrix.decompose(
        reticleRef.current.position,
        reticleRef.current.quaternion,
        reticleRef.current.scale
      );
      reticleRef.current.rotation.set(-Math.PI / 2, 0, 0);
    }
  };

  const placeModel = (e: XRInteractionEvent) => {
    let position = e.intersection?.object.position.clone();
    let id = Date.now();

    setModels([{ position, id }]);
  };

  return (
    <>
      <OrbitControls />
      <ambientLight />

      {isPresenting ? (
        <>
          {models.map(({ position, id }) => (
            <Cube key={id} position={position} />
          ))}
          <Interactive onSelect={placeModel}>
            <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
              <ringGeometry args={[0.1, 0.25, 32]} />
              <meshStandardMaterial color={"white"} />
            </mesh>
          </Interactive>
        </>
      ) : (
        <Cube />
      )}
    </>
  );
};
export { Cube, Reticle };
