
import { BoxModel } from "@chakra-ui/utils";

export type Time = {
  hour: number,
  minute: number
};

export type Snooze = {
  shouldSnooze: boolean,
  interval: number,
  repeat: number
};

export type AlarmOptions = {
  index?: number
  name: string,
  enabled: boolean,
  created?: Date,
  days: Array<number>,
  time: { hour: number, minute: number },
  snooze: Snooze,
  onceOff: boolean
}

export type UpdateAlarmOptions = Partial<Omit<AlarmOptions, "created">>

export type AlarmViewProps = { positionInSortedList: number, containerDimensions: BoxModel | null }