import { useRef, useEffect } from "react";

import useGestureEvent, { GestureOptions } from "../utils/useGestureEvent";
import { Interval, GestureType, InputType } from "../utils/types";

export interface TapGesture extends Interval {
  type: GestureType.Tap;
}

export type Options = GestureOptions & {
  interval?: number;
  pointers?: number;
  taps?: number;
  threshold?: number;
  time?: number;
};

export default function useTap(
  callback: (event: TapGesture) => void,
  {
    ref,
    interval = 300,
    pointers = 1,
    taps = 1,
    threshold = 2,
    time = 250,
  }: Options
) {
  const holding = useRef(false);
  const tapCount = useRef(0);
  const timer = useRef<number>();

  useEffect(() => () => clearTimeout(timer.current), []);

  useGestureEvent(
    (event) => {
      if (event.type & InputType.Start) {
        holding.current = false;
        // @ts-ignore: Unreachable code error
        timer.current = setTimeout(() => {
          holding.current = true;
        }, interval);
      } else if (
        !holding.current &&
        event.type & InputType.End &&
        event.pointers.length === pointers &&
        event.distance < threshold &&
        event.delta.time < time
      ) {
        clearTimeout(timer.current);

        tapCount.current += 1;

        if (tapCount.current === taps) {
          callback({ ...event, type: GestureType.Tap });
        }
        // @ts-ignore: Unreachable code error
        timer.current = setTimeout(() => {
          tapCount.current = 0;
        }, interval);
      }
    },
    { ref }
  );
}
