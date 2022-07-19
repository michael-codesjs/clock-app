import { AtomEffect, DefaultValue } from 'recoil';
import { unStringfy } from "../utilities/functions";

export function localPersistEffect(options?: { onLocalStorageGetItem?: ((items:any) => any)}) {
  const onLocalStorageGetItem = options && options.onLocalStorageGetItem;
  const actualPersistEffect: AtomEffect<any> = ({ node, setSelf, onSet }): void => {
    let storedItems = localStorage.getItem(node.key);
    if (storedItems != null) {
      storedItems = unStringfy(storedItems);
      if(onLocalStorageGetItem) {
        // do whatever you want you with the data gotten from localStoraeg before it's set to the atom.
        // my use case is re-instantiating alarms for now since methods are not persisted in json strings :(
        storedItems = onLocalStorageGetItem(storedItems);
      }
      setSelf(storedItems);
    }
    onSet(newItems => {
      if (newItems instanceof DefaultValue) {
        localStorage.removeItem(node.key);
      } else {
        localStorage.setItem(node.key, JSON.stringify(newItems));
      }
    });
  }
  return actualPersistEffect;
}