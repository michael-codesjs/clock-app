import { useDrag, UserDragConfig, UserGestureConfig } from "@use-gesture/react";
import React, { Children, useMemo, useState } from "react"
import { useSpring, animated } from "react-spring";
import Toggle from "../../components/buttons/toggle";
import SelectedDays from "../../components/days-input/selected";
import { getNextRing } from "../../constants/functions"
import { Alarm as IAlarm } from "../../types/interfaces"


interface AlarmProps {
  alarm: IAlarm
}

export default function Alarm({ alarm }: AlarmProps) {

  const enabled = useState(alarm.enabled);
  const nextRing = useMemo(() => getNextRing(alarm.days, alarm.ringTimes), [alarm]);

  const maxDrag = 50; // maximum number of pixels the alarm view can be dragged.

  const [{ x, scale }, springAPI] = useSpring(() => ({ x: 0, scale: 1, zIndex: 0 }));

  // Set the drag hook and define component movement based on gesture data
  const dragOptions:UserDragConfig = {
    axis: "x",
    bounds: {
      left: 0, right: 100
    },
    from: () => [x.get(), 0],
    pointer: {
      touch: true,
    }
  }
  const bindDrag = useDrag(({ down, tap, movement: [mx] }) => {
    const currentX = x.get();
    springAPI.start({ x: down ? mx: 0, scale: down ? 1.05 : 1, immediate: down });
  },dragOptions);


  const opacity = x.to({
    map: Math.abs,
    range: [0, maxDrag],
    output: [0, maxDrag],
    extrapolate: 'clamp',
  });

  const width = x.to({
    map: Math.abs,
    range: [0, maxDrag],
    output: [0, maxDrag - ((1 / 5) * maxDrag)],
    extrapolate: 'clamp',
  });

  const fontWeight = x.to({
    map: Math.abs,
    range: [0, maxDrag],
    output: [300, 600],
    extrapolate: 'clamp',
  });

  return (
    <animated.div
      className="flex items-center w-full overflow-x-scroll overflow-visible"
    >

      <animated.button
        style={{ width, opacity, fontWeight, color: "gray", textAlign: "center" }}
        className={"text-[13px]"}
      > delete </animated.button>

      <animated.div
        className="w-full z-10 p-5 flex space-x-5 items-center shadow-sm rounded-xl bg-white"
        style={{ x, scale }}
        {...bindDrag()}
      >

        <p className="font-medium w-full text-2xl text-gray-800 tracking-wider">
          {nextRing.toLocaleTimeString("en", { hour: "2-digit", hour12: false, minute: "2-digit" })}
        </p>

        <SelectedDays days={alarm.days} />

        <div className={"px-2"} children={""}  />

        <div> <Toggle state={enabled} /> </div>

      </animated.div>

    </animated.div>
  )
}