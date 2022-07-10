import { atom } from "recoil";
import { Alarm } from "../types/interfaces";
import { ToastInstance } from "../types/interfaces";
import { localPersistEffect } from "./atom-effects";

export const incomingToastAtom = atom<ToastInstance | null>({
  key: "toast-state",
  default: null
});

export const alarmsAtom = atom<Array<Alarm>>({
  key: "alarms",
  default: [],
  effects: [localPersistEffect]
});