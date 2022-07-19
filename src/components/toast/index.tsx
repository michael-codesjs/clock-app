import React, { useEffect, useRef, useState } from "react"
import { useRecoilValue } from "recoil"
import { scaleAnimationsDuration } from "../../utilities/constants";
import { incomingToastAtom } from "../../recoil/atoms"
import { ToastInstance } from "../../types/interfaces";
import Instance from "./instance";

export default function Toast() {

  const incomingToast = useRecoilValue(incomingToastAtom);
  const [toasts, setToasts] = useState<Array<ToastInstance>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // render a new toast whenever the toast state changes;
  useEffect(() => {
    if (!incomingToast) return;
    let toast: ToastInstance = { ...incomingToast, created: new Date().valueOf() };
    setToasts(toasts => [...toasts, toast]);
  }, [incomingToast]);

  useEffect(() => {
    if(containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  },[toasts]);

  return (
    <div ref={containerRef} className="flex justify-center items-center flex-col space-y-5 w-screen min-w-screen overflow-visible fixed bottom-8">
      {toasts.map((toast) => <Instance key={toast.created} toast={toast} state={[toasts, setToasts]} />)}
    </div>
  )
}