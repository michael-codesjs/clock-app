import React from 'react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  HStack,
  IconButton, Text, useColorMode,
  useColorModeValue
} from '@chakra-ui/react';

export default function ColorModeSwitcher() {

  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(<SunIcon />, <MoonIcon />);

  return (
    <HStack
      spacing={5}
      width={"full"}
      cursor={"pointer"}
      onClick={toggleColorMode}
    >
      <IconButton
        cursor={"pointer"}
        aria-label={"color-mode-switcher"}
        icon={SwitchIcon}
        borderRadius={"full"}
        width={10}
        height={10}
        bg={useColorModeValue("gray.100", "gray.800")}
        color={useColorModeValue("gray.800", "gray.100")}
      />

      <Text
        fontSize={"14px"}
        textTransform={"capitalize"}
        display={{ base: "none", md: "block" }}
      > {text} mode </Text>

    </HStack>
  )

}