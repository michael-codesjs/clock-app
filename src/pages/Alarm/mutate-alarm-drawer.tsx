import { Box, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Heading, HStack, Text, useBreakpointValue, useColorModeValue, VStack } from "@chakra-ui/react";
import { useDrag, UserDragConfig } from "@use-gesture/react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useRecoilState, useRecoilValue } from "recoil";
import NumberScrollInput from "../../components/number-scroll-input";
import { mutateAlarmDrawerIsOpenAtom, selectedAlarmAtom } from "../../recoil/atoms";


export default function MutateAlarmDrawer() {

  const [isOpen, setIsOpen] = useRecoilState(mutateAlarmDrawerIsOpenAtom);
  const selectedAlarm = useRecoilValue(selectedAlarmAtom);

  // alarm properties states
  const [hour, setHour] = useState(selectedAlarm.time.hour);
  const [minute, setMinute] = useState(selectedAlarm.time.minute);


  const navigate = useNavigate();
  const { action } = useParams();
  const isAdd = action === "add";

  /* CLOSE BY DRAGGING FUNCTIONALITY */

  // SPRING 

  const [styles, springAPI] = useSpring(() => ({
    x: 0, y: 0
  }));

  const maxDrag = 200;

  const dragOptions: UserDragConfig = {
    axis: useBreakpointValue({ base: "y", md: "x" }),
    bounds: useBreakpointValue({
      base: { top: 0, bottom: maxDrag },
      md: { left: 0, right: maxDrag }
    }),
    rubberband: 1,
    pointer: {
      touch: true,
    },
  }

  const bindDrag = useDrag((state) => {
    const { down, offset: [mx, my], last } = state;
    // if (last && mx > (maxDrag / 1.5)) return initiateDeleteAlarmAnimation();
    springAPI.start({ x: down ? mx : 0, y: down ? my : 0, immediate: false });
  }, dragOptions);

  /* END */

  const placement = useBreakpointValue({ base: "bottom", md: "right" }) as "bottom" | "right";

  const onClose = () => navigate(-1);

  const drawerHeaderDragIndicatorLinesBackgroundColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={placement}

    >

      <DrawerOverlay onClick={onClose} />

      <animated.div
        style={{
          ...styles,
          backgroundColor: useColorModeValue("white", "gray.800")
        }}
      >
        <DrawerContent
          borderTopRadius={{
            base: "32px",
            md: "0"
          }}
          p={0}
          width={"full"}
          {...bindDrag()}
        >

          <DrawerHeader
            as={VStack}
            spacing={4}
            align={"center"}
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
              fontSize={"lg"}
              fontWeight={"normal"}
              color={useColorModeValue("gray.600", "gray.100")}
            > {isAdd ? "Set" : "Edit"} Alarm </Heading>

          </DrawerHeader>

          <DrawerBody
            as={VStack}
            spacing={4}
            py={10}
            width={{
              base: "full",
              md: "auto"
            }}
            height={{
              base: "90vh",
              md: "100vh"
            }}
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

          </DrawerBody>

        </DrawerContent>
      </animated.div>

    </Drawer >
  )

}