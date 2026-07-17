import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import Dashboard from "../pages/Dashboard";
import CrimeMap from "../pages/CrimeMap";
import Officers from "../pages/Officers";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<CrimeMap />} />
        <Route path="/officers" element={<Officers />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;