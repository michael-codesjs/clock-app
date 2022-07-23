import { atom } from "recoil";
import { AbstractAlarm } from "../features/alarm";
// import { AbstractAlarm } from "../features/alarm";
import { Alarm } from "../features/alarm/model/alarm";
import { NullAlarm } from "../features/alarm/model/null-alarm";
import { localPersistEffect } from "./atom-effects";

/* ALARM RELATED ATOMS */

// local persist effect that instantiates the alarms gotten form local storage before setting them to the atom
const alarmLocalPersistEffect = localPersistEffect({
  // instanciate the alarms gotten from local storage.
  onLocalStorageGetItem: (alarms: Array<AbstractAlarm> | (AbstractAlarm)) => {
    // alarms = Array.isArray(alarms) ? alarms.filter(alarm => !alarm.isNull) : alarms;
    const alarmisify = (alarm:any) => alarm.isNull ? new Alarm(alarm) : new Alarm(alarm);
    const instanciatedAlarmInstances = Array.isArray(alarms) ? alarms.map(alarm => alarmisify(alarm)) : alarmisify(alarms);
    return instanciatedAlarmInstances;
  }
});

// atom that stores all the alarms created by a user
export const alarmsAtom = atom<Array<AbstractAlarm>>({
  key: "alarms",
  default: [],
  effects: [
    alarmLocalPersistEffect
  ]
});

// atom that holds a selected alarm. Selected for many purposes, like editting.
export const selectedAlarmAtom = atom<AbstractAlarm>({
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