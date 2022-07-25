import { Snooze } from "../";


export class SnoozeSettings implements Snooze {

  interval: number;
  repeat: number;
  shouldSnooze: boolean;

  constructor({ shouldSnooze, interval, repeat }:Snooze) {
    this.shouldSnooze = shouldSnooze;
    this.interval = interval;
    this.repeat = repeat;
  }

}

export class NullSnoozeSettings implements Snooze {
  
  interval: number;
  repeat: number;
  shouldSnooze: boolean;

  constructor() {
    this.shouldSnooze = true;
    this.interval = 5;
    this.repeat = 3;
  }

}