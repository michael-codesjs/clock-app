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

export interface Alarm {
  name: string,
  created: Date,
  days: Array<number>,
  ringTimes: { hours: number, minutes: number },
  onceOff: boolean,
  snooze: null | { interval: number, repeat: number },
  enabled: boolean
}