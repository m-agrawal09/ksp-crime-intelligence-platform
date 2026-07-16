import StatCard from "./StatCard";
import dashboardStats from "../../data/dashboardStats";

const StatGrid = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((item) => (
        <StatCard
        key={item.title}
        title={item.title}
        value={item.value}
        change={item.change}
        icon={item.icon}
        color={item.color}
        />
      ))}
    </div>
  );
};

export default StatGrid;