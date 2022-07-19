import { ToastPosition, ToastStatus } from "./enums";

export interface ToastInstance {
  status?: ToastStatus,
  title?: string,
  description?: string,
  duration?: number,
  isClosable?: boolean,
  position?: ToastPosition,
  created?: number
}

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

export interface InterfaceAlarmMethods {
  setTimeOfDateToTimeOfAlarm: () => Date,
  getNextRingDate: () => Date,
}

export interface InterfaceTimeSettings {
  days: Array<number>,
  time: { hour: number, minute: number }
}

/* END */