import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import ChartCard from "./ChartCard";

const COLORS = [
  "#2563EB",
  "#DC2626",
  "#F59E0B",
  "#10B981",
  "#8B5CF6",
];

const CrimeCategoryChart = ({ data }) => {
  return (
    <ChartCard
      title="Crime Categories"
      subtitle="Distribution of reported crimes"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              wrapperStyle={{
                color: "#CBD5E1",
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default CrimeCategoryChart;