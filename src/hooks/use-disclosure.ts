import { useState } from "react";

interface DisclosureArguments {
  defaultIsOpen?: boolean
}

export default function useDisclosure(args?:DisclosureArguments) {

  
  const [isOpen, setIsOpen] = useState(args && args.defaultIsOpen);

  const open =  () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(isOpen => !isOpen);

  return { isOpen, isClosed: !isOpen, open, close, toggle };

}