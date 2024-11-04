import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { getAggregateUsersByMonthAndType } from "../user/UserService";

const RegistrationChart = () => {
  const [userData, setUserData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const monthMap = {
    January: "Январь",
    February: "Февраль",
    March: "Март",
    April: "Апрель",
    May: "Май",
    June: "Июнь",
    July: "Июль",
    August: "Август",
    September: "Сентябрь",
    October: "Октябрь",
    November: "Ноябрь",
    December: "Декабрь",
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await getAggregateUsersByMonthAndType();
        const userData = response.data;

        const transformedData = Object.entries(userData).map(
          ([month, counts]) => {
            return {
              name: monthMap[month] || month,
              Ветеринары: counts.VET || 0,
              Клиенты: counts.PATIENT || 0,
            };
          }
        );
        setUserData(transformedData);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    getUsers();
  }, []);

  return (
    <ResponsiveContainer width="60%" height={400}>
      <h5 className="chart-title mb-5">Обзор регистраций пользователей</h5>
      <BarChart data={userData}>
        <XAxis dataKey="name" angle={-50} textAnchor="end" height={60} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={"Ветеринары"} fill="#2f6a32" />
        <Bar dataKey={"Клиенты"} fill="#d26161" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RegistrationChart;
