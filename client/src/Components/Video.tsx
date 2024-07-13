import "../styles/ShowPage.css";
import { DraggableEvent } from "react-draggable";
import WithTitleBar from "../Components/TitleBar";
import React, { useState } from "react";
import { Rnd, RndResizeCallback } from "react-rnd";
const Video = () => {
  const videoUrl = "https://www.youtube.com/embed/4TLHORImdL4";
  const componentRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(853);
  const [height, setHeight] = useState(480);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleResize: RndResizeCallback = (
    e,
    direction,
    ref,
    delta,
    position
  ) => {
    if (ref && ref.style) {
      const newWidth = parseInt(ref.style.width, 10);
      const newHeight = parseInt(ref.style.height, 10);
      setWidth(newWidth);
      setHeight(newHeight);
    }
  };

  const handleDragStop = (e: DraggableEvent, d: { x: number; y: number }) => {
    setPosition({ x: d.x, y: d.y });
  };
  return (
    <Rnd
      size={{ width: width, height: height }}
      position={position}
      onResize={handleResize}
      onDragStop={handleDragStop}
      minWidth={500}
      minHeight={300}
      bounds="window"
    >
      <div>
        <WithTitleBar
          title="Live"
          width={componentRef.current?.getBoundingClientRect().width ?? width}
          height={
            componentRef.current?.getBoundingClientRect().height ?? height
          }
        >
          <div className="video-responsive" ref={componentRef}>
            <iframe
              width={width}
              height={height}
              src={videoUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded YouTube Video"
            />
          </div>
        </WithTitleBar>
      </div>
    </Rnd>
  );
};
export default Video;
