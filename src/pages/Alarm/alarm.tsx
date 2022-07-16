import { useDrag, UserDragConfig, UserGestureConfig } from "@use-gesture/react";
import React, { Children, useMemo, useState } from "react"
import { useSpring, animated } from "react-spring";
import { useSetRecoilState } from "recoil";
import Toggle from "../../components/buttons/toggle";
import SelectedDays from "../../components/days-input/selected";
import { getNextRing } from "../../constants/functions"
import { alarmsAtom } from "../../recoil/atoms";
import { Alarm as IAlarm } from "../../types/interfaces"


interface AlarmProps {
  alarm: IAlarm
}

export default function Alarm({ alarm }: AlarmProps) {

  const setAlarms = useSetRecoilState(alarmsAtom);

  const enabled = useState(alarm.enabled);
  const nextRing = useMemo(() => getNextRing(alarm.days, alarm.ringTimes), [alarm]);

  const maxDrag = 100; // maximum number of pixels the alarm view can be dragged.

  const [containerSpringStates, containerSpringAPI] = useSpring(() => {
    return {
      x: 0, y: 0, scale: 1, opacity: 1,
      height: 100, paddingBottom: 20,
      // text opacity
      deleteTextOpacity: 1,
    }
  })

  const [contentSpringStates, contentSpringAPI] = useSpring(() => {
    return {
      x: 0, y: 0, opacity: 1, scale: 1,
    }
  });

  const dragOptions: UserDragConfig = {
    axis: "x",
    bounds: {
      left: 0, right: maxDrag
    },
    rubberband: 5,
    from: () => [contentSpringStates.x.get(), 0],
    pointer: {
      touch: true,
    },
  }

  const bindDrag = useDrag((state) => {
    const { down, offset: [mx], last } = state;
    if (last && mx > (maxDrag / 1.3)) return initiateDeleteAlarmAnimation();
    contentSpringAPI.start({ x: down ? mx : 0, scale: down ? 1.05 : 1, immediate: false });
  }, dragOptions);

  function initiateDeleteAlarmAnimation() {
    containerSpringAPI.set({ deleteTextOpacity: 0 });
    containerSpringAPI.start({
      x: 200, scale: 0, opacity: 0,
      // when this is resolved, trigger another animation that reduces the height.
      onResolve: () => {
        containerSpringAPI.start({
          height: 0, paddingBottom: 0,
          // when this last spring animation is done, delete the alarm from the alarmsAtom;
          onResolve: deleteAlarm
        })
      }
    });
  }

  function deleteAlarm() {
    setAlarms(alarms => {
      // alarm.created acts as id.
      return alarms.filter(thatAlarm => thatAlarm.created !== alarm.created);
    })
  }

  /* const opacity = x.to({
     map: Math.abs,
     range: [0, maxDrag],
     output: [0, maxDrag],
     extrapolate: 'clamp',
   });
 
   */

  const width = contentSpringStates.x.to({
    map: Math.abs,
    range: [0, maxDrag],
    output: [0, maxDrag - ((1 / 5) * maxDrag)],
    extrapolate: 'clamp',
  });

  const fontWeight = contentSpringStates.x.to({
    map: Math.abs,
    range: [0, maxDrag],
    output: [100, 900],
    extrapolate: 'clamp',
  });

  // console.log(width);

  return (
    <animated.div
      className="flex items-center w-full min-h-fit cursor-grab"
      style={containerSpringStates}
      {...bindDrag()}
    >

      <animated.button
        style={{ width, fontWeight, opacity: containerSpringStates.deleteTextOpacity, color: "red", textAlign: "center" }}
        className={"text-xs"}
      > delete </animated.button>

      <animated.div
        className="w-full h-full z-10 p-5 flex space-x-5 items-center shadow-sm rounded-xl bg-white"
        style={contentSpringStates}
      >

        <p className="font-medium w-full text-2xl text-gray-800 tracking-wider">
          {nextRing.toLocaleTimeString("en", { hour: "2-digit", hour12: false, minute: "2-digit" })}
        </p>

        <SelectedDays days={alarm.days} />

        <div className={"px-2"} children={""} />

        <div> <Toggle state={enabled} /> </div>

      </animated.div>

    </animated.div>
  )
}