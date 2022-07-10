import { AtomEffect, DefaultValue } from 'recoil';
import { Alarm } from '../types/interfaces';
import { unStringfy } from "../constants/functions";


export const localPersistEffect:AtomEffect<any> = ({ node, setSelf, onSet }):void => {
  const storedItems = localStorage.getItem(node.key);
  if (storedItems != null) {
    setSelf(unStringfy(storedItems));
  }
  onSet(newItems => {
    if (newItems instanceof DefaultValue) {
      localStorage.removeItem(node.key);
    } else {
      localStorage.setItem(node.key, JSON.stringify(newItems));
    }
  });
};
