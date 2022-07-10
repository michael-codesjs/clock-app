import React from "react";

interface ToggleProps {
  state: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export default function Toggle({ state }:ToggleProps) {
  const [isOn, setIsOn] = state;
  return (
    <div
      className={"h-4 w-8 rounded-full cursor-pointer border-2 p-0 transition-all "+(isOn ? "border-purple-600 bg-purple-600" : "border-gray-300")}
      onClick={() => setIsOn(value => !value)}
    >
      <div className={"h-5 w-5 rounded-full border-2 transition-all -translate-y-[4px] " + (isOn ? "bg-white translate-x-3 border-purple-600" : "border-gray-300 -translate-x-[2px] bg-white")} />
    </div>
  )
}