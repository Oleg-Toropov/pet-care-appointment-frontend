import { useState, useEffect } from "react";
import CustomPieChart from "./CustomPieChart";
import { getAppointmentsSummary } from "../appointment/AppointmentService";
import { formatAppointmentStatus } from "../utils/utilities";

const AppointmentChart = () => {
  const [appointmentData, setAppointmentData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getAppointmentsInfo = async () => {
      try {
        const response = await getAppointmentsSummary();
        const translatedData = response.data.map((item) => ({
          ...item,
          status: item.name,
          name: formatAppointmentStatus(item.name),
        }));

        setAppointmentData(translatedData);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    getAppointmentsInfo();
  }, []);

  return (
    <div>
      <h5 className="mb-4 chart-title">Обзор записей на приём</h5>
      <CustomPieChart data={appointmentData} />
    </div>
  );
};

export default AppointmentChart;
