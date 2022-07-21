import { InterfaceAlarm } from "../../types/interfaces";
import { AbstractAlarm } from "./abstract";
import { SnoozeSettings, NullSnoozeSettings } from "./snooze-settings";

export class Alarm extends AbstractAlarm {

  timeout: number
  isNull: boolean

  constructor(options: InterfaceAlarm) {

    super(options);

    this.timeout = 0;
    this.isNull = false;

    this.startAlarmCycle();

  }

  /* METHODS */

  mutateSelfTo(alarms: Alarm[]): Alarm[] {
    return alarms;
  }

  startAlarmCycle() {
    const timeDifference = this.nextRingDate.valueOf() - new Date().valueOf();
    this.timeout = window.setTimeout(this.ring, timeDifference);
  }

  ring() {
    alert(`${this.name} ringing`);
  }



}


export class NullAlarm extends AbstractAlarm {

  // alarm properties
  isNull: boolean
  timeout: number

  constructor() {
    super({
      name: "Default Alarm",
      enabled: false,
      created: new Date(),
      days: [],
      time: { hour: 0, minute: 0 },
      snooze: new NullSnoozeSettings(),
      onceOff: true,
    });
    this.timeout = 0;
    this.isNull = true;
  }

  mutateSelfTo(alarms: (NullAlarm | Alarm)[]): (NullAlarm | Alarm)[] {
    const self = this;
    return alarms.map(alarm => {
      // add non null version of self to array.
      return alarm === self ? new Alarm(self) : alarm;
    })
  }

  startAlarmCycle() {
    const timeDifference = this.nextRingDate.valueOf() - new Date().valueOf();
    this.timeout = window.setTimeout(this.ring, timeDifference);
  }

  ring() {
    alert(`${this.name} ringing`);
  }


}