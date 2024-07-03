import { GestureType, Interval, InputType } from '../utils/types';
import useGestureEvent, { GestureOptions } from '../utils/useGestureEvent';

interface PinchOptions {
  pointers?: number;
  threshold?: number;
}

type Options = GestureOptions & PinchOptions;

export interface PinchGesture extends Interval {
  type: GestureType.Pinch;
}

export default function usePinch<PinchOptions>(
  callback: (event: any) => void,
  { ref, pointers = 2, threshold = 10 }: Options
) {
  useGestureEvent(
    event => {
      if (pointers < 2) {
        console.error(
          'You need at least 2 points are required to match a pinch.'
        );
        pointers = 2;
      }

      if (event.type & InputType.Move && event.pointers.length === pointers) {
        // TODO: Calculate pinch
        console.log('pinch', event);
        callback({ ...event, type: GestureType.Pinch });
      }
    },
    { ref }
  );
}
