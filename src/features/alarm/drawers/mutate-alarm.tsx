import {
  Box,
  Collapse,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spacer,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { useDrag, UserDragConfig } from "@use-gesture/react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useRecoilState } from "recoil";
import { Alarm, NullAlarm, AlarmOptions, SnoozeSettings } from "../";
import { ButtonPrimary } from "../../../components/buttons/solid";
import Toggle from "../../../components/buttons/toggle";
import DaysInput from "../../../components/days-input";
import NumberScrollInput from "../../../components/number-scroll-input";
import { alarmsAtom, mutateAlarmDrawerIsOpenAtom, selectedAlarmAtom } from "../../../data/atoms";


export function MutateAlarmDrawer() {

  const [isOpen, setIsOpen] = useRecoilState(mutateAlarmDrawerIsOpenAtom);
  const [selectedAlarm, setSelectedAlarm] = useRecoilState(selectedAlarmAtom);
  const [alarms, setAlarms] = useRecoilState(alarmsAtom);

  // alarm properties states
  const [name, setName] = useState(selectedAlarm.name);
  const [hour, setHour] = useState(selectedAlarm.time.hour);
  const [minute, setMinute] = useState(selectedAlarm.time.minute);
  const [days, setDays] = useState(selectedAlarm.days);
  const [snoozeInterval, setSnoozeInterval] = useState(selectedAlarm.snooze.interval);
  const [snoozeRepeat, setSnoozeRepeat] = useState(selectedAlarm.snooze.repeat);
  const [shouldSnooze, setShouldSnooze] = useState(selectedAlarm.snooze.shouldSnooze);

  const snoozeSettingsDisclosure = useDisclosure({
    defaultIsOpen: false,
  });

  const setAlarmButtonRef = useRef<HTMLButtonElement | null>(null);

  const navigate = useNavigate();
  const onClose = () => {
    navigate(-1);
  }
  const { action } = useParams();
  const isAdd = action === "add";


  /* CLOSE BY DRAGGING FUNCTIONALITY */

  /* utility vars */
  const maxDrag = 200;
  const isMobileDevice = useBreakpointValue({ base: true, md: false });

  // SPRINGS
  const [styles, springAPI] = useSpring(() => ({ x: 0, y: 0 }));

  const dragOptions: UserDragConfig = {
    axis: isMobileDevice ? "y" : "x",
    bounds: isMobileDevice ? { top: 0, bottom: maxDrag } : { left: 0, right: maxDrag },
    pointer: {
      touch: true,
    },
  }

  const bindDrag = useDrag((state) => {
    const { down, last, offset: [mx, my] } = state;
    // close drawer when the user drags the drawer pass the constraints.
    const constraint = maxDrag - 20;
    if (last && (my > constraint || mx > constraint)) return onClose();
    springAPI.start({ x: down ? mx : 0, y: down ? my : 0, immediate: false });
  }, dragOptions);

  // reset spring whenever the drawer is opened.
  useEffect(() => {
    if (isOpen) springAPI.set({ x: 0, y: 0 });
  }, [isOpen]);

  /* END */


  /* FUNCTIONALITY */

  function mutate() {
    const alarmOptions:AlarmOptions = {
      enabled: true,
      name: name,
      onceOff: false,
      days,
      time: { hour, minute },
      snooze: {
        interval: snoozeInterval,
        repeat: snoozeRepeat,
        shouldSnooze,
      }
    }
    if(selectedAlarm instanceof Alarm) {
      alarmOptions.index = selectedAlarm.index;
      alarmOptions.created = selectedAlarm.created;
    }
    const mutatedAlarm = selectedAlarm.mutate(alarmOptions);
    const newAlarms = mutatedAlarm.to(alarms);
    // setSelectedAlarm(mutatedAlarm);
    setAlarms(newAlarms);
    onClose();
    setSelectedAlarm(new NullAlarm());
  }

  /* END */

  const placement = useBreakpointValue({ base: "bottom", md: "right" }) as "bottom" | "right";
  const drawerHeaderDragIndicatorLinesBackgroundColor = useColorModeValue("gray.300", "gray.600");

  return (

    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={placement}
      initialFocusRef={setAlarmButtonRef}
      size={"md"}
    >

      <DrawerOverlay onClick={onClose} />

      <DrawerContent
        borderTopRadius={{
          base: "40px",
          md: "0"
        }}
        p={0}
        width={"full"}
        height={{
          base: "full",
          md: "100vh"
        }}
        maxH={{
          base: "97vh",
          md: "100vh"
        }}
        bg={"none"}
      >
        <animated.div
          style={{
            ...styles,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: "inherit",
            backgroundColor: useColorModeValue("white", "rgb(26, 32, 44)")
          }}
        >

          <DrawerHeader
            as={VStack}
            spacing={4}
            align={"center"}
            {...bindDrag()}
          >
            <VStack
              align={"center"}
              width={6}
              display={{ base: "flex", md: "none" }}
              spacing={"3px"}
            >
              {
                Array(3).fill(null).map((...mapArgs) => {
                  const [, index] = mapArgs;
                  const width = (((index + 1) / 3) * 100) + 20;
                  return (
                    <Box
                      key={index}
                      minH={"1px"}
                      borderRadius={"2px"}
                      backgroundColor={drawerHeaderDragIndicatorLinesBackgroundColor}
                      width={width + "%"}
                    />
                  )
                }).reverse()
              }
            </VStack>

            <Heading
              fontSize={"xl"}
              fontWeight={"normal"}
              color={useColorModeValue("gray.700", "gray.300")}
              userSelect={"none"}
            > { isAdd ? "Set" : "Edit" } Alarm </Heading>

          </DrawerHeader>

          <DrawerBody
            as={VStack}
            flex={1}
            spacing={5}
            width={{
              base: "full",
              md: "auto"
            }}
            height={"full"}
          >

            { /* scroll input group */}
            <HStack
              align={"center"}
              justify={"center"}
            >
              <NumberScrollInput name={""} max={24} state={[hour, setHour]} />
              <Text
                fontSize={"4xl"}
                fontWeight={"medium"}
                textAlign={"center"}
              > : </Text>
              <NumberScrollInput name={""} max={60} state={[minute, setMinute]} />
            </HStack>


            <Divider />

            {/* ALARM SETTINGS */}
            <VStack
              height={"full"}
              p={0}
              width={"full"}
              overflowY={"scroll"}
            >

              {/* days input */}
              <DaysInput state={[days, setDays]} />

              {/* alarm name */}
              <Input
                variant={"unstyled"}
                py={2}
                rounded={0}
                fontSize={"sm"}
                w={"full"}
                borderBottomWidth={2}
                borderBottomColor={"gray.200"}
                transition={"all"}
                _focus={{
                  outline: 0,
                  borderBottomColor: "blue.600",
                  py: 3
                }}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={"Alarm name."}
              />

              {/* snooze settings */}

              <VStack
                spacing={2}
                width={"full"}
              >
                <HStack
                  py={2}
                  width={"full"}
                  align={"center"}
                >

                  <VStack
                    cursor={"pointer"}
                    spacing={0}
                    align={"start"}
                    onClick={() => {
                      if (!shouldSnooze && !snoozeSettingsDisclosure.isOpen) setShouldSnooze(true);
                      snoozeSettingsDisclosure.onToggle();
                    }}
                  >
                    <Text fontSize="sm"> Snooze </Text>
                    <Text
                      fontSize={"xs"}
                      color={shouldSnooze ? "purple.500" : "gray.400"}
                    >
                      {shouldSnooze ? <span> {snoozeInterval} minutes {snoozeRepeat} times </span> : "off"}
                    </Text>
                  </VStack>
                  <Spacer />
                  <Toggle
                    state={[shouldSnooze, setShouldSnooze]}
                  />
                </HStack>

                <Box
                  as={Collapse}
                  in={snoozeSettingsDisclosure.isOpen}
                  width={"full"}
                  borderWidth={1}
                  rounded={"xl"}
                >
                  <VStack
                    spacing={3}
                    p={4}
                    width={"full"}
                  >
                    <VStack
                      as={"fieldset"}
                      spacing={2}
                      align={"start"}
                      width={"full"}
                    >
                      <Text
                        as={"legend"}
                        fontSize={"sm"}
                        fontWeight={"medium"}
                        textColor={"gray.600"}
                      > Interval </Text>
                      <Divider />
                      {
                        [5, 10, 15].map(interval => {
                          return (
                            <HStack
                              key={interval}
                              spacing={3}
                              cursor={"pointer"}
                              onClick={() => setSnoozeInterval(interval)}
                            >
                              <Box
                                as={"input"}
                                h={4}
                                w={4}
                                cursor={"pointer"}
                                type="radio"
                                id={interval.toString()}
                                name="interval"
                                value={interval}
                                checked={snoozeInterval === interval}
                                onChange={() => { }}
                              />
                              <FormLabel
                                htmlFor={interval.toString()}
                                fontSize={"sm"}
                                color={"gray.500"}
                                cursor={"pointer"}
                              > {interval} minutes </FormLabel>
                            </HStack>
                          )
                        })
                      }
                    </VStack>

                    <VStack
                      as={"fieldset"}
                      spacing={2}
                      width={"full"}
                    >
                      <Text
                        as={"legend"}
                        fontSize={"sm"}
                        fontWeight={"medium"}
                        textColor={"gray.600"}
                      > Repeat </Text>
                      <Divider />
                      {
                        [3, 5, Infinity].map(repeat => {
                          return (
                            <HStack
                              key={repeat}
                              spacing={3}
                              width={"full"}
                              cursor={"pointer"}
                              onClick={() => setSnoozeRepeat(repeat)}
                            >
                              <Box
                                as={"input"}
                                h={4}
                                w={4}
                                cursor={"pointer"}
                                type="radio"
                                id={repeat.toString()}
                                name="repeat"
                                value={repeat}
                                checked={snoozeRepeat === repeat}
                                onChange={() => { }}
                              />
                              <FormLabel
                                htmlFor={repeat.toString()}
                                fontSize={"sm"}
                                color={"gray.500"}
                                cursor={"pointer"}
                              > {repeat} times </FormLabel>
                            </HStack>

                          )
                        })
                      }
                    </VStack>

                  </VStack>
                </Box>
              </VStack>
            </VStack>


          </DrawerBody>

          <Divider />

          <DrawerFooter
            as={HStack}
            spacing={10}
            pt={8}
          >
            <ButtonPrimary
              ref={setAlarmButtonRef}
              width={"full"}
              onClick={mutate}
            > Save </ButtonPrimary>
          </DrawerFooter>
        </animated.div>
      </DrawerContent>

    </Drawer >
  )

}


