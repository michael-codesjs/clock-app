import { useDrag, UserDragConfig } from "@use-gesture/react";
import React, { useMemo, useState } from "react"
import { useSpring, animated } from "react-spring";
import { useRecoilState } from "recoil";
import Toggle from "../../../components/buttons/toggle";
import SelectedDays from "../../../components/days-input/selected";
import { alarmsAtom } from "../../../recoil/atoms";
import { Alarm as AlarmClass } from "../model/alarm";
import { NullAlarm as NullAlarmClass } from "../model/null-alarm"
import { Box, HStack, Icon, IconButton, ScaleFade, Text, useColorModeValue } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { AlarmViewProps } from "../types";
import { AlarmViewWrapper } from "./wrapper";

export const AlarmView: React.FC<AlarmViewProps & { alarm: AlarmClass }> = (props) => {

  const { alarm, ...wrapperProps } = props;

  const [alarms, setAlarms] = useRecoilState(alarmsAtom);

  const enabled = useState(alarm.enabled);
  const nextRing = useMemo(() => alarm.nextRingDate, [alarm]);

  const maxDrag = 100; // maximum number of pixels the alarm view can be dragged.

  const [containerSpringStates, containerSpringAPI] = useSpring(() => {
    return {
      x: 0, y: 0, scale: 1, opacity: 1,
      height: 100, paddingBottom: 20,
      // text opacity
      deleteTextOpacity: 0,
    }
  })

  const [contentSpringStates, contentSpringAPI] = useSpring(() => {
    return {
      x: 0, y: 0, opacity: 1, scale: 1,
    }
  });

  const dragOptions: UserDragConfig = {
    axis: "x",
    bounds: {
      left: 0, right: maxDrag
    },
    rubberband: 1,
    from: () => [contentSpringStates.x.get(), 0],
    pointer: {
      touch: true,
    },
  }

  const bindDrag = useDrag((state) => {
    const { down, offset: [mx], last } = state;
    if (last && mx > (maxDrag - 20)) return initiateDeleteAlarmAnimation();
    contentSpringAPI.start({ x: down ? mx : 0, scale: down ? 1.05 : 1, immediate: false });
    containerSpringAPI.start({ deleteTextOpacity: mx / maxDrag });
  }, dragOptions);

  function initiateDeleteAlarmAnimation() {
    containerSpringAPI.set({ deleteTextOpacity: 0 });
    containerSpringAPI.start({
      x: 200, scale: 0, opacity: 0,
      config: {
        duration: 165
      },
      // when this is resolved, trigger another animation that reduces the height.
      onResolve: () => {
        return setAlarms(alarms => alarm.deleteSelfFrom(alarms));
        containerSpringAPI.start({
          height: 0, paddingBottom: 0,
          config: {
            friction: 18,
            mass: 0.7

          },
          // when this last spring animation is done, delete the alarm from the alarmsAtom;
          onResolve: () => {
            setAlarms(alarms => alarm.deleteSelfFrom(alarms));
          }
        })
      }
    });
  }

  const width = contentSpringStates.x.to({
    map: Math.abs,
    range: [0, maxDrag],
    output: [0, maxDrag - ((1 / 5) * maxDrag)],
    extrapolate: 'clamp',
  });

  const fontWeight = contentSpringStates.x.to({
    map: Math.abs,
    range: [0, maxDrag],
    output: [100, 900],
    extrapolate: 'clamp',
  });

  const viewBg = useColorModeValue("bg-white", "bg-gray-500");

  return (
    <AlarmViewWrapper {...wrapperProps}>
      <animated.div
        className="flex items-center w-full select-none cursor-grab"
        style={containerSpringStates}
        {...bindDrag()}
      >

        <animated.button
          style={{
            width,
            fontWeight,
            opacity: containerSpringStates.deleteTextOpacity,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          className={"text-xs flex items-center justify-center"}
        >
          <IconButton
            as={Text}
            aria-label={"delete-icon"}
            size={"sm"}
            rounded={"full"}
            colorScheme={"red"}
            icon={<Icon as={DeleteIcon} />}
          />
        </animated.button>

        <animated.div
          style={{
            ...contentSpringStates,
            width: "100%", height: "80px"
          }}
        >
          <HStack
            as={ScaleFade}
            in={true}
            spacing={5}
            align={"center"}
            zIndex={2}
            p={5}
            rounded={"xl"}
            width={"full"}
            height={"full"}
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

        </animated.div>

      </animated.div>
    </AlarmViewWrapper>
  )
}