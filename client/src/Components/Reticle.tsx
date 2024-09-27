import { useRef, useState } from "react";
import { Mesh, Matrix4, Vector3, Group, Quaternion } from "three";
import { Interactive, useHitTest, XRInteractionEvent } from "@react-three/xr";
import { Text } from "@react-three/drei";

const Reticle = ({
  placeModel,
  component,
  title,
}: {
  component: JSX.Element;
  title: string;
  placeModel: (
    e: XRInteractionEvent,
    component: JSX.Element,
    title: string
  ) => void;
}) => {
  const reticleRef = useRef<Mesh>(null);
  const [textPosition, setTextPosition] = useState<[number, number, number]>([
    0, 0, 0,
  ]);

  useHitTest((hitMatrix: Matrix4) => {
    if (reticleRef.current) {
      const position = new Vector3();
      const quaternion = new Quaternion();
      const scale = new Vector3();
      hitMatrix.decompose(position, quaternion, scale);
      reticleRef.current.position.copy(position);
      reticleRef.current.rotation.set(-Math.PI / 2, 0, 0);

      // Update the state with the new position as an array
      setTextPosition([position.x, position.y - 0.3, position.z]);
    }
  });

  const handleSelect = (e: XRInteractionEvent) => {
    placeModel(e, component, title);
  };

  return (
    <>
      <ambientLight />

      <Interactive onSelect={handleSelect}>
        <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.1, 0.25, 32]} />
          <meshStandardMaterial color={"white"} />
        </mesh>
        {/* Dynamically positioned text using position prop */}( )
      </Interactive>
      <Text
        renderOrder={2}
        rotation-x={-Math.PI / 2}
        position={
          reticleRef.current
            ? [
                reticleRef.current.position.x,
                reticleRef.current.position.y,
                reticleRef.current.position.z,
              ]
            : undefined
        } // Dynamic position
        fontSize={0.05}
        color="#E50914"
        anchorX="center"
        anchorY="middle"
      >
        Click to Place
      </Text>
    </>
  );
};

export { Reticle };
