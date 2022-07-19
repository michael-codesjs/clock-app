import Alarm  from "../classes/alarm";

describe("Alarms", () => {

  let alarm: Alarm;
  let alarms:Array<Alarm>;
  let setAlarms: (alarms: Array<Alarm> | ((alarms: Array<Alarm>) => Array<Alarm>)) => void;

  beforeEach(() => {

    alarm = new Alarm({
      name: "test alarm",
      enabled: true,
      time: {
        hour: 12,
        minute: 0
      },
      snooze: { interval: 5, repeat: 3 },
      onceOff: false,
      days: []
    });


    alarms = [alarm,
    ...(Array(5).fill(null).map((...mapArgs) => {
      const [,index] = mapArgs;
      return new Alarm({
        name: "Other "+index,
        enabled: true,
        time: {
          hour: Math.floor(Math.random()*24),
          minute: Math.floor(Math.random()*60)
        },
        snooze: {
          interval: 5, repeat: 5
        },
        onceOff: false,
        days: [Math.floor(Math.random()*7)]
      });
    }))];
    
    setAlarms = (newAlarms) => {
      alarms = typeof newAlarms === "function" ? newAlarms(alarms) : newAlarms;
    }

  });

  test("alarm can be instantiated", () => {
    expect(alarm).toBeInstanceOf(Alarm);
  });

  test("alarm can be deleted", () => {
    const beforeDeleteLength = alarms.length;
    alarm.deleteAlarm(setAlarms);
    expect(alarms.length).toBeLessThan(beforeDeleteLength);
    expect(alarms.indexOf(alarm)).toBe(-1);
  })

})