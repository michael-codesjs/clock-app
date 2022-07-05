
import React from "react";
import { paths } from "../../constants";
import NavigationLink from "./item";

export default function Navigation():React.ReactElement {
  return (
    <div className="flex items-center justify-center space-x-8 w-full p-5">
      {Object.entries(paths).map(([name, address]) => <NavigationLink name={name} address={address}/>)}
    </div>
  )
}