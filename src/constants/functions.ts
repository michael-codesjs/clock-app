import { timeBreakPoints } from ".";
import { Alarm } from "../types/interfaces";


export function unStringfy<T>(jsonString: string): T {
  return JSON.parse(jsonString) as T;
}

export function getTomorrowsDate() {
  const date = new Date();
  date.setDate(date.getDate()+1);
  return date;
}

export function getTomorrowsDayInTheWeek() {
  return getTomorrowsDate().getDay();
}

export function setRingDate(date: Date, time: { date: number, hours: number, minutes: number }) {
  date.setDate(time.date);
  date.setHours(time.hours);
  date.setMinutes(time.minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

export function getNextRing(days: Array<number>, time: { hours: number, minutes: number }) {
  let date = new Date();
  if (!days.length) return setRingDate(date, { date: date.getDate()+1, ...time });
  else {
    let day = days.find(day => day >= date.getDay());
    day = day || days[0];
    const ringDate = date.getDate()+(day-date.getDay());
    setRingDate(date, { date: ringDate, ...time });
    if(date.valueOf() < new Date().valueOf()) {
      const indexOfDay = days.indexOf(day);
      const nextDayInLine = days[indexOfDay+1] || days[indexOfDay-1];
      return nextDayInLine > -1 ? setRingDate(date, { date: date.getDate()+(nextDayInLine < day ? 7-(day-nextDayInLine) : nextDayInLine), ...time }) : setRingDate(date, { date: date.getDate()+7, ...time });
    }
    else return date;
  }
}

export function getTimeFromNow(date: Date, depth = 3) {
  const now = new Date().valueOf();
  const then = date.valueOf();
  let difference = then - now;
  const point = difference < 0 ? "ago" : "from now";
  let currentDepth = 0;
  let timeFromNow = Object.entries(timeBreakPoints).map(entry => {
    const [breakPointName, breakPointValue] = entry;
    if (currentDepth === depth || difference < breakPointValue) return "";
    const differenceTimes = Math.floor(difference / breakPointValue);
    difference -= differenceTimes * breakPointValue;
    currentDepth+=1;
    return `${currentDepth > 1 ? currentDepth === depth ? " and " : ", " : ""} ${differenceTimes} ${breakPointName}${differenceTimes > 1 ? "s" : ""}`
  });
  return timeFromNow.join("") + " " + point;
}
