import { useState, useEffect } from "react";
import CardComponent from "../cards/CardComponent";
import { BsPeopleFill } from "react-icons/bs";
import {
  countPatients,
  countUsers,
  countVeterinarians,
} from "../user/UserService";
import { countAppointments } from "../appointment/AppointmentService";
import RegistrationChart from "../charts/RegistrationChart";
import AppointmentChart from "../charts/AppointmentChart";
import AccountChart from "../charts/AccountChart";
import VetSpecializationChart from "../charts/VetSpecializationChart";

const AdminOverview = () => {
  const [userCount, setUserCount] = useState(0);
  const [veterinarianCount, setVeterinarianCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const usrCount = await countUsers();
      const vetCount = await countVeterinarians();
      const patCount = await countPatients();
      const appCount = await countAppointments();
      setUserCount(usrCount);
      setVeterinarianCount(vetCount);
      setPatientCount(patCount);
      setAppointmentCount(appCount);
    };

    fetchCounts();
  }, []);

  return (
    <main>
      <h5 className="chart-title">Обзор деятельности</h5>

      <div className="main-cards">
        <CardComponent
          label={"ПОЛЬЗОВАТЕЛИ"}
          count={userCount}
          IconComponent={BsPeopleFill}
        />

        <CardComponent
          label={"ЗАПИСИ НА ПРИЕМ"}
          count={appointmentCount}
          IconComponent={BsPeopleFill}
        />

        <CardComponent
          label={"ВЕТЕРИНАРЫ"}
          count={veterinarianCount}
          IconComponent={BsPeopleFill}
        />

        <CardComponent
          label={"КЛИЕНТЫ"}
          count={patientCount}
          IconComponent={BsPeopleFill}
        />
      </div>
      <div className="charts">
        <div className="chart-container">
          <RegistrationChart />
        </div>

        <div className="chart-container">
          <AppointmentChart />
        </div>

        <div className="chart-container">
          <AccountChart />
        </div>

        <div className="chart-container">
          <VetSpecializationChart />
        </div>
      </div>
    </main>
  );
};

export default AdminOverview;
