import { InterfaceAlarm } from "../../../types/interfaces";
import { AbstractAlarm } from "./abstract";
import { AlarmView } from "../views/alarm";
import React from "react";
import { BoxModel } from "@chakra-ui/utils";
import { AlarmViewProps } from "../types";

export class Alarm extends AbstractAlarm {

  timeout: number
  isNull: boolean

  constructor(options: InterfaceAlarm) {
    
    super({ ...options, isNull: false });
    this.timeout = 0;
    this.isNull = false;

    this.startAlarmCycle();

  }

  /* METHODS */

  mutateSelfTo(alarms: Array<AbstractAlarm>): Array<AbstractAlarm> {
    return alarms;
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
