import useGestureEvent, { GestureOptions } from '../utils/useGestureEvent';
import { Direction, Interval, GestureType, InputType } from '../utils/types';

interface PanOptions {
  direction?: Direction;
  pointers?: number;
  threshold?: number;
}

type Options = GestureOptions & PanOptions;

export interface PanGesture extends Interval {
  type: GestureType.Pan;
}

export default function usePan(
  callback: (event: PanGesture) => void,
  { ref, direction = Direction.All, pointers = 1, threshold = 5 }: Options
) {
  useGestureEvent(
    event => {
      if (
        event.type & InputType.Move &&
        event.pointers.length === pointers &&
        event.direction & direction &&
        event.distance > threshold
      ) {
        callback({ ...event, type: GestureType.Pan });
      }
    },
    { ref }
  );
}
