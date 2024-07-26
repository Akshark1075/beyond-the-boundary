import React, { useState, useEffect, useRef } from "react";
import "../styles/SpinningWheel.css";

interface SpinningWheelProps {
  components: {
    component: React.ReactNode;
    title: string;
  }[];
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ components }) => {
  const [visible, setVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const angleStep = 360 / components.length;
  console.log(angleStep);
  const handleVisibility = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  useEffect(() => {
    document.addEventListener("click", handleVisibility);
    return () => {
      document.removeEventListener("click", handleVisibility);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startRotation = rotation;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newRotation = startRotation + deltaY / 2;
      setRotation(newRotation);
      updateCurrentIndex(newRotation);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const updateCurrentIndex = (newRotation: number) => {
    const adjustedRotation = ((newRotation % 360) + 360) % 360;
    const newIndex = Math.floor(adjustedRotation / angleStep);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      console.log(`Selection changed to: ${components[newIndex].title}`);
    }
  };

  return (
    <>
      {visible ? (
        <div
          style={{ display: "flex", justifyContent: "center", height: "100%" }}
        >
          <div id="wrapper" ref={wheelRef}>
            <div
              id="wheel"
              onMouseDown={handleMouseDown}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div id="inner-wheel">
                {components.map((component, index) => (
                  <div key={index} className="sec">
                    <span className="fa">{component.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div id="spin">
              <div id="inner-spin"></div>
            </div>
            <div id="shine"></div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {components[components.length - currentIndex - 1].component}
    </>
  );
};

export default SpinningWheel;
