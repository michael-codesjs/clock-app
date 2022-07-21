import {
  Button,
  ButtonProps,
  forwardRef,
  useColorModeValue
} from "@chakra-ui/react";
import React from "react";

export const ButtonPrimary = forwardRef((props,ref) => {
  return (
    <Button
      ref={ref}
      as={"button"}
      color={"white"}
      rounded={"full"}
      backgroundColor={"blueviolet"}
      _hover={{
        backgroundColor: "blueviolet",
        outline: "none",
        border: "none"
      }}
      _focus={{
        backgroundColor: "blueviolet",
        outline: "none",
        border: "none"
      }}
      _active={{
        backgroundColor: "blueviolet",
        outline: "none",
        border: "none"
      }}
      { ...props }
    />
  )
});