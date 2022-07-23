import { Box, Flex, HStack, Icon, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMdClock, IoMdAlarm } from "react-icons/io"
import { AiOutlineClockCircle } from "react-icons/ai"

interface NavigationItemProps {
  name: string,
  address: string,
  index: number
}

export const NAVIGATION_ICONS = [IoMdAlarm, AiOutlineClockCircle]


export default function NavigationItem({ name, address, index }: NavigationItemProps): React.ReactElement {

  const { pathname } = useLocation();
  const isActive = pathname.indexOf(address) > -1;

  return (
    <HStack
      as={Link}
      to={address}
      spacing={5}
      width={"full"}
    >
      <Flex
        align={"center"}
        justify={"center"}
        width={10}
        height={10}
        borderRadius={"full"}
        backgroundColor={isActive ? "yellow.400" : "none"}
      >
        <Icon
          as={NAVIGATION_ICONS[index]}
          width={"18px"}
          height={"18px"}
          color={"gray.800"}
        />
      </Flex>

      <Text
        fontSize={"14px"}
        fontWeight={isActive ? "medium" : "normal" }
        textTransform={"capitalize"}
        display={{ base: "none", md: "block" }}
        color={useColorModeValue("gray.700","gray.100")}
      > {name} </Text>

    </HStack>
  )
}