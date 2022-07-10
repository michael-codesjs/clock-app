import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavigationItemProps {
  name: string,
  address: string
}


export default function NavigationItem({ name, address }: NavigationItemProps): React.ReactElement {

  const { pathname } = useLocation();
  const isActive = pathname.indexOf(address) > -1;

  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      <Link
        to={address}
        className={"text-xs capitalize transition-[font-weight] " + (isActive ? "font-bold text-gray-700" : "font-normal text-gray-500")}
      > {name} </Link>
      <div className={"h-[3px] rounded-sm transition-[width] bg-gray-700 " + (isActive ? "w-full" : "w-0")} />
    </div>
  )
}