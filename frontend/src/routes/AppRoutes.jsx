import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import Dashboard from "../pages/Dashboard";
import CrimeMap from "../pages/CrimeMap";
import Officers from "../pages/Officers";
import Assistant from "../pages/Assistant";
import Reports from "../pages/Reports";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<CrimeMap />} />
        <Route path="/officers" element={<Officers />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;