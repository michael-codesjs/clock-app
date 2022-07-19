import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react"


interface DaysInputProps {
  state: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>]
}

export default function DaysInput({ state }: DaysInputProps) {

  const [selectedDays, setSelectedDays] = state;
  const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  let selectedDaysDisplay: string;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (selectedDays.length < 1) {
    selectedDaysDisplay = "Tomorrow " + tomorrow.toLocaleDateString("en", { day: "2-digit", month: "long", weekday: "short" })
  } else if (selectedDays.length === daysOfTheWeek.length) {
    selectedDaysDisplay = "Every Day";
  } else if (selectedDays.length === 5 && selectedDays.indexOf(0) < 0 && selectedDays.indexOf(6) < 0) {
    selectedDaysDisplay = "Week Days";
  } else if (selectedDays.length === 2 && selectedDays.indexOf(0) > -1 && selectedDays.indexOf(6) > 0) {
    selectedDaysDisplay = "Weekends";
  } else {
    selectedDaysDisplay = "Every ";
    selectedDays.sort().forEach((day, index) => {
      selectedDaysDisplay += daysOfTheWeek[day];
      if (index !== selectedDays.length - 1) selectedDaysDisplay += ", ";
    })
  }

  return (
    <VStack
      spacing={3}
      width={"full"}
      align={"start"}
    >

      <Text
        fontSize={"sm"}
      > {selectedDaysDisplay} </Text>

      <HStack
        align={"center"}
        justify={"space-between"}
        width={"full"}
        spacing={0}
      >
        {
          /* days in wweek */
          Array(7).fill(null).map((...loopValues) => {
            const dayInWeek = loopValues[1];
            const dayName = daysOfTheWeek[dayInWeek];
            const isSelected = Boolean(selectedDays.indexOf(dayInWeek) + 1);
            const isTomorrow = !selectedDays.length && tomorrow.getDay() === dayInWeek;
            return (
              <Button
                key={dayInWeek}
                h={6}
                px={2}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                textColor={isSelected ? "purple.500" : "gray.500"}
                backgroundColor={isSelected ? "purple.100" : "transparent" }
                borderWidth={isTomorrow ? 1 : 0}
                borderColor={"purple.500"}
                fontSize={"11px"}
                fontWeight={"medium"}
                rounded={"full"}
                _active={{
                  outline: 0,
                  border: "none"
                }}
                _focus={{
                  outline: 0,
                  border: "none"
                }}
                onClick={
                  () => {
                    if (!isSelected) setSelectedDays(selectedDays => [...selectedDays, dayInWeek]);
                    else setSelectedDays(selectedDays => selectedDays.filter(day => day !== dayInWeek));
                  }
                }
              > {dayName} </Button>
            )
          })
        }
      </HStack>
    </VStack>
  )
}