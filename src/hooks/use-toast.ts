import { useSetRecoilState } from "recoil"
import { incomingToastAtom } from "../recoil/atoms"
import { ToastInstance } from "../types/interfaces";

export default function useToast() {
  const setIncomingToast = useSetRecoilState(incomingToastAtom);
  return function(instance:ToastInstance) {
    setIncomingToast(instance);
  }
}