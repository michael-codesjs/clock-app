import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import {Alarm} from "../../../classes/alarm";
import { NullSnoozeSettings, SnoozeSettings } from "../../../classes/alarm/snooze-settings";
import Toggle from "../../../components/buttons/toggle";
import DaysInput from "../../../components/days-input";
import NumberScrollInput from "../../../components/number-scroll-input";
import useDisclosure from "../../../hooks/use-disclosure";
import useToast from "../../../hooks/use-toast";
import { alarmsAtom } from "../../../recoil/atoms";
import { getTimeFromNow } from "../../../utilities/functions";

export default function AddAlarm() {

  const navigate = useNavigate();
  const toast = useToast();

  const setAlarms = useSetRecoilState(alarmsAtom);

  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [days, setDays] = useState<Array<number>>([]);
  const [name, setName] = useState("");

  const [snooze, setSnooze] = useState<SnoozeSettings | NullSnoozeSettings>(new SnoozeSettings({ repeat: 3, interval: 5 }));
  const shouldSnooze = useState(true);
  const snoozeSettingsDisclosure = useDisclosure();

  useEffect(() => {
    if (!shouldSnooze[0] && snoozeSettingsDisclosure.isOpen) snoozeSettingsDisclosure.close();
  }, [shouldSnooze[0]]);

  function addAlarm() {

    // instantiate alarm instance.
    const alarm = new Alarm({
      name,
      enabled: true,
      days,
      time: { hour, minute },
      onceOff: false,
      snooze
    });

    // set to state
    setAlarms(alarms => [alarm, ...alarms]);

    // provide feedback
    const timeFromNow = getTimeFromNow(alarm.nextRingDate);
    toast({
      title: "Alarm in " + timeFromNow + " from now",
      duration: 3000,
      isClosable: true
    });

    // navigate to home page
    navigate(-1);
  }

  return (
    <div className="w-full h-full flex flex-col space-y-5">

      { /* scroll input group */}
      <div className="flex items-center justify-center">
        <NumberScrollInput name={""} max={24} state={[hour, setHour]} />
        <p className="text-4xl font-medium text-center">:</p>
        <NumberScrollInput name={""} max={60} state={[minute, setMinute]} />
      </div>

      {/* ALARM SETTINGS */}
      <div className="rounded-3xl p-5 flex-1 flex flex-col space-y-4 bg-white overflow-y-scroll">

        {/* days input */}
        <DaysInput state={[days, setDays]} />

        {/* alarm name */}
        <input
          className={"py-2 text-sm focus:outline-0 border-b-2 border-gray-200 focus:border-blue-600 focus:border-b-[3px] transition-all focus:py-3 w-full"}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={"Alarm name."}
        />

        {/* snooze settings */}
        <div className="flex flex-col space-y-2">
          <div className="flex w-full items-center py-2">
            <div className={"w-full cursor-pointer"} onClick={() => {
              if (!shouldSnooze[0] && snoozeSettingsDisclosure.isClosed) shouldSnooze[1](true);
              snoozeSettingsDisclosure.toggle();
            }}>
              <p className="text-sm"> Snooze </p>
              <p className={"text-xs " + (shouldSnooze[0] ? "text-purple-600" : "text-gray-400")}>
                {
                  shouldSnooze[0] ? <span> {snooze && snooze.interval} minutes {snooze && snooze.repeat} times </span> : "off"
                }
              </p>
            </div>
            <div className="bg-red">
              <Toggle state={shouldSnooze} />
            </div>
          </div>
          <div className={"border rounded-xl rounded-x transition-all overflow-hidden box-border " + (snoozeSettingsDisclosure.isOpen ? "h-auto" : "h-0")}>
            <div className={"p-4 flex flex-col space-y-3"}>
              <fieldset className="flex flex-col space-y-2">
                <legend className="text-sm font-medium text-gray-600"> Interval </legend>
                <hr />
                {
                  [5, 10, 15].map(interval => {
                    return (
                      <div
                        key={interval}
                        className="flex items-center space-x-3 w-full cursor-pointer"
                        onClick={() => {
                          setSnooze(snooze => {
                            const newSnooze = Object.assign({}, snooze, { interval });
                            return newSnooze;
                          })
                        }}
                      >
                        <input
                          className="h-4 w-4 cursor-pointer"
                          key={interval}
                          type="radio"
                          id={interval.toString()}
                          name="interval"
                          value={interval}
                          checked={!!snooze && snooze.interval === interval}
                          onChange={() => { }}
                        />
                        <label htmlFor={interval.toString()} className={"text-sm text-gray-500 cursor-pointer"}> {interval} minutes </label>
                      </div>

                    )
                  })
                }
              </fieldset>

              <fieldset className="flex flex-col space-y-2">
                <legend className="text-sm font-medium text-gray-600"> Repeat </legend>
                <hr />
                {
                  [3, 5, Infinity].map(repeat => {
                    return (
                      <div
                        key={repeat}
                        className="flex items-center space-x-3 w-full cursor-pointer"
                        onClick={() => {
                          setSnooze(snooze => {
                            const newSnooze = Object.assign({}, snooze, { repeat });
                            return newSnooze;
                          })
                        }}
                      >
                        <input
                          className="h-4 w-4 cursor-pointer"
                          key={repeat}
                          type="radio"
                          id={repeat.toString()}
                          name="repeat"
                          value={repeat}
                          checked={!!snooze && snooze.repeat === repeat}
                          onChange={() => { }}
                        />
                        <label htmlFor={repeat.toString()} className={"text-sm text-gray-500 cursor-pointer"}> {repeat} times </label>
                      </div>

                    )
                  })
                }
              </fieldset>

            </div>
          </div>
        </div>

      </div>

      <div className="flex space-x-10">
        <button
          className="w-full py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold"
          onClick={() => navigate(-1)}
        > Cancel </button>
        <button
          className="w-full py-2 rounded-full bg-green-500 hover:bg-green-400 text-gray-50 text-sm font-semibold"
          onClick={addAlarm}
        > Save </button>
      </div>

    </div>
  )
}