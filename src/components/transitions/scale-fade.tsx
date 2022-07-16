import React, { FC, useEffect } from "react"
import { useSpring, animated } from "react-spring";


interface ScaleFadeProps {
  in: boolean,
  children?: React.ReactNode
}

const ScaleFade:FC<ScaleFadeProps> = (props) => {

  const [states, api] = useSpring(() => ({ scale: 0, zIndex: 0, opacity: 0, config: { duration: 200 } }));

  useEffect(() => {
    api.start(props.in ? { scale: 1, zIndex: 10, opacity: 1, immediate: false } : { scale: 0 });
  },[props.in]);

  return (
    <animated.div
      style={states}
      className={"w-auto h-auto max-w-full z-10 max-h-full"}
    > { props.children } </animated.div>
  )
};

export default ScaleFade;