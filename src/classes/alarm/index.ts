import { InterfaceAlarm } from "../../types/interfaces";
import { AbstractAlarm } from "./abstract";
import { SnoozeSettings, NullSnoozeSettings } from "./snooze-settings";

export class Alarm extends AbstractAlarm {

  timeout: number

  constructor(options: InterfaceAlarm) {

    super(options);
    this.timeout = 0;
    this.startAlarmCycle();

  }

  /* METHODS */

  startAlarmCycle() {
    const timeDifference = this.nextRingDate.valueOf() - new Date().valueOf();
    this.timeout = window.setTimeout(this.ring, timeDifference);
  }

  ring() {
    alert(`${this.name} ringing`);
  }



}


export class NullAlarm implements InterfaceAlarm {

  // alarm properties
  name: string;
  enabled: boolean;
  created: Date;
  days: Array<number>;
  time: { hour: number, minute: number };
  snooze: SnoozeSettings | null;
  onceOff: boolean;
  timeout: number

  constructor() {
    this.name = "Default Alarm";
    this.enabled = false;
    this.created = new Date();
    this.days = [];
    this.time = {
      hour: 0, minute: 0
    };
    this.snooze = new NullSnoozeSettings();
    this.onceOff = true;
    this.timeout = 0;
  }



}