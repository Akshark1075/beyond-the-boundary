import { forwardRef, LegacyRef } from "react";

const Interface = forwardRef((props, ref) => {
  return (
    <div id="overlay-content" ref={ref as LegacyRef<HTMLDivElement>}>
      <div className="dom-container"></div>
    </div>
  );
});

export default Interface;
