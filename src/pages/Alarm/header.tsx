import React, { useEffect, useMemo } from "react";
import { Alarm } from "../../types/interfaces";
import { PlusIcon, DotsVerticalIcon } from '@heroicons/react/solid';
import { paths, timeBreakPoints } from "../../constants"
import { Link } from "react-router-dom";
import { getNextRing, getTimeFromNow } from "../../constants/functions";
import useForceUpdate from "../../hooks/use-force-update";

interface NextAlarmProps {
  alarm: Alarm | null
}

export default function NextAlarmDisplay({ alarm }: NextAlarmProps) {

  let nextRing = alarm && alarm.enabled && getNextRing(alarm.days, alarm.ringTimes);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (nextRing) {
      const interval = window.setInterval(forceUpdate, 60000);
      return () => window.clearInterval(interval);
    }
  }, []);

  return (
    <div className={"h-48 flex flex-col items-center justify-center"}>
      <div className="w-full h-full flex flex-col items-center justify-center">
        {
          alarm ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              {
                alarm.enabled && nextRing ? (
                  <>
                    <p className="text-xl text-center font-medium"> Alarm in {getTimeFromNow(nextRing, 2)} </p>
                    <p className="text-xs  text-gray-500"> {nextRing.toLocaleDateString("en", { hour: "2-digit", hour12: false, weekday: "long",  minute: "2-digit", day: "2-digit", month: "short" })} </p>
                  </>
                ) : (
                  <p className="text-lg"> Alarms are off </p>
                )
              }
            </div>
          ) : (
            <h1 className={"text-gray-700 text-lg tracking-wide font-medium"}> Alarm </h1>
          )
        }
      </div>
      <div className={"sticky top-0 md:top-5 w-full p-5 flex items-center"}>
        <p className="w-full" />
        <Link
          to={paths.alarm + "/add"}
          className="p-2"
        ><PlusIcon className="w-5 h-5" /></Link>
        <button className="p-2"><DotsVerticalIcon className="w-5 h-5" /></button>
      </div>
    </div>
  )

}