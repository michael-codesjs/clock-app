
import { ScaleFade } from "@chakra-ui/react";
import React, { useEffect } from "react"
import { animated, useSpring } from "react-spring"
import { AlarmViewProps } from "../types";

export const AlarmViewWrapper: React.FC<AlarmViewProps & { children: React.ReactNode }> = ({ children, positionInSortedList, containerDimensions }) => {

  const [styles, springAPI] = useSpring(() => { y: 0 });

  const wrapperHeight = 88;

  useEffect(() => {
    springAPI.start({ y: positionInSortedList * wrapperHeight })
  }, [positionInSortedList]);

  return (
    <animated.div
      style={{
        ...styles,
        position: "absolute",
        height: wrapperHeight,
        overflow: "hidden",
        width: containerDimensions ? containerDimensions.contentBox.width : 0
      }}
    >
      {children}
    </animated.div>
  )
}