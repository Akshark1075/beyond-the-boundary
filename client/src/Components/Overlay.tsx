import { forwardRef, LegacyRef } from "react";
import FloatingActionButton from "./FloatingActionButton";
import { SelectedOption } from "../views/ShowPage";
import { usePinch } from "../utilities/touch";
const Interface = forwardRef(
  (
    props: {
      selections: SelectedOption[];
      setSelection: (options: SelectedOption[]) => void;
      setShouldShowReticle: (shouldShowReticle: boolean) => void;
      setSelectedARComponent: (component: string) => void;
    },
    ref
  ) => {
    const handle = () => {
      alert("fo");
    }; // @ts-ignore: Unreachable code error
    usePinch(handle, { ref });

    return (
      <div id="overlay-content" ref={ref as LegacyRef<HTMLDivElement>}>
        <div className="dom-container">
          <FloatingActionButton
            selections={props.selections}
            setSelection={props.setSelection}
            isARMode={true}
            setShouldShowReticle={props.setShouldShowReticle}
            setSelectedARComponent={props.setSelectedARComponent}
          />
        </div>
      </div>
    );
  }
);

export default Interface;
