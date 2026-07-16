import PageHeader from "../../components/dashboard/PageHeader";
import StatGrid from "../../components/dashboard/StatGrid";
import TrendChart from "../../components/dashboard/TrendChart";

import dashboardStats from "../../data/dashboardStats";
import crimeTrend from "../../data/crimeTrend";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Crime Analytics Dashboard"
        subtitle="Operational Crime Analytics & AI Intelligence Overview"
      />

      <StatGrid stats={dashboardStats} />

      <TrendChart data={crimeTrend} />
    </div>
  );
};

export default Dashboard;