import { atom } from "recoil";
import { AbstractAlarm, Alarm, NullAlarm } from "../features/alarm";
import { localPersistEffect } from "./atom-effects";

/* ALARM RELATED ATOMS */

// local persist effect that instantiates the alarms gotten form local storage before setting them to the atom
const alarmLocalPersistEffect = localPersistEffect({
  // instanciate the alarms gotten from local storage.
  onLocalStorageGetItem: (alarms: Array<AbstractAlarm> | (AbstractAlarm)) => {
    if(!alarms) return;
    alarms = Array.isArray(alarms) ? alarms.filter(alarm => !alarm.isNull) : alarms;
    const alarmisify = (alarm:AbstractAlarm) => {
      return alarm.isNull ? new NullAlarm() : new Alarm(alarm);
    }
    const instanciatedAlarmInstances = Array.isArray(alarms) ? alarms.map(alarm => alarmisify(alarm)) : alarmisify(alarms);
    return instanciatedAlarmInstances;
  }
});

// atom that stores all the alarms created by a user
export const alarmsAtom = atom<Array<AbstractAlarm>>({
  key: "alarms",
  default: [],
  dangerouslyAllowMutability: true,
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