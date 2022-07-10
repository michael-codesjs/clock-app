import React, { FC, useMemo, useState } from "react"
import Toggle from "../../components/buttons/toggle";
import SelectedDays from "../../components/days-input/selected";
import { getNextRing } from "../../constants/functions"
import { Alarm as IAlarm } from "../../types/interfaces"


interface AlarmProps {
  alarm: IAlarm
}

export default function Alarm({ alarm } : AlarmProps) {

  const enabled = useState(alarm.enabled);
  const nextRing = useMemo(() => getNextRing(alarm.days, alarm.ringTimes),[alarm]);

  return (
    <div className="flex space-x-4 shadow-xs px-8 py-5 items-center rounded-2xl bg-white">
      <p className="font-medium w-full text-2xl text-gray-800 tracking-wider">
        { nextRing.toLocaleTimeString("en", { hour: "2-digit", hour12: false, minute: "2-digit" }) } 
      </p>
      <SelectedDays days={alarm.days} />
      <div> <Toggle state={enabled} /> </div>
    </div>
  )
}