import { RefObject, useEffect, useMemo } from "react";

import cache from "./cache";
import { GestureEvent } from "./types";
import Session from "./Session";

interface CommonOptions {
  ref?: RefObject<HTMLElement> | HTMLElement;
}

export default function createGesture<GestureDefaults>(
  fn: (event: GestureEvent) => boolean,
  defaults?: Required<GestureDefaults>
) {
  type Options = CommonOptions & GestureDefaults;

  return (
    callback: () => void,
    { ref = document.body, ...options }: Options
  ) => {
    const config = useMemo(() => ({ ...defaults, ...options }), [options]);

    useEffect(() => {
      console.log(config);
      const node = (ref as React.MutableRefObject<HTMLElement>).current || ref;

      let session = cache.find((item) => item.isNode(node));

      if (!session) {
        session = new Session(node);

        cache.push(session);
      }

      return session.subscribe((event) => {
        if (fn(event)) {
          callback();
        }
      });
    }, [callback, config, ref]);
  };
}
