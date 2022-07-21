import { Alarm } from "../classes/alarm";
import { timeBreakPoints } from "./constants";

export function unStringfy<T>(jsonString: string): T {
  return JSON.parse(jsonString) as T;
}


/* ARRAY FUNCTIONS */

export function filterMap<T>(array:Array<T>, condition:(item:T) => boolean) {
  const finalArray = [];
  array.forEach(item => {
    if(condition(item)) finalArray.push(item);
  })
}

/* END */


/* TIME RELATED */

export function getTomorrowsDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
}

export function getTomorrowsDayInTheWeek() {
  return getTomorrowsDate().getDay();
}

export function getTimeFromNow(date: Date, depth = 3) {
  const now = new Date().valueOf();
  const then = date.valueOf();
  let difference = then - now;
  let currentDepth = 0;
  let timeFromNow = Object.entries(timeBreakPoints).map(entry => {
    const [breakPointName, breakPointValue] = entry;
    if (currentDepth === depth || difference < breakPointValue) return "";
    const differenceTimes = Math.floor(difference / breakPointValue);
    difference -= differenceTimes * breakPointValue;
    currentDepth += 1;
    return `${currentDepth > 1 ? currentDepth === depth ? " and " : ", " : ""} ${differenceTimes} ${breakPointName}${differenceTimes > 1 ? "s" : ""}`
  });
  return timeFromNow.join("");
}

// get the next alarm to ring
export function getNextAlarmToRing(alarms: Array<Alarm>) {
  if (!alarms.length) return null;
  // start at the bottom and work your way up to the top
  let nextAlarm = alarms[0];
  alarms.forEach((alarm, index) => {
    const alarmAfterCurrent = alarms[index + 1];
    if (!alarmAfterCurrent) return;
    const currentInLoopRingDate = alarm.nextRingDate;
    const afterCurrentInLoopRingDate = alarmAfterCurrent.nextRingDate;
    if (currentInLoopRingDate.valueOf() > afterCurrentInLoopRingDate.valueOf() && alarmAfterCurrent.enabled) {
      nextAlarm = alarmAfterCurrent;
    }
  });
  return nextAlarm;
}

/* END */

