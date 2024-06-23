import { useRef, useEffect } from "react";
import { GestureType, Interval, InputType } from "../utils/types";
import useGestureEvent, { GestureOptions } from "../utils/useGestureEvent";

interface HoldOptions {
  pointers?: number;
  threshold?: number;
  time?: number;
}

type Options = GestureOptions & HoldOptions;

export interface HoldGesture extends Interval {
  type: GestureType.Hold;
}

export default function useHold(
  callback: (event: HoldGesture) => void,
  { ref, pointers = 1, threshold = 10, time = 250 }: Options
) {
  const timer = useRef<number>();

  useEffect(() => () => clearTimeout(timer.current), []);

  useGestureEvent(
    (event) => {
      clearTimeout(timer.current);

      if (
        event.type & (InputType.Start | InputType.Move) &&
        event.pointers.length === pointers &&
        event.distance < threshold &&
        event.delta.time < time
      ) {
        // @ts-ignore: Unreachable code error
        timer.current = setTimeout(() => {
          callback({ ...event, type: GestureType.Hold });
        }, time);
      }
    },
    { ref }
  );
}
