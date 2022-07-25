import { HStack, Icon, IconButton, Spacer, Text, useColorModeValue, useDimensions, useForceUpdate, VStack } from "@chakra-ui/react";
import React, { Fragment, startTransition, useEffect, useMemo, useRef } from "react";
import { flushSync } from "react-dom";
import { IoMdAdd } from "react-icons/io";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { NullAlarm, MutateAlarmDrawer } from "../../features/alarm";
import { alarmsAtom, mutateAlarmDrawerIsOpenAtom, selectedAlarmAtom } from "../../data/atoms";
import { paths } from "../../utilities/constants";
import { getNextAlarmToRing, getTimeFromNow } from "../../utilities/functions";


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
    else if (!action || (action !== "add" && action !== "edit") && mutateAlarmDrawerIsOpen) {
      setMutateDrawerIsOpen(false);
    }
  }, [pathname]);

  const navigateToMutateAlarm: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const alarm = new NullAlarm();
    setSelelectedAlarm(alarm);
    navigate(paths.alarm + "/add");
  }

  const alarmsContainerRef = useRef<HTMLDivElement | null>(null);
  const alarmsContainerDimensions = useDimensions(alarmsContainerRef);

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
            to={paths.alarm + "/add"}
            onClick={navigateToMutateAlarm}
            aria-label="set-alarm"
            icon={<Icon as={IoMdAdd} w={6} h={6} color={useColorModeValue("gray.900", "white")} />}
          />
        </HStack>

      </VStack>


      {/* ALARMS LIST */}

      <VStack
        ref={alarmsContainerRef}
        spacing={0}
        width={"full"}
        height={"full"}
        position={"relative"}
        overflowY={"scroll"}
        pb={40}
      >
        {alarms.map((alarm, positionInSortedList) => {
          const View = alarm.getView({ positionInSortedList, containerDimensions: alarmsContainerDimensions });
          return (
            <Fragment key={alarm.created.valueOf()}>
              { View }
            </Fragment>
          )
        })}
      </VStack>

      {/* MUTATE ALARM DRAWER STATE */}

      <MutateAlarmDrawer />

    </VStack>
  )

}