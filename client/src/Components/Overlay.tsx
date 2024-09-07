import { forwardRef, LegacyRef, useState } from "react";
import FloatingActionButton from "./FloatingActionButton";
import { SelectedOption } from "../views/ShowPage";
import { usePinch, useTap, useSwipe } from "../utilities/touch";
import { useGesture } from "@use-gesture/react";
import * as THREE from "three";

const Interface = forwardRef(
  (
    props: {
      selections: SelectedOption[];
      setSelection: (options: SelectedOption[]) => void;
      setShouldShowReticle: (shouldShowReticle: boolean) => void;
      setSelectedARComponent: (component: string) => void;

      scene: THREE.Scene | null;
      camera: THREE.Camera | null;
    },
    ref
  ) => {
    const [intersectedObj, setIntersectedObj] = useState<string | null>(null);
    // @ts-ignore: Unreachable code error
    // useTap(props.handlePinch, { ref });
    const bind = useGesture({
      // onDrag: () => alert("p"),
      // onPinch: () => alert("j"),
    });
    const raycaster = new THREE.Raycaster();
    const handleRayCast = (event: { clientX: number; clientY: number }) => {
      if (props.scene && props.camera) {
        const mouse = new THREE.Vector2();
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the raycaster with the camera and mouse position
        raycaster.setFromCamera(mouse, props.camera);

        // Calculate objects intersecting the ray
        const intersects = raycaster.intersectObjects(
          props.scene.children,
          true
        );

        if (intersects.length > 0) {
          // Handle the first intersected object
          const intersectedObject = intersects[0].object;
          console.log("Intersected object:", intersectedObject.name);
          setIntersectedObj(intersectedObj);
          // You can perform actions based on the intersected object here
        }
      }
    };
    const handlePinch = () => {
      const getAllMeshes = (scene: THREE.Scene) => {
        const meshes: THREE.Mesh[] = [];
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            meshes.push(object);
          }
        });
        return meshes;
      };
      // Usage
      if (props.scene && intersectedObj) {
        const allMeshes = getAllMeshes(props.scene);
        console.log("mesh", allMeshes);
        const foundObj = allMeshes.find((obj) => obj.name === intersectedObj);
        if (foundObj) foundObj.scale.set(2, 2, 2);
      }
    };
    return (
      <div
        id="overlay-content"
        ref={ref as LegacyRef<HTMLDivElement>}
        onClick={handleRayCast}
        // {...bind()}
        style={{
          width: "100%",
          height: "100%",
          zIndex: 390003003,
        }}
      >
        <div className="dom-container">
          {/* <FloatingActionButton
            selections={props.selections}
            setSelection={props.setSelection}
            isARMode={true}
            setShouldShowReticle={props.setShouldShowReticle}
            setSelectedARComponent={props.setSelectedARComponent}
          /> */}
        </div>
      </div>
    );
  }
);

export default Interface;
