import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import Dashboard from "../pages/Dashboard";
import CrimeMap from "../pages/CrimeMap";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<CrimeMap />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;