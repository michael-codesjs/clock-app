import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { paths } from "./constants";
import Alarm from "./pages/Alarm";
import AddAlarm from "./pages/Alarm/Add"



export default function () {
  return (
    <Routes>

      <Route path={paths.alarm} element={<Alarm />} />
      <Route path={paths.alarm+"/add"} element={<AddAlarm />} />
      <Route path="*" element={<Navigate to={paths.alarm} />} />
    </Routes>
  )
}