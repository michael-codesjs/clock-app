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

  const maxDrag = 250;

  const dragOptions: UserDragConfig = {
    axis: useBreakpointValue({ base: "y", md: "x" }),
    bounds: useBreakpointValue({
      base: { top: 0, bottom: maxDrag },
      md: { left: 0, right: maxDrag }
    }),
    rubberband: false,
    pointer: {
      touch: true,
    },
  }

  const bindDrag = useDrag((state) => {
    const { down, offset: [mx, my], last } = state;
    const contraint = (maxDrag/1.5);
    if (last && (my > contraint || mx > contraint)) {
      springAPI.start({ x: 0, y: 0 });
      return onClose();
    }
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

      <DrawerContent
        borderTopRadius={{
          base: "32px",
          md: "0"
        }}
        p={0}
        width={"full"}
        height={{
          base: "auto",
          md: "100vh"
        }}
        maxH={{
          base: "90vh",
          md: "100vh"
        }}
        bg={"none"}
      >
        <animated.div
          style={{
            ...styles,
            height: "100%",
            borderRadius: "inherit",
            backgroundColor: useColorModeValue("white", "gray.800")
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
        </animated.div>
      </DrawerContent>

    </Drawer >
  )

}