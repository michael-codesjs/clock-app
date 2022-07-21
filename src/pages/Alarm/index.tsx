import { HStack, Icon, IconButton, Spacer, Text, useColorModeValue, useForceUpdate, VStack } from "@chakra-ui/react";
import React, { startTransition, useEffect, useMemo } from "react";
import { IoMdAdd } from "react-icons/io";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { NullAlarm } from "../../classes/alarm";
import { alarmsAtom, mutateAlarmDrawerIsOpenAtom, selectedAlarmAtom } from "../../recoil/atoms";
import { paths } from "../../utilities/constants";
import { getNextAlarmToRing, getTimeFromNow } from "../../utilities/functions";
import Alarm from "./alarm";
import MutateAlarmDrawer from "./mutate-alarm-drawer";


export default function Alarms() {

  const [alarms, setAlarms] = useRecoilState(alarmsAtom);
  const [selectedAlarm, setSelelectedAlarm] = useRecoilState(selectedAlarmAtom);
  const [mutateAlarmDrawerIsOpen, setMutateDrawerIsOpen] = useRecoilState(mutateAlarmDrawerIsOpenAtom);

  /* NEXT TO RING ALARM FOR THE HEADER */

  const nextAlarmToRing = useMemo(() => getNextAlarmToRing(alarms), [alarms]);
  let nextRing = nextAlarmToRing && nextAlarmToRing.enabled && nextAlarmToRing.nextRingDate;

  const forceUpdate = useForceUpdate();

  // force an update every second/minute to refresh the ui and display the correct amount of time left for the next alarm to ring.
  useEffect(() => {
    if (nextRing) {
      const interval = window.setInterval(() => {
        startTransition(() => {
          forceUpdate();
        });
      }, 60000);
      return () => window.clearInterval(interval);
    }
  }, []);

  /* HANDLE STATE OF THE MUTATE_ALARM_DRAWER */

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { action } = useParams();

  useEffect(() => {
    if (action && (action === "add" || action === "edit") && !mutateAlarmDrawerIsOpen) setMutateDrawerIsOpen(true);
    else if (!action || (action !== "add" && action !== "edit") && mutateAlarmDrawerIsOpen) setMutateDrawerIsOpen(false)
  }, [pathname]);

  const navigateToMutateAlarm:React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    startTransition(() => {
      const alarm = new NullAlarm();
      setSelelectedAlarm(alarm);
      setAlarms(alarms => [alarm,...alarms]);
    });
    navigate(paths.alarm+"/add");
  }

  return (
    <VStack
      spacing={2}
      width={"full"}
      height={"full"}
    >

      {/* HEADER */}

      <VStack
        minH={40}
        height={40}
        width={"full"}
        justify={"center"}
        align={"center"}
      >

        <VStack
          height={"full"}
          py={4}
        >
          {
            nextRing ? (
              <>
                <Text
                  fontSize={"xl"}
                  textAlign={"center"}
                  fontWeight={"medium"}
                > Alarm in {getTimeFromNow(nextRing, 2)} </Text>
                <Text
                  fontSize={"xs"}
                  textAlign={"center"}
                > {nextRing.toLocaleDateString("en", { hour: "2-digit", hour12: false, weekday: "long", minute: "2-digit", day: "2-digit", month: "short" })} </Text>
              </>
            ) : (
              <Text
                fontSize={"xl"}
                color={useColorModeValue("gray.700", "white")}
                letterSpacing={"wider"}
                fontWeight={"medium"}
              > Alarms </Text>
            )
          }
        </VStack>

        <HStack
          spacing={5}
          align={"center"}
          width={"full"}
          p={5}
        >
          <Spacer />
          <IconButton
            as={Link}
            to={paths.alarm+"/add"}
            onClick={navigateToMutateAlarm}
            aria-label="set-alarm"
            icon={<Icon as={IoMdAdd} w={6} h={6} color={useColorModeValue("gray.900", "white")} />}
          />
        </HStack>

      </VStack>


      {/* ALARMS LIST */}

      <VStack
        width={"full"}
        spacing={2}
        overflowY={"scroll"}
      >
        {
          alarms.map(alarm => {
            return (
              <Alarm key={alarm.created.valueOf()} alarm={alarm} />
            )
          })
        }
      </VStack>

      {/* MUTATE ALARM DRAWER STATE */}

      <MutateAlarmDrawer />

    </VStack>
  )

}