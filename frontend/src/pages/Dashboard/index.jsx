import PageHeader from "../../components/dashboard/PageHeader";
import StatGrid from "../../components/dashboard/StatGrid";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Crime Analytics Dashboard"
        subtitle="Operational Crime Analytics & AI Intelligence Overview"
      />

      <StatGrid />
    </div>
  );
};

export default Dashboard;