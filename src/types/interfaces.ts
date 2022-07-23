
/* ALARM RELATED TYPES */

export interface InterfaceAlarm {
  name: string,
  enabled: boolean,
  created?: Date,
  days: Array<number>,
  time: { hour: number, minute: number },
  snooze: InterfaceSnoozeSettings | null,
  onceOff: boolean
}

export interface InterfaceSnoozeSettings {
  interval: number,
  repeat: number
};

export interface InterfaceTimeSettings {
  days: Array<number>,
  time: { hour: number, minute: number }
}

/* END */