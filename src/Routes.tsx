import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { paths } from "./utilities/constants";
import Alarms from "./pages/Alarm";
import { MutateAlarm } from "./pages/Alarm/mutate-alarm";
// import AddAlarm from "./pages/Alarm/Add"



export default function () {
  return (
    <Routes>
      <Route path={paths.alarm} element={<Outlet />}>
        <Route path={""} element={<Alarms />} />
        <Route path={":action"} element={<MutateAlarm />} />
      </Route>
      <Route path={"*"} element={<Navigate to={paths.alarm} />} />
    </Routes>
  )
}