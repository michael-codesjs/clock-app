import { Snooze } from "../";


export class SnoozeSettings implements Snooze {

  interval: number;
  repeat: number;

  constructor(settings:Snooze) {
    
    this.interval = settings.interval!;
    this.repeat = settings.repeat!;
  
  }

}

export class NullSnoozeSettings implements Snooze {
  
  interval: number;
  repeat: number;

  constructor() {
    this.interval = 5;
    this.repeat = 3;
  }

}