import { Canvas } from "@react-three/fiber";
import { ARButton, XR, Controllers, Hands } from "@react-three/xr";
import { useRef, useState, useEffect } from "react";
import { usePinch } from "../utilities/touch";
const XRCube = () => {
  const ref = useRef<HTMLDivElement>(null);
  const handle = () => {
    alert("fo");
  };
  const [overlayContent, setOverlayContent] = useState<HTMLDivElement | null>(
    null
  );
  // @ts-ignore: Unreachable code error
  usePinch(handle, { ref });
  useEffect(() => {
    if (ref.current !== null) {
      setOverlayContent(ref.current);
    }
  }, []);

  return (
    <>
      <div id="overlay" className="overlay" ref={ref} />
      <ARButton
        sessionInit={{
          requiredFeatures: ["hit-test", "dom-overlay"],

          domOverlay: !!overlayContent
            ? {
                root: overlayContent as HTMLElement,
              }
            : undefined,
        }}
      />

      <Canvas>
        <XR>
          <Controllers />
          <Hands />
          <axesHelper />
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={"blue"} />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
};
export default XRCube;
