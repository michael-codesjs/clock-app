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
    <div className={"w-full flex flex-col space-y-2"}>
      <div className="flex items-center justify-between">
        <p className="text-sm"> {selectedDaysDisplay} </p>
      </div>
      <div className="flex justify-between items-center w-full">
        {
          /* days in wweek */
          Array(7).fill(null).map((...loopValues) => {
            const dayInWeek = loopValues[1];
            const dayName = daysOfTheWeek[dayInWeek];
            const isSelected = Boolean(selectedDays.indexOf(dayInWeek) + 1);
            const isTomorrow = !selectedDays.length && tomorrow.getDay() === dayInWeek;
            return (
              <button
                key={dayInWeek}
                className={"h-6 px-2 flex items-center justify-center text-gray-500 text-[11px] rounded-full " + (isSelected ? "bg-purple-100 text-purple-500 font-medium" : isTomorrow ? "border-2 border-purple-200" : "")}
                onClick={
                  () => {
                    if (!isSelected) setSelectedDays(selectedDays => [...selectedDays, dayInWeek]);
                    else setSelectedDays(selectedDays => selectedDays.filter(day => day !== dayInWeek));
                  }
                }
              > {dayName} </button>
            )
          })
        }
      </div>
    </div>
  )
}