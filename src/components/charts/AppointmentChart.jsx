import React, { useState, useEffect } from "react";
import CustomPieChart from "./CustomPieChart";
import { getAppointmentsSummary } from "../appointment/AppointmentService";
import { formatAppointmentStatus } from "../utils/utilities";
import NoDataAvailable from "../common/NoDataAvailable";

const AppointmentChart = () => {
  const [appointmentData, setAppointmentData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    getAppointmentsInfo();

    const intervalId = setInterval(() => {
      getAppointmentsInfo();
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section>
      {appointmentData && appointmentData.length > 0 ? (
        <React.Fragment>
          <h5 className="mb-4 chart-title">Обзор статусов приемов</h5>
          <CustomPieChart data={appointmentData} />
        </React.Fragment>
      ) : (
        <NoDataAvailable dataType={"appointment data"} message={errorMessage} />
      )}
    </section>
  );
};

export default AppointmentChart;
