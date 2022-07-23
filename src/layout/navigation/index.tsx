
import { Stack, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { paths } from "../../utilities/constants";
import ColorModeSwitcher from "../../components/buttons/color-mode-switcher";
import NavigationItem from "./item";

export default function Navigation(): React.ReactElement {
  
  return (
    <Stack
      order={{
        base: 2,
        md: 1
      }}
      position={{
        base: "fixed",
        relative: "relative"
      }}
      bottom={"0px"}
      direction={{
        base: "row",
        md: "column"
      }}
      align={"center"}
      justify={"center"}
      width={{
        base: "full",
        md: "300px"
      }}
      spacing={{
        base: 5,
        md: 4,
      }}
      px={{
        base: 5,
        md: 10
      }}
      py={{
        base: 5,
        md: 20
      }}
      borderRadius={{
        base: 0,
        md: "lg"
      }}
      className={"fancy-shadow"}
      borderTopWidth={{
        base: "1px",
        md: 0
      }}
      zIndex={100}
      borderTopColor={useColorModeValue("gray.100","gray.900")}
      backgroundColor={useColorModeValue("white","gray.900")}
    >

      {
        Object.entries(paths).map(
          ([name, address], index) => <NavigationItem key={name} name={name} address={address} index={index} />
        )
      }

      <ColorModeSwitcher />    

    </Stack>
  )

}