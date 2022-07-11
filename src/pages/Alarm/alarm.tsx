import { useDrag, useGesture } from "@use-gesture/react";
import React, { FC, useMemo, useState } from "react"
import { useSpring, animated } from "react-spring";
import Toggle from "../../components/buttons/toggle";
import SelectedDays from "../../components/days-input/selected";
import { getNextRing } from "../../constants/functions"
import { Alarm as IAlarm } from "../../types/interfaces"


interface AlarmProps {
  alarm: IAlarm
}

export default function Alarm({ alarm } : AlarmProps) {

  const enabled = useState(alarm.enabled);
  const nextRing = useMemo(() => getNextRing(alarm.days, alarm.ringTimes),[alarm]);

  const [{ x }, api] = useSpring(() => ({ x: 0, y: 0 }))

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement: [mx] }) => {
    console.log(mx)
    api.start({ x: down ? mx : 0, immediate: down });
  })

  return (
    <animated.div {...bind()} style={{ x }} className="flex space-x-4 shadow-sm px-8 py-5 items-center rounded-xl bg-white">
      <p className="font-medium w-full text-2xl text-gray-800 tracking-wider">
        { nextRing.toLocaleTimeString("en", { hour: "2-digit", hour12: false, minute: "2-digit" }) } 
      </p>
      <SelectedDays days={alarm.days} />
      <div> <Toggle state={enabled} /> </div>
    </animated.div>
  )
}