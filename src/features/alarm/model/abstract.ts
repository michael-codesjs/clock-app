import React, { ReactNode } from "react";
import { BoxModel } from "@chakra-ui/utils";
import { InterfaceAlarm } from "../../../types/interfaces";
import { NullSnoozeSettings, SnoozeSettings } from "./snooze-settings";
import { AlarmViewProps } from "../types";


export abstract class AbstractAlarm implements InterfaceAlarm {

  // alarm properties
  name: string;
  defaultName: string;
  enabled: boolean;
  created: Date;
  days: Array<number>;
  time: { hour: number, minute: number };
  snooze: SnoozeSettings | NullSnoozeSettings;
  onceOff: boolean;
  isNull: boolean;
  index: number;

  // static
  private static count = 0;

  constructor({ name, enabled, created, days, time, snooze, onceOff, isNull }: InterfaceAlarm & { isNull: boolean }) {

    this.name = name;
    this.index = AbstractAlarm.count++;
    this.defaultName = "Alarm "+this.index;
    this.enabled = enabled;
    this.created = created || new Date();
    this.days = days;
    this.time = time;
    this.snooze = snooze ? new SnoozeSettings(snooze) : new NullSnoozeSettings();
    this.onceOff = onceOff;
    this.isNull = isNull;
  }

  /* ABSTRACT METHODS */

  abstract startAlarmCycle(): any
  abstract mutateSelfTo(alarms:Array<AbstractAlarm>) : Array<AbstractAlarm>
  abstract getView(props:AlarmViewProps) : ReactNode

  /* DEFINITE METHODS */

  // deletes itself from an array of alarms if it exists in that array
  deleteSelfFrom(alarms:(Array<AbstractAlarm>)) {
    const that = this;
    return alarms.filter((alarm) => alarm.created !== that.created);
  }


  // mutates a supplied instance Date time to that of the alarm and then returns it. 
  setTimeOfDateToTimeOfAlarm(date = new Date()) {
    date.setHours(this.time.hour);
    date.setMinutes(this.time.minute);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  // returns an instance of Date, whose properties(date,hours,minutes) are set to the exact next time this alarm will ring.
  get nextRingDate() {

    const date = new Date();

    if (this.days.length) {
      // days is an empty array and thus we conclude this alarm is only going to sound tomorrow and when it does, we will disable it.
      date.setDate(date.getDate() + 1);
    } else {
      // find a day that is today of after today, at the very least, get the first day in our days array.
      let day = this.days.find(day => day >= date.getDay()) || this.days[0];
      this.setTimeOfDateToTimeOfAlarm(date);
      if (date.valueOf() < new Date().valueOf()) {
        // alarm is today alright, but it already fired :(
        const indexOfDay = this.days.indexOf(day);
        const nextDayInLine = this.days[indexOfDay + 1] || this.days[indexOfDay - 1]; // if indexOfDay === this.days.length, get the day in this.days.
        if (nextDayInLine > -1) {
          // nextDayInLine exactly exists and is not !== date.getDay();
          date.setDate(date.getDate() + (nextDayInLine < day ? 7 - (day - nextDayInLine) : nextDayInLine));
        } else {
          // nextDayInLine is this day in days of the week but next week :)
          date.setDate(date.getDate() + 7);
        }
      }
    }

    // finally return the set the dates time and return it
    this.setTimeOfDateToTimeOfAlarm(date);
    return date;
  }



}