
import React from "react";
import { paths } from "../../constants";
import NavigationLink from "./item";

export default function Navigation():React.ReactElement {
  return (
    <div className="flex items-center justify-between space-x-4 w-full p-5">
      {Object.entries(paths).map(([name, address]) => <NavigationLink key={name} name={name} address={address}/>)}
    </div>
  )
}