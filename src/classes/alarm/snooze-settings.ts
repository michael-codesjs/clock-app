import { InterfaceSnoozeSettings } from "../../types/interfaces";


export class SnoozeSettings implements InterfaceSnoozeSettings {

  interval: number;
  repeat: number;

  constructor(settings:InterfaceSnoozeSettings) {
    
    this.interval = settings.interval!;
    this.repeat = settings.repeat!;
  
  }

}

export class NullSnoozeSettings implements InterfaceSnoozeSettings {
  
  interval: number;
  repeat: number;

  constructor() {
    this.interval = 0;
    this.repeat = 0;
  }

}