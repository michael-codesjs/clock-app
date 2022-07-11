import React, { useMemo } from "react"
import { useRecoilValue } from "recoil"
import ScaleFade from "../../components/transitions/scale-fade";
import { getNextRing } from "../../constants/functions";
import { alarmsAtom } from "../../recoil/atoms"
import Alarm from "./alarm";
import Header from "./header";

export default function Alarms() {

  const alarms = useRecoilValue(alarmsAtom);

  const nextAlarm = useMemo(() => {
    // get the next alarm to sound
    if (!alarms.length) return null;
    let nextAlarm = alarms[0];
    alarms.forEach((alarm, i) => {
      const alarmAfterCurrent = alarms[i + 1];
      if (!alarmAfterCurrent) return;
      const ring = getNextRing(nextAlarm.days, nextAlarm.ringTimes);
      const afterCurrentRingTime = getNextRing(alarmAfterCurrent.days, alarmAfterCurrent.ringTimes);
      if (ring.valueOf() > afterCurrentRingTime.valueOf() && alarmAfterCurrent.enabled) {
        nextAlarm = alarmAfterCurrent;
      }
    });
    return nextAlarm;
  }, [alarms]);

  return (
    <div className="h-full w-full flex flex-col space-y-2">
      <Header alarm={nextAlarm} />
      <div className="flex flex-col flex-1 overflow-scroll space-y-5">
        {
          alarms.map(alarm => {
            return (
              <Alarm key={alarm.created.valueOf()} alarm={alarm} />
            )
          })
        }
      </div>
    </div>
  )

}