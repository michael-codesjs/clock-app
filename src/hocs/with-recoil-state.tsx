import React from "react";
import { RecoilState, useRecoilState } from "recoil";

export default function withRecoilState<T>(args: { Component: typeof React.Component<any,{ state: RecoilState<T> }>, state: RecoilState<T> }) {
  const { Component, state } = args;
  return () => {
    const [value, setValue] = useRecoilState(state);
    return <Component recoilState={[value,setValue]} />
  }
}