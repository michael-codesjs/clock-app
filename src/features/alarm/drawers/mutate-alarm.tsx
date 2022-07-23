import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
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
import { useRecoilState, useRecoilValue } from "recoil";
import { NullSnoozeSettings, SnoozeSettings } from "../model/snooze-settings";
import { ButtonPrimary } from "../../../components/buttons/solid";
import Toggle from "../../../components/buttons/toggle";
import DaysInput from "../../../components/days-input";
import NumberScrollInput from "../../../components/number-scroll-input";
import { alarmsAtom, mutateAlarmDrawerIsOpenAtom, selectedAlarmAtom } from "../../../recoil/atoms";


export function MutateAlarmDrawer() {

  const [isOpen, setIsOpen] = useRecoilState(mutateAlarmDrawerIsOpenAtom);
  const selectedAlarm = useRecoilValue(selectedAlarmAtom);
  const [alarms, setAlarms] = useRecoilState(alarmsAtom);

  // alarm properties states
  const [hour, setHour] = useState(selectedAlarm.time.hour);
  const [minute, setMinute] = useState(selectedAlarm.time.minute);
  const [days, setDays] = useState(selectedAlarm.days);
  const [snooze, setSnooze] = useState<SnoozeSettings | NullSnoozeSettings>(selectedAlarm.snooze);
  const shouldSnooze = useState(snooze instanceof SnoozeSettings);
  const snoozeSettingsDisclosure = useDisclosure();

  const setAlarmButtonRef = useRef<HTMLButtonElement | null>(null);

  const navigate = useNavigate();
  const onClose = () => navigate(-1);
  const { action } = useParams();
  const isAdd = action === "add";
  

  /* CLOSE BY DRAGGING FUNCTIONALITY */

  /* utility vars */
  const maxDrag = 200;
  const isMobileDevice  = useBreakpointValue({ base: true, md: false });

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
    if(isOpen) springAPI.set({ x: 0, y: 0 });
  },[isOpen]);

  /* END */


  /* FUNCTIONALITY */

  useEffect(() => {
    if(isAdd) {
      // setAlarms(selectedAlarm)
    }
  })

  function mutate() {
    setAlarms(selectedAlarm.mutateSelfTo(alarms));
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
          base: "auto",
          md: "100vh"
        }}
        maxH={{
          base: "40vh",
          md: "100vh"
        }}
        bg={"none"}
      >
        <animated.div
          style={{
            ...styles,
            height: "100%",
            borderRadius: "inherit",
            backgroundColor: useColorModeValue("white", "rgb(26, 32, 44)")
          }}
        >

          <DrawerHeader
            as={VStack}
            spacing={4}
            pt={10}
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
            > {isAdd ? "Set" : "Edit"} Alarm </Heading>

          </DrawerHeader>

          <DrawerBody
            as={VStack}
            spacing={5}
            width={{
              base: "full",
              md: "auto"
            }}
            overflowY={"scroll"}
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
                      if (!shouldSnooze[0] && !snoozeSettingsDisclosure.isOpen) shouldSnooze[1](true);
                      snoozeSettingsDisclosure.onToggle();
                    }}
                  >
                    <Text fontSize="sm"> Snooze </Text>
                    <Text
                      fontSize={"xs"}
                      color={shouldSnooze ? "purple.500" : "gray.400"}
                    >
                      { shouldSnooze[0] ? <span> {snooze && snooze.interval} minutes {snooze && snooze.repeat} times </span> : "off" }
                    </Text>
                  </VStack>
                  <Spacer />
                  <Toggle state={shouldSnooze} />
                </HStack>

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
            > Save </ButtonPrimary>
          </DrawerFooter>
        </animated.div>
      </DrawerContent>

    </Drawer >
  )

}