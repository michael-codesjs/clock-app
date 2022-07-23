import { AbstractAlarm } from "./abstract";
import { Alarm } from "./alarm";
import { NullAlarmView } from "../views/null-alarm";
import React from "react";
import { AlarmViewProps } from "../types";

export class NullAlarm extends AbstractAlarm {

  // alarm properties
  isNull: boolean
  timeout: number

  constructor() {
    super({
      name: "",
      enabled: false,
      created: new Date(),
      days: [],
      time: { hour: 0, minute: 0 },
      snooze: null,
      onceOff: true,
      isNull: false
    });
    this.timeout = 0;
    this.isNull = true;
  }

  mutateSelfTo(alarms: Array<AbstractAlarm>): Array<AbstractAlarm> {
    const self = this;
    return alarms;
  }

  startAlarmCycle() {
    const timeDifference = this.nextRingDate.valueOf() - new Date().valueOf();
    this.timeout = window.setTimeout(this.ring, timeDifference);
  }

  ring() {
    alert(`${this.name} ringing`);
  }

  getView(props: AlarmViewProps): React.ReactNode {
    return <NullAlarmView alarm={this} {...props} />
  }

}