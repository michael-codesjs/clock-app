import { ToastInstance } from "../../types/interfaces";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/solid"
import { ToastStatus } from "../../types/enums";
import ScaleFade from "../transitions/scale-fade";
import { scaleAnimationsDuration } from "../../constants";

interface ToastInstanceProps {
  toast: ToastInstance,
  state: [Array<ToastInstance>, React.Dispatch<React.SetStateAction<Array<ToastInstance>>>]
}

export default function Instance(props: ToastInstanceProps) {

  const { toast: { status = ToastStatus.info, title, duration, description, isClosable }, state } = props;

  const [toasts,setToasts] = state;
  const index = useMemo(() => toasts.length-1,[]);
  const [isOpen, setIsOpen] = useState(true);
  const timeout = useRef<number | null>(null);;

  useEffect(() => {
    if(isOpen) {
      // start timeout to drop.
      timeout.current = window.setTimeout(() => {
        isOpen && setIsOpen(false);
      }, (duration || 0)+scaleAnimationsDuration);
    } else {
      timeout.current = window.setTimeout(closeToast, scaleAnimationsDuration);
    }
    return () => {
      timeout.current && window.clearTimeout(timeout.current);
    }
  },[isOpen]);

  function closeToast() {
    timeout.current && window.clearTimeout(timeout.current)
    setToasts(toasts => {
      const newToasts = [...toasts];
      newToasts.splice(index,1);
      return newToasts;
    });
  }

  return (
    <ScaleFade
      in={isOpen}
    >
      <div className={"toast-instance "+status}>
        <InformationCircleIcon className="w-5 h-5 text-white" />
        <div className="flex flex-col space-y-1 w-full">
          <p className="text-xs font-normal text-white"> {title || description} </p>
          {title && description && <p className="text-[10px] text-gray-100"> {description} </p>}
        </div>
        {isClosable && (<button className="text-white p-0 m-0 font-black text-lg" onClick={() => setIsOpen(false)}> &times; </button>)}
      </div>
    </ScaleFade>
  )
}