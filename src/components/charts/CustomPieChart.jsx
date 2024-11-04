import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useColorMapping from "../hooks/ColorMapping";
import { getStatusKey } from "../utils/utilities";

const CustomPieChart = ({
  data,
  dataKey = "value",
  nameKey = "name",
  statusKey = "status",
  width = "80%",
  height = 400,
}) => {
  const colors = useColorMapping();

  return (
    <section className="mb-5 mt-5">
      <ResponsiveContainer width={width} height={height}>
        <PieChart className="mt-4">
          <Pie
            dataKey={dataKey}
            data={data}
            label={({ [nameKey]: name }) => name}
          >
            {data &&
              data.map((entry, index) => {
                const statusKeyFormatted = getStatusKey(entry[statusKey]);
                const color = colors[statusKeyFormatted] || colors.default;
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
          <Legend layout="vertical" />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
};

export default CustomPieChart;
