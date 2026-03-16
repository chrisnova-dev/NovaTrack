import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Home from "../pages/Home";
// import About from "../pages/About";
import MainLayout from "../components/layout/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Route>
    </Routes>
  );
}
