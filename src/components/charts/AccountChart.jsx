import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAggregatedUsersAccountByActiveStatus } from "../user/UserService";

const AccountChart = () => {
  const [accountData, setAccountData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getAccountActivity = async () => {
      try {
        const response = await getAggregatedUsersAccountByActiveStatus();
        const accountActivity = response.data;

        const transformedData = [
          {
            name: "Активные аккаунты клиентов",
            value: accountActivity.Enabled?.PATIENT || 0,
            color: "#d26161",
          },
          {
            name: "Заблокированные аккаунты клиентов",
            value: accountActivity["Non-Enabled"]?.PATIENT || 0,
            color: "#926262",
          },
          {
            name: "Активные аккаунты ветеринаров",
            value: accountActivity.Enabled?.VET || 0,
            color: "#2f6a32",
          },
          {
            name: "Заблокированные аккаунты ветеринаров",
            value: accountActivity["Non-Enabled"]?.VET || 0,
            color: "#557a56",
          },
        ];

        setAccountData(transformedData);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    getAccountActivity();
  }, []);

  return (
    <div>
      <h5 className="mt-4 chart-title">Обзор активности аккаунтов</h5>
      <ResponsiveContainer width="80%" height={400}>
        <PieChart>
          <Pie
            data={accountData}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            fill="#8884d8"
            paddingAngle={1}
            minAngle={5}
            label
          >
            {accountData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
          <Legend layout="vertical" wrapperStyle={{ fontSize: "14px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccountChart;
