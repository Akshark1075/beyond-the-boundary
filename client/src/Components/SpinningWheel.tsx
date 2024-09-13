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
  const [_, setIdleTimer] = useState<NodeJS.Timeout | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const angleStep = 360 / components.length;
  const handleVisibility = () => {
    resetIdleTimer();
    setVisible((prevVisible) => {
      if (!prevVisible) {
        startIdleTimer();
      }

      return !prevVisible;
    });
  };
  const resetIdleTimer = () => {
    setIdleTimer((prevTimer) => {
      if (prevTimer) {
        clearTimeout(prevTimer);
      }
      return null;
    });
  };
  const startIdleTimer = () => {
    setIdleTimer(
      setTimeout(() => {
        resetIdleTimer();
        setVisible(false);
      }, 5000)
    );
  };

  // useEffect(() => {
  //   document.addEventListener("click", handleVisibility);
  //   document.addEventListener("mousedown", resetIdleTimer);
  //   return () => {
  //     document.removeEventListener("click", resetIdleTimer);
  //     document.addEventListener("mousedown", resetIdleTimer);
  //   };
  // }, []);

  // const handleMouseDown = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   const startY = e.clientY;
  //   const startRotation = rotation;

  //   const handleMouseMove = (e: MouseEvent) => {
  //     const deltaY = e.clientY - startY;
  //     const newRotation = startRotation + deltaY / 2;
  //     setRotation(newRotation);
  //     updateCurrentIndex(newRotation);
  //   };

  //   const handleMouseUp = () => {
  //     document.removeEventListener("mousemove", handleMouseMove);
  //     document.removeEventListener("mouseup", handleMouseUp);
  //   };

  //   document.addEventListener("mousemove", handleMouseMove);
  //   document.addEventListener("mouseup", handleMouseUp);
  // };

  //uncomment below
  useEffect(() => {
    document.addEventListener("click", handleVisibility);
    document.addEventListener("mousedown", resetIdleTimer);
    document.addEventListener("touchstart", resetIdleTimer); // Add touchstart event for mobile devices
    return () => {
      document.removeEventListener("click", handleVisibility);
      document.removeEventListener("mousedown", resetIdleTimer);
      document.removeEventListener("touchstart", resetIdleTimer); // Clean up touchstart event
    };
  }, []);

  const handleInteractionStart = (startEvent: MouseEvent | TouchEvent) => {
    startEvent.preventDefault();
    startEvent.stopPropagation();

    const isTouchEvent = startEvent.type === "touchstart";
    const startY = isTouchEvent
      ? (startEvent as TouchEvent).touches[0].clientY
      : (startEvent as MouseEvent).clientY;
    const startRotation = rotation;

    const handleInteractionMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveY = isTouchEvent
        ? (moveEvent as TouchEvent).touches[0].clientY
        : (moveEvent as MouseEvent).clientY;
      const deltaY = moveY - startY;
      const newRotation = startRotation + deltaY / 2;
      setRotation(newRotation);
      updateCurrentIndex(newRotation);
    };

    const handleInteractionEnd = () => {
      document.removeEventListener("mousemove", handleInteractionMove);
      document.removeEventListener("mouseup", handleInteractionEnd);
      document.removeEventListener("touchmove", handleInteractionMove); // Clean up touchmove event
      document.removeEventListener("touchend", handleInteractionEnd); // Clean up touchend event
    };

    document.addEventListener("mousemove", handleInteractionMove);
    document.addEventListener("mouseup", handleInteractionEnd);
    document.addEventListener("touchmove", handleInteractionMove); // Add touchmove event for mobile devices
    document.addEventListener("touchend", handleInteractionEnd); // Add touchend event for mobile devices
  };
  // @ts-ignore: Unreachable code error
  const handleMouseDown = (event) => handleInteractionStart(event);
  // @ts-ignore: Unreachable code error
  const handleTouchStart = (event) => handleInteractionStart(event);

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
      {components[components.length - currentIndex - 1].component}
      {visible && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div id="wrapper" ref={wheelRef}>
            <div
              id="wheel"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div id="inner-wheel">
                {components.map((component, index) => (
                  <div key={index} className="sec">
                    <span className="fa">{components[index].title}</span>
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
      )}
    </>
  );
};

export default SpinningWheel;
