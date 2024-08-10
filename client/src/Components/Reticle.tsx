import { useRef } from "react";
import { Matrix4, Mesh } from "three";
import { Interactive, useHitTest, XRInteractionEvent } from "@react-three/xr";

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
  const reticleRef = useRef<Mesh>(null!);

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
  // @ts-ignore: Unreachable code error
  // usePinch(placeModel, { ref: reticleRef });
  const handleSelect = (e: XRInteractionEvent) => {
    placeModel(e, component, title);
  };
  return (
    <>
      <>
        <ambientLight />

        <Interactive onSelect={handleSelect}>
          <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.1, 0.25, 32]} />
            <meshStandardMaterial color={"white"} />
          </mesh>
        </Interactive>
      </>
    </>
  );
};
export { Reticle };
