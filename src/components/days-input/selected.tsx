import React from "react";

interface SelectedDaysProps {
  days: Array<number>
}

export default function SelectedDays({ days } : SelectedDaysProps) {

  const weekDays = ["S","M","T","W","T","F","S"];

  const date = new Date();
  date.setDate(date.getDate()+1);

  return (
    <div className="flex items-end space-x-1">
      {
        days.length ? weekDays.map((day,i) => {
          const isSelected = days.indexOf(i) > -1;
          return (
            <div className="flex flex-col space-y-1 items-center justify-center" key={i}>
              { isSelected && (
                <div className="w-1 h-1 rounded-full bg-purple-600" />
              ) }
              <p className={"text-[10px] "+ (isSelected ? "text-purple-800 font-medium" : "text-gray-400 font-normal")}> { day } </p>
            </div>
          )
        }) : (
          <p className="text-[10px] min-w-[max-content]"> { date.toLocaleDateString("en", { weekday: "short", month: "short", day: "2-digit" }) } </p>
        )
      }
    </div>
  )
}