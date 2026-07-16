import PageHeader from "../../components/dashboard/PageHeader";
import StatGrid from "../../components/dashboard/StatGrid";
import TrendChart from "../../components/dashboard/TrendChart";
import CrimeCategoryChart from "../../components/dashboard/CrimeCategoryChart";

import dashboardStats from "../../data/dashboardStats";
import crimeTrend from "../../data/crimeTrend";
import crimeCategories from "../../data/crimeCategories";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Crime Analytics Dashboard"
        subtitle="Operational Crime Analytics & AI Intelligence Overview"
      />

      <StatGrid stats={dashboardStats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TrendChart data={crimeTrend} />
        </div>

        <CrimeCategoryChart data={crimeCategories} />
      </div>
    </div>
  );
};

export default Dashboard;