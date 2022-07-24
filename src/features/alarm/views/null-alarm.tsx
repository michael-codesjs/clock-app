import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import Toggle from "../../../components/buttons/toggle";
import SelectedDays from "../../../components/days-input/selected";
import { NullAlarm } from "../model/alarm";
import { AlarmViewWrapper } from "./wrapper";
import { AlarmViewProps } from "../types";


export const NullAlarmView:React.FC<AlarmViewProps & { alarm: NullAlarm }> = (props) => {

  const { alarm, ...wrapperProps } = props;

  const enabled = useState(alarm.enabled);
  const nextRing = useMemo(() => alarm.nextRingDate, [alarm]);

  return (
    <AlarmViewWrapper { ...wrapperProps }>
      <HStack
        spacing={5}
        p={5}
        width={"full"}
        height={"80px"}
        rounded={"xl"}
        opacity={0.5}
        backgroundColor={useColorModeValue("white", "gray.700")}
      >
        <Box width={"full"}>
          <Text
            width={"full"}
            fontSize={"2xl"}
            fontWeight={"medium"}
            color={useColorModeValue("gray.800", "gray.50")}
            letterSpacing={"wider"}
          > {nextRing.toLocaleTimeString("en", { hour: "2-digit", hour12: false, minute: "2-digit" })} </Text>
          <Text
            fontSize={"11px"}
            color={useColorModeValue("gray.500", "gray.400")}
          > {alarm.name} </Text>
        </Box>

        <SelectedDays days={alarm.days} />
        <Box> <Toggle state={enabled} /> </Box>
      </HStack>
    </AlarmViewWrapper>
  )

}