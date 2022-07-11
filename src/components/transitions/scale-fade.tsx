import React, { FC } from "react"


interface ScaleFadeProps {
  in: boolean,
  children?: React.ReactNode
}

const ScaleFade:FC<ScaleFadeProps> = (props) => {
  return (
    <div
      className={"w-auto h-auto max-w-full max-h-full scale-fade "+(props.in ? "in" : "")}
    > { props.children } </div>
  )
};

export default ScaleFade;