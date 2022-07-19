import { ToastInstance } from "../../types/interfaces";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/solid"
import { ToastStatus } from "../../types/enums";
import ScaleFade from "../transitions/scale-fade";
import { scaleAnimationsDuration } from "../../utilities/constants";
import { useSpring, animated } from "react-spring";

interface ToastInstanceProps {
  toast: ToastInstance,
  state: [Array<ToastInstance>, React.Dispatch<React.SetStateAction<Array<ToastInstance>>>]
}

export default function Instance(props: ToastInstanceProps) {

  const { toast: { status = ToastStatus.info, title, duration, description, isClosable }, state } = props;

  const [states, api] = useSpring(() => ({ scale: 0, opacity: 0, config: { duration: 200 } }));

  const [toasts, setToasts] = state;
  const index = useMemo(() => toasts.length - 1, []);
  // const [isOpen, setIsOpen] = useState(true);
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    api.start({
      scale: 1, opacity: 1,
      // start time out to drop toast;
      onResolve: () => {
        timeout.current = window.setTimeout(initiateDropToast, duration);
      }
    });

    return () => {
      timeout.current && window.clearTimeout(timeout.current);
    }

  }, []);

  function initiateDropToast() {
    if (timeout.current) window.clearTimeout(timeout.current);
    else return // dropToast has already been called.
    api.start({
      scale: 0, opacity: 0, immediate: false,
      // drop toasts from toastsAtom when the spring animation is resolved
      onResolve: dropToast
    });
  }

  function dropToast() {
    setToasts(toasts => {
      const newToasts = [...toasts];
      newToasts.splice(index, 1);
      return newToasts;
    });
  }

  return (
    <animated.div
      style={states}
      className={"toast-instance " + status}>
      <InformationCircleIcon className="w-5 h-5 text-white" />
      <div className="flex flex-col space-y-1 w-full">
        <p className="text-xs font-normal text-white"> {title || description} </p>
        {title && description && <p className="text-[10px] text-gray-100"> {description} </p>}
      </div>
      {isClosable && (<button className="text-white p-0 m-0 font-black text-lg" onClick={initiateDropToast}> &times; </button>)}
    </animated.div>
  )
}