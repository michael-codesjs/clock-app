import React from 'react';
import {
  Box,
  Stack,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import Navigation from './components/navigation';
import Toast from './components/toast';
import TriggerAlarmDisplay from './components/triggered-alarm-display';
import Routes from './Routes';

export default function App() {

  return (
    <Stack
      direction={{
        base: "column",
        md: "row"
      }}
      bg={useColorModeValue("light-background", "dark-background")}
      width={"100vw"}
      height={"100vh"}
      spacing={5}
      p={{
        base: 0,
        md: 20
      }}
      justify={"space-between"}
      align={"start"}
    >
      {/* routes should take most of the screen */}
      <Box
        order={{
          base: 1,
          md: 2
        }}
        width={"full"}
        height={"full"}
        p={5}
      >
        <Routes />
      </Box>

      <Navigation />

    </Stack>
  );
}