import {
  AbstractAlarm,
  AlarmOptions,
  UpdateAlarmOptions,
  NullSnoozeSettings,
  AlarmView,
  NullAlarmView,
  AlarmViewProps
} from "../";
import React from "react";

/* NotNull ALARM */

export class Alarm extends AbstractAlarm {

  timeout: number
  TypeofSelf = Alarm;
  AbsoluteTypeofSelf = Alarm;

  constructor(options: AlarmOptions) {

    super({ ...options, isNull: false });
    this.timeout = 0;

    this.startAlarmCycle();

  }

  /* METHODS */

  // would not recommend calling this function, instead use the *mutate* functions to update an alarm.
  batchUpdate(options: UpdateAlarmOptions): AbstractAlarm {
    Object.assign(this, options);
    return this;
  }

  mutate(options: UpdateAlarmOptions): AbstractAlarm {
    return new this.AbsoluteTypeofSelf({ ...this, ...options });
  }

  mutateSelf(options: UpdateAlarmOptions): AbstractAlarm {
    return this.mutate(options); 
  }

  startAlarmCycle() {
    const timeDifference = this.nextRingDate.valueOf() - new Date().valueOf();
    this.timeout = window.setTimeout(this.ring, timeDifference);
  }

  ring() {
    alert(`${this.name} ringing`);
  }

  getView(props: AlarmViewProps): React.ReactNode {
    return <AlarmView alarm={this} {...props} />
  }


}

/* END */


/* NULL ALARM */

export class NullAlarm extends AbstractAlarm {

  // alarm properties
  timeout: number
  TypeofSelf = NullAlarm;
  AbsoluteTypeofSelf = Alarm;

  constructor() {
    super({
      name: "",
      enabled: true,
      created: new Date(),
      days: [],
      time: { hour: 0, minute: 0 },
      snooze: new NullSnoozeSettings(),
      onceOff: true,
      isNull: true
    });
    this.timeout = 0;
  }

  // would not recommend calling this function, instead use the *mutate* functions to update an alarm.
  batchUpdate(options: Omit<UpdateAlarmOptions, "enabled">): AbstractAlarm {
    Object.assign(this, options);
    return this;
  }

  mutate(options: UpdateAlarmOptions): AbstractAlarm {
    const newSelf = new this.AbsoluteTypeofSelf({ ...this, ...options });
    return newSelf;
  }

  mutateSelf(options: UpdateAlarmOptions): AbstractAlarm {
    const newSelf = new this.TypeofSelf();
    newSelf.batchUpdate(options);
    return newSelf;
  }

  startAlarmCycle() {
    const timeDifference = this.nextRingDate.valueOf() - new Date().valueOf();
    this.timeout = window.setTimeout(this.ring, timeDifference);
  }

  ring() {
    alert(`${this.name} ringing`);
  }

  getView(props: AlarmViewProps): React.ReactNode {
    return <NullAlarmView alarm={this} {...props} />
  }

}

/* END */