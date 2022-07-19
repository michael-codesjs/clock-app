import { atom } from "recoil";
import { Alarm, NullAlarm } from "../classes/alarm";
import { NullSnoozeSettings } from "../classes/alarm/snooze-settings";
import { InterfaceAlarm, ToastInstance } from "../types/interfaces";
import { localPersistEffect } from "./atom-effects";

export const incomingToastAtom = atom<ToastInstance | null>({
  key: "toast-state",
  default: null
});

/* ALARM RELATED ATOMS */

// local persist effect that instantiates the alarms gotten form local storage before setting them to the atom
const alarmLocalPersistEffect = localPersistEffect({
  // instanciate the alarms gotten from local storage.
  onLocalStorageGetItem: (alarms: Array<InterfaceAlarm> | Alarm) => {
    const alarmisify = (alarm:any) => new Alarm(alarm);
    const instanciatedAlarmInstances = Array.isArray(alarms) ? alarms.map(alarm => alarmisify(alarm)) : alarmisify(alarms);
    return instanciatedAlarmInstances;
  }
});

// atom that stores all the alarms created by a user
export const alarmsAtom = atom<Array<Alarm>>({
  key: "alarms",
  default: [],
  effects: [
    alarmLocalPersistEffect
  ]
});

// atom that holds a selected alarm. Selected for many purposes, like editting.
export const selectedAlarmAtom = atom<Alarm | NullAlarm>({
  key: "selected-alarm-atom",
  default: new NullAlarm(),
  effects: [
    alarmLocalPersistEffect
  ]
});

// atom dictates whether the mutateAlarmDrawer is open or not
export const mutateAlarmDrawerIsOpenAtom = atom({
  key: "mutate-alarm-drawer-is-open",
  default: false,
  effects: [
    localPersistEffect()
  ]
})

/* END */